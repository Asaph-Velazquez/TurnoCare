const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const connectionDB = async () => {
    
    try {
        await prisma.$connect();
        return { success: true, prisma };
    } catch (error) {
        return { success: false, error: error };
    }
};

module.exports = { connectionDB, prisma };

