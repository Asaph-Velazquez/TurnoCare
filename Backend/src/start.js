const fs = require('fs');
const path = require('path');

// Este script se ejecuta al iniciar el backend para configurar rutas absolutas
// __dirname es Backend/src, necesitamos ir a Backend
const backendDir = path.resolve(__dirname, '..');
const dbPath = path.join(backendDir, 'prisma', 'turnocare.db');

// Normalizar ruta eliminando el prefijo \\?\ de Windows que causa problemas con Prisma
let normalizedDbPath = dbPath.replace(/\\\\\?\\/, '').replace(/\\/g, '/');

// Actualizar DATABASE_URL con ruta absoluta (formato Unix para SQLite)
const dbUrl = `file:${normalizedDbPath}`;
process.env.DATABASE_URL = dbUrl;

console.log('🔧 Configuración de producción');
console.log('📂 Backend dir:', backendDir);
console.log('📂 Database path (original):', dbPath);
console.log('📂 Database path (normalized):', normalizedDbPath);
console.log('📊 Database URL:', dbUrl);

// Verificar que la BD existe
if (!fs.existsSync(dbPath)) {
    console.error('❌ Base de datos no encontrada en:', dbPath);
    console.error('   Contenido del directorio prisma:');
    const prismaDir = path.join(backendDir, 'prisma');
    if (fs.existsSync(prismaDir)) {
        fs.readdirSync(prismaDir).forEach(file => {
            console.error('   -', file);
        });
    } else {
        console.error('   Directorio prisma no existe!');
    }
    process.exit(1);
}

const stats = fs.statSync(dbPath);
console.log('✅ Base de datos encontrada (' + (stats.size / 1024).toFixed(2) + ' KB)');

// Cambiar el working directory al Backend para que las rutas relativas funcionen
process.chdir(backendDir);
console.log('📁 Working dir:', process.cwd());
console.log('\n🚀 Iniciando servidor Express...\n');

// Continuar con el servidor normal
require('./index');
