const path = require('path');
const { app } = require('@tauri-apps/api');
const fs = require('fs');

/**
 * Obtiene la ruta de la base de datos según el entorno
 * En desarrollo: usa la ruta local
 * En producción: usa la ruta del bundle de Tauri
 */
async function getDatabasePath() {
  try {
    // Intenta obtener la ruta de recursos de Tauri (producción)
    const resourceDir = await app.resourceDir();
    const dbPath = path.join(resourceDir, 'Backend', 'prisma', 'turnocare.db');
    
    // Verifica si existe el archivo
    if (fs.existsSync(dbPath)) {
      return `file:${dbPath}`;
    }
  } catch (error) {
    // Si falla, estamos en desarrollo
  }
  
  // Ruta de desarrollo
  const devPath = path.join(__dirname, '..', 'prisma', 'turnocare.db');
  return `file:${devPath}`;
}

/**
 * Obtiene el puerto del servidor según el entorno
 */
function getServerPort() {
  return process.env.PORT || 5000;
}

/**
 * Verifica si la base de datos existe y está accesible
 */
async function checkDatabase() {
  const dbUrl = await getDatabasePath();
  const dbPath = dbUrl.replace('file:', '');
  
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Base de datos no encontrada: ${dbPath}`);
  }
  
  const stats = fs.statSync(dbPath);
  
  return dbUrl;
}

module.exports = {
  getDatabasePath,
  getServerPort,
  checkDatabase
};

