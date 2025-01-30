const { nanoid } = require('nanoid');
const tasks = require('./task');
const db = require('./db');

const addTasksHandler = async(request, h) => {

    try {
        const { title = "No Title", description = "No Description", status = "To-Do", deadline = new Date().toISOString() } = request.payload || {};

        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const formattedDeadline = new Date(deadline).toISOString();
    
        const [result] = await db.query(`INSERT INTO tasks_data (id, title, description, status, deadline, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, title, description, status, formattedDeadline, createdAt, updatedAt]);
    
        if(result.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'Task berhasil ditambahkan',
                data: {
                    taskId: id,
                }
            })
            response.code(201);
            return response;
        }
    
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan catatan',
        })
        response.code(400);
        return response;
    
    } catch(error) {
        console.error(error);
    } 
}

const getAllTasks = async(request, h) => {
    const { title, status } = request.query;

    let sqlQuery = `SELECT title, description, status, deadline FROM tasks_data WHERE 1=1`;
    let queryParams = [];

    if(title !== undefined) {
        sqlQuery += ` AND title LIKE ?`;
        queryParams.push(`%${title}%`);
    }

    if(status !== undefined) {
        sqlQuery += ` AND status LIKE ?`;
        queryParams.push(`%${status}%`);
    }

    const [result] = await db.query(sqlQuery, queryParams);

    const response = h.response({
        status: 'success',
        data: {
            tasks: result.map(({ title, description, status, deadline }) => ({ title, description, status, deadline })),
        }
    });
    response.code(200);
    return response;
}

const getSpecificTasks = async(request, h) => {
    const { taskId } = request.params;

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
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    })
    response.code(404);
    return response;
}

const updateTask = async(request, h) => {
    const { taskId } = request.params;
    
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
    })
    response.code(200);
    return response;
  
}

const deleteTasks = async(request, h) => {
    const { taskId } = request.params;
    const [task] = await db.query(`DELETE FROM tasks_data WHERE id = ?`, [taskId]);

    if(task.affectedRows === 1) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        })
        response.code(200);
        return response;
    }

    const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus',
    })
    response.code(400);
    return response;
}

module.exports = { addTasksHandler, getAllTasks, getSpecificTasks, updateTask, deleteTasks };