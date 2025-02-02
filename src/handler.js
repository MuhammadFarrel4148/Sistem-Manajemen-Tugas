const { nanoid } = require('nanoid');
const db = require('./db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const GenerateToken = (user) => {
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const AccessValidation = async(request, h) => {
    const authorization = request.headers.authorization;

    if(!authorization) {
        const response = h.respone({
            status: 'fail',
            message: 'Unauthorized',
        });
        response.code(400);
        return response.takeover();
    };

    const token = authorization.split(' ')[1];
    const [isBlacklist] = await db.query(`SELECT * FROM tokenblacklist WHERE token = ?`, [token]);

    if(isBlacklist.length > 0) {
        const response = h.response({
            status: 'fail',
            message: 'Unauthorized',
        });
        response.code(400);
        return response.takeover();
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.auth = { credentials: decoded};
        return h.continue;
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Unauthorized',
        });
        response.code(400);
        return response.takeover();
    };
};

const signUp = async(request, h) => {
    const { username, email, password } = request.payload;
    
    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if(existingUser.length > 0) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal untuk menambahkan, email sudah digunakan',
            });
            response.code(400);
            return response;
        };

        const id = nanoid(16);
        
        const [result] = await db.query('INSERT INTO users(id, username, email, password) VALUES(?, ?, ?, ?)', [id, username, email, password]);

        if(result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    username: username,
                    email: email,
                }
            });
            response.code(201);
            return response;
        };

        const response = h.response({
            status: 'fail',
            message: 'User gagal ditambahkan',
        });
        response.code(400);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const signIn = async(request, h) => {
    const { email, password } = request.payload;

    try {
        const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password]);

        if(existingUser.length === 1) {
            const token = GenerateToken(existingUser);
    
            const response = h.response({
                status: 'success',
                message: 'Berhasil login ke user',
                data: {
                    user: {
                        username: existingUser[0].username,
                        email: existingUser[0].email,
                    }
                },
                token: token,
            });
            response.code(200);
            return response;
        };
    
        const response = h.response({
            status: 'fail',
            message: 'Gagal login ke user, email atau password salah',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const forgotPassword = async(request, h) => {
    const { email } = request.payload;
    
    try {
        const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
        if(existingEmail.length === 1) {
            const codeOTP = nanoid(5);
            await db.query(`INSERT INTO codeotp(email, code) VALUES(?, ?)`, [email, codeOTP]);
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });
    
            await transporter.sendMail({
                from: 'Sistem Manajemen Tugas',
                to: email,
                subject: `OTP Verification`,
                text: `This is your Code OTP ${codeOTP}, don't share it with someone except you`,
            });
    
            const response = h.response({
                status: 'success',
                message: 'Periksa email anda untuk reset kata sandi'
            });
            response.code(200);
            return response; 
        };
            
        const response = h.response({
            status: 'fail',
            message: 'Email tidak ditemukan, periksa kembali',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const otpVerification = async(request, h) => {
    const { codeOTP, newPassword } = request.payload;

    try {
        const [existingOTP] = await db.query(`SELECT * FROM codeotp WHERE code = ?`, [codeOTP]);

        if(existingOTP.length > 0) {
            const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [existingOTP[0].email]);
            await db.query(`UPDATE users SET password = ? WHERE email = ?`, [newPassword, existingUser[0].email]);
            await db.query(`DELETE FROM codeotp WHERE code = ?`, [codeOTP]);
    
            const response = h.response({
                status: 'success',
                message: 'Password berhasil direset',
            });
            response.code(200);
            return response;
        }
    
        const response = h.response({
            status: 'fail',
            message: 'Invalid Code OTP',
        })
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    }
};

const logOut = async(request, h) => {
    const authorization = request.headers.authorization;

    try {
        if(!authorization) {
            const response = h.response({
                status: 'fail',
                message: 'Unauthorized',
            });
            response.code(400);
            return response;
        };
    
        const token = authorization.split(' ')[1];
        const [isBlacklist] = await db.query(`SELECT * FROM tokenblacklist WHERE token = ?`, [token]);
    
        if(isBlacklist.length > 0) {
            const response = h.response({
                status: 'fail',
                message: 'Unauthorized',
            });
            response.code(400);
            return response;   
        };

        jwt.verify(token, process.env.JWT_SECRET);
        await db.query(`INSERT INTO tokenblacklist(token) VALUES(?)`, [token]);

        const response = h.response({
            status: 'success',
            message: 'Berhasil logout',
        });
        response.code(200);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const addTasksHandler = async(request, h) => {
    const userId = request.auth.credentials.id;

    try {
        const { title = "No Title", description = "No Description", status = "To-Do", deadline = new Date().toISOString() } = request.payload || {};

        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const formattedDeadline = new Date(deadline).toISOString();
    
        const [result] = await db.query(`INSERT INTO tasks_data (id, userId, title, description, status, deadline, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, userId, title, description, status, formattedDeadline, createdAt, updatedAt]);
    
        if(result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Task berhasil ditambahkan',
                data: {
                    taskId: id,
                }
            });
            response.code(201);
            return response;
        };
    
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan catatan',
        });
        response.code(400);
        return response;
    
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        })
        response.code(500);
        return response;
    };
};

const getAllTasks = async(request, h) => {
    const { title, status } = request.query;

    try {
        let sqlQuery = `SELECT title, description, status, deadline FROM tasks_data WHERE 1=1`;
        let queryParams = [];
    
        if(title !== undefined) {
            sqlQuery += ` AND title LIKE ?`;
            queryParams.push(`%${title}%`);
        };
    
        if(status !== undefined) {
            sqlQuery += ` AND status LIKE ?`;
            queryParams.push(`%${status}%`);
        };
    
        const [result] = await db.query(sqlQuery, queryParams);
    
        const response = h.response({
            status: 'success',
            data: {
                tasks: result.map(({ title, description, status, deadline }) => ({ title, description, status, deadline })),
            }
        });
        response.code(200);
        return response;
        
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const getSpecificTasks = async(request, h) => {
    const { taskId } = request.params;

    try {
        const [task] = await db.query(`SELECT * FROM tasks_data WHERE id = ?`, [taskId]);

        if(task.length == 1) {
            const response = h.response({
                status: 'success',
                data: {
                    task,
                }
            })
            response.code(200);
            return response;
        };
    
        const response = h.response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

const updateTask = async(request, h) => {
    const { taskId } = request.params;

    try {
        const [task] = await db.query(`SELECT * FROM tasks_data WHERE id = ?`, [taskId]);

        if(!task) {
            const response = h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            })
            response.code(404);
            return response;
        }
        
        const { title = task[0].title, description = task[0].description, status = task[0].status, deadline = task[0].deadline } = request.payload || {};
            
        const updatedAt = new Date().toISOString();
    
        await db.query(`UPDATE tasks_data SET title = ?, description = ?, status = ?, deadline = ?, updatedAt = ? WHERE id = ?`, [title, description, status, deadline, updatedAt, taskId]);
    
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
            data: {
                taskUpdate: { title, description, status, deadline },
            }
        });
        response.code(200);
        return response;        
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    }; 
};

const deleteTasks = async(request, h) => {
    const { taskId } = request.params;

    try {
        const [task] = await db.query(`DELETE FROM tasks_data WHERE id = ?`, [taskId]);

        if(task.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil dihapus'
            });
            response.code(200);
            return response;
        };
    
        const response = h.response({
            status: 'fail',
            message: 'Catatan gagal dihapus',
        });
        response.code(400);
        return response;
        
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Error!',
        });
        response.code(500);
        return response;
    };
};

module.exports = { addTasksHandler, getAllTasks, getSpecificTasks, updateTask, deleteTasks, signUp, signIn, forgotPassword, otpVerification, logOut, AccessValidation };