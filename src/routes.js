const { addTasksHandler, getAllTasks, getSpecificTasks, deleteTasks, updateTask } = require("./handler")

const routes = [
    {
        method: 'POST',
        path: '/tasks',
        handler: addTasksHandler,
    },
    {
        method: 'GET',
        path: '/tasks',
        handler: getAllTasks,
    },
    {
        method: 'GET',
        path: '/tasks/{taskId}',
        handler: getSpecificTasks,
    },
    {
        method: 'PUT',
        path: '/tasks/{taskId}',
        handler: updateTask,
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        handler: deleteTasks,
    },
]

module.exports = routes
