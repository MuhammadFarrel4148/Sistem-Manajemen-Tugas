const { addTasksHandler, getAllTasks, getSpecificTasks, deleteTasks, updateTask, signUp, signIn, forgotPassword, otpVerification, logOut, AccessValidation } = require("./handler")

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
        path: '/logout',
        handler: logOut,
    },
    {
        method: 'POST',
        path: '/tasks',
        options: {
            pre: [{ method: AccessValidation }]
        },
        handler: addTasksHandler,
    },
    {
        method: 'GET',
        path: '/tasks',
        options: {
            pre: [{ method: AccessValidation }]
        },
        handler: getAllTasks,
    },
    {
        method: 'GET',
        path: '/tasks/{taskId}',
        options: {
            pre: [{ method: AccessValidation }]
        },
        handler: getSpecificTasks,
    },
    {
        method: 'PUT',
        path: '/tasks/{taskId}',
        options: {
            pre: [{ method: AccessValidation }]
        },
        handler: updateTask,
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        options: {
            pre: [{ method: AccessValidation }]
        },
        handler: deleteTasks,
    },
]

module.exports = routes
