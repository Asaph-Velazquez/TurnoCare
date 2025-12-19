const { spawn } = require('child_process');
const path = require('path');
const { checkDatabase, getServerPort } = require('./config/paths');

let serverProcess = null;

/**
 * Inicia el servidor backend
 */
async function startBackendServer() {
  try {
    // Verificar base de datos
    await checkDatabase();
    
    const port = getServerPort();
    
    // Iniciar el servidor
    const serverPath = path.join(__dirname, 'index.js');
    serverProcess = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: { ...process.env, PORT: port }
    });
    
    serverProcess.on('error', (error) => {
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0) {
      }
    });
    
    return serverProcess;
    
  } catch (error) {
    throw error;
  }
}

/**
 * Detiene el servidor backend
 */
function stopBackendServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// Manejar cierre de la aplicación
process.on('exit', stopBackendServer);
process.on('SIGINT', () => {
  stopBackendServer();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stopBackendServer();
  process.exit(0);
});

module.exports = {
  startBackendServer,
  stopBackendServer
};

