// Configuración del servidor
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require("./app");
const { prisma, connectionDB } = require("./db");
const port = process.env.PORT || 5000;

(async () => {
    await connectionDB();

    app.listen(port, () => {});

    const shutdown = async () => {try {
            await prisma.$disconnect();
        } catch (err) {}
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();

















