const Hapi = require('@hapi/hapi');
const hello = require('./routes');

const init = async() => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
    })

    server.route(hello)
    await server.start();

    console.log(`Server berjalan di ${server.info.uri}`);
}

init();
