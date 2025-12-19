// Script de prueba para verificar la conexión a la BD
const path = require('path');

console.log('=== DIAGNÓSTICO DE CONEXIÓN ===');
console.log('Working dir:', process.cwd());
console.log('__dirname:', __dirname);

// 1. Verificar .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
console.log('\n📄 DATABASE_URL desde .env:', process.env.DATABASE_URL);

// 2. Calcular ruta absoluta
const dbPath = path.join(__dirname, '..', 'prisma', 'turnocare.db');
console.log('📁 Ruta absoluta calculada:', dbPath);

// 3. Verificar existencia
const fs = require('fs');
console.log('✅ Archivo existe?', fs.existsSync(dbPath));

// 4. Intentar setear DATABASE_URL con ruta absoluta
const absoluteUrl = `file:${dbPath.replace(/\\/g, '/')}`;
process.env.DATABASE_URL = absoluteUrl;
console.log('🔧 DATABASE_URL configurada:', process.env.DATABASE_URL);

// 5. Intentar conectar Prisma
console.log('\n🚀 Intentando conectar Prisma...');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    // Probar una query simple
    const count = await prisma.hospital.count();
    console.log(`✅ Hospitales en BD: ${count}`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
})();
