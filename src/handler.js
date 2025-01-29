const { nanoid } = require('nanoid');
const tasks = require('./task');

const addTasksHandler = (request, h) => {
    const { title = "No Title", description = "No Description", status = "To-Do", deadline = new Date().toISOString() } = request.payload || {};

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const formattedDeadline = new Date(deadline).toISOString();

    const newTask = {
        id, title, description, status, deadline: formattedDeadline, createdAt, updatedAt,
    }

    tasks.push(newTask);
    const task = tasks.filter((task) => task.id === id);

    if(task !== undefined) {
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
}

const getAllTasks = (request, h) => {
    const { title, status } = request.query;

    const filteredBooks = tasks.filter(tasks => 
        (title !== undefined ? tasks.title.toLowerCase().includes(title.toLowerCase()) : true) &&
        (status !== undefined ? tasks.status.toLowerCase().includes(status.toLowerCase()) : true)
    );

    const response = h.response({
        status: 'success',
        data: {
            tasks: filteredBooks.map(({ title, description, status, deadline }) => ({ title, description, status, deadline })),
        }
    });
    response.code(200);
    return response;
}

const getSpecificTasks = (request, h) => {
    const { taskId } = request.params;
    const task = tasks.filter((task) => task.id === taskId)[0];

    if(task !== undefined) {
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

const updateTask = (request, h) => {
    const { taskId } = request.params;

    const index = tasks.findIndex((task) => task.id === taskId);
    if(index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        })
    }
    
    const { title = tasks[index].title, description = tasks[index].description, status = tasks[index].status, deadline = tasks[index].deadline } = request.payload || {};
        
    const updatedAt = new Date().toISOString();

    tasks[index] = {
        ...tasks[index],
        title,
        description,
        status,
        deadline,
        updatedAt,
    }

    const task = tasks[index];

    const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
        data: {
            taskUpdate: { title: task.title, description: task.description, status: task.status, deadline: task.deadline},
        }
    })
    response.code(200);
    return response;
  
}

const deleteTasks = (request, h) => {
    const { taskId } = request.params;
    const index = tasks.findIndex((task) => task.id === taskId);

    if(index !== -1) {
        tasks.splice(index, 1);
        const task = tasks.filter((task) => task.id === taskId)[0];

        if(task === undefined) {
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil dihapus'
            })
            response.code(200);
            return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus',
    })
    response.code(400);
    return response;
}

module.exports = { addTasksHandler, getAllTasks, getSpecificTasks, updateTask, deleteTasks };