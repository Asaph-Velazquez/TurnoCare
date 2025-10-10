// Configuración del servidor
const app = require("./app");
const { prisma } = require("./dbPostgres");
const { connectionDB } = require("./dbPostgres");


const port = 5000;


(async () => {

    await connectionDB();

    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });


    // Manejo de cierre
    process.on('SIGINT', async () => {
        console.log('🔌 Cerrando conexión a base de datos...');
        await prisma.$disconnect();
        process.exit(0);
    });
})();















