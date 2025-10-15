// Configuración del servidor
// Cargar variables de entorno (DATABASE_URL) antes de crear PrismaClient
require('dotenv').config();

const app = require("./app");
const { prisma, connectionDB } = require("./dbPostgres");

const port = process.env.PORT || 5000;

(async () => {
    await connectionDB();

    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });

    const shutdown = async () => {
        console.log('🔌 Cerrando conexión a base de datos...');
        try {
            await prisma.$disconnect();
        } catch (err) {
            console.error('Error al desconectar prisma:', err);
        }
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();















