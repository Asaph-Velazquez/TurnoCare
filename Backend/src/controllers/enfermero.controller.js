const { prisma } = require("../dbPostgres");



// ===== LOGIN =====
const login = async (req, resp) => {
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
};



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

module.exports = {
    login
};