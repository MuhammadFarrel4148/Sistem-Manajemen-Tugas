const { addTasksHandler, getAllTasks, getSpecificTasks, deleteTasks, updateTask, signUp, signIn, forgotPassword, otpVerification } = require("./handler")

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: signUp,
    },
    {
        method: 'POST',
        path: '/login',
        handler: signIn,
    },
    {
        method: 'POST',
        path: '/forgotpassword',
        handler: forgotPassword,
    },
    {
        method: 'POST',
        path: '/inputotp',
        handler: otpVerification,
    },
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
