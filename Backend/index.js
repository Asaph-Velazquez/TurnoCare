const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Inicializar Prisma Client
const prisma = new PrismaClient();

//peticion para recibir datos del usuario
app.post("/login", async (req, resp)=> {
    const {numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno} = req.body;
    
    // Validar que se reciban los datos
    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
        return resp.status(400).json({error: "Todos los campos son requeridos: número de empleado, nombre, apellido paterno y apellido materno"});
    }
    
    try{
        // Buscar en la tabla Enfermero usando Prisma
        const enfermero = await prisma.enfermero.findFirst({
            where: {
                numeroEmpleado,
                nombre,
                apellidoPaterno,
                apellidoMaterno
            },
            include: {
                servicio: true,  // Incluir información del servicio
                turno: true      // Incluir información del turno
            }
        });
        
        if (enfermero) {
            resp.json({
                success: true,
                message: "Login exitoso",
                user: {
                    userid: enfermero.enfermeroId,
                    numeroEmpleado: enfermero.numeroEmpleado,
                    nombre: enfermero.nombre,
                    apellidoPaterno: enfermero.apellidoPaterno,
                    apellidoMaterno: enfermero.apellidoMaterno,
                    especialidad: enfermero.especialidad,
                    esCoordinador: enfermero.esCoordinador,
                    turnoAsignadoId: enfermero.turnoAsignadoId,
                    servicioActualId: enfermero.servicioActualId,
                    servicio: enfermero.servicio,
                    turno: enfermero.turno
                }
            });
        } else {
            resp.status(401).json({
                success: false,
                error: "Los datos ingresados no coinciden con ningún enfermero registrado"
            });
        }
    }catch(err){
        console.error("Error en login:", err);
        resp.status(500).json({error: "Error interno del servidor"});
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

// Manejar cierre graceful de Prisma
process.on('SIGINT', async () => {
    console.log('🔌 Cerrando conexión a base de datos...');
    await prisma.$disconnect();
    process.exit(0);
});