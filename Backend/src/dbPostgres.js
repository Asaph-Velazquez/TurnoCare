const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectionDB = async () => {
    

    try {
        await prisma.$connect();
        console.log("okkkk, db connected" );
        return { success: true, prisma };
    } catch (error) {
        console.error("peto", error);
        return { success: false, error: error };
    }
};

module.exports = { connectionDB, prisma };

