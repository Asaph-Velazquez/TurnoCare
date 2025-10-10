// Configuración del servidor
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// ===== LOGIN =====
app.post("/login", async (req, resp)=> {
    const {numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno} = req.body;
    
    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
        return resp.status(400).json({error: "Todos los campos son requeridos"});
    }
    
    try{
        const enfermero = await prisma.enfermero.findFirst({
            where: {
                numeroEmpleado,
                nombre,
                apellidoPaterno,
                apellidoMaterno
            },
            include: {
                servicio: true,
                turno: true
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
                error: "Datos incorrectos"
            });
        }
    }catch(err){
        console.error("Error en login:", err);
        resp.status(500).json({error: "Error del servidor"});
    }
});

// ===== ENFERMEROS =====
// Aquí van los endpoints para manejar enfermeros
// Ejemplo:
// app.get("/api/enfermeros", async (req, resp) => {
//     try {
//         const enfermeros = await prisma.enfermero.findMany();
//         resp.json(enfermeros);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });


// ===== PACIENTES =====
// Aquí van los endpoints para manejar pacientes
// Ejemplo:
// app.get("/api/pacientes", async (req, resp) => {
//     try {
//         const pacientes = await prisma.paciente.findMany();
//         resp.json(pacientes);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });


// ===== SERVICIOS =====
// Aquí van los endpoints para manejar servicios del hospital
// Ejemplo:
// app.get("/api/servicios", async (req, resp) => {
//     try {
//         const servicios = await prisma.servicio.findMany();
//         resp.json(servicios);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });


// ===== TURNOS =====
// Aquí van los endpoints para manejar turnos
// Ejemplo:
// app.get("/api/turnos", async (req, resp) => {
//     try {
//         const turnos = await prisma.turno.findMany();
//         resp.json(turnos);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });


// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log('🔌 Cerrando conexión a base de datos...');
    await prisma.$disconnect();
    process.exit(0);
});