// Verificación de rutas para debugging
const path = require('path');
const fs = require('fs');

console.log('=== Verificación de rutas del Backend ===');
console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());

const envPath = path.join(__dirname, '..', '.env');
const dbPath = path.join(__dirname, '..', 'prisma', 'turnocare.db');

console.log('\n.env path:', envPath);
console.log('.env exists:', fs.existsSync(envPath));

console.log('\nDB path:', dbPath);
console.log('DB exists:', fs.existsSync(dbPath));

if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('DB size:', (stats.size / 1024).toFixed(2), 'KB');
}

console.log('\nDATABASE_URL:', process.env.DATABASE_URL);
console.log('=====================================\n');
