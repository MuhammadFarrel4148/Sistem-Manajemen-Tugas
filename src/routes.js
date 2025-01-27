const { addTasksHandler, getAllTasks, getSpecificTasks, deleteTasks } = require("./handler")

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
        handler: () => {}
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        handler: deleteTasks,
    },
]

module.exports = routes
