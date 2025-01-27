const Hapi = require('@hapi/hapi');

const init = async() => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
    })

    await server.start();

    console.log(`Server berjalan di ${server.info.uri}`);
}

init();
