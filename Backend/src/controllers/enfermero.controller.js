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
// Listar todos los enfermeros
const listEnfermeros = async (req, resp) => {
    try {
        const enfermeros = await prisma.enfermero.findMany({
            include: { servicio: true, turno: true }
        });
        resp.json({ success: true, data: enfermeros });
    } catch (err) {
        console.error('Error listando enfermeros:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Crear un nuevo enfermero
const createEnfermero = async (req, resp) => {
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, especialidad, esCoordinador } = req.body;

    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    try {
        const enfermero = await prisma.enfermero.create({
            data: {
                numeroEmpleado,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                especialidad: especialidad || null,
                esCoordinador: esCoordinador === true || esCoordinador === 'true'
            }
        });

        resp.status(201).json({ success: true, data: enfermero });
    } catch (err) {
        console.error('Error creando enfermero:', err);
        // Manejar error de unique constraint (numeroEmpleado)
        if (err.code === 'P2002' && err.meta && err.meta.target && err.meta.target.includes('numeroEmpleado')) {
            return resp.status(409).json({ success: false, error: 'Número de empleado ya existe' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Eliminar un enfermero por ID
const deleteEnfermero = async (req, resp) => {
    const { id } = req.params;

    if (!id) {
        return resp.status(400).json({ success: false, error: 'ID de enfermero requerido' });
    }

    try {
        // Verificar que el enfermero existe
        const enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId: parseInt(id) }
        });

        if (!enfermero) {
            return resp.status(404).json({ success: false, error: 'Enfermero no encontrado' });
        }

        // Eliminar el enfermero
        await prisma.enfermero.delete({
            where: { enfermeroId: parseInt(id) }
        });

        resp.json({ success: true, message: 'Enfermero eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando enfermero:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Actualizar un enfermero por ID
const updateEnfermero = async (req, resp) => {
    const { id } = req.params;
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, especialidad, esCoordinador } = req.body;

    if (!id) {
        return resp.status(400).json({ success: false, error: 'ID de enfermero requerido' });
    }

    try {
        // Verificar que el enfermero existe
        const existing = await prisma.enfermero.findUnique({ where: { enfermeroId: parseInt(id) } });
        if (!existing) {
            return resp.status(404).json({ success: false, error: 'Enfermero no encontrado' });
        }

        const data = {};
        if (numeroEmpleado !== undefined) data.numeroEmpleado = numeroEmpleado;
        if (nombre !== undefined) data.nombre = nombre;
        if (apellidoPaterno !== undefined) data.apellidoPaterno = apellidoPaterno;
        if (apellidoMaterno !== undefined) data.apellidoMaterno = apellidoMaterno;
        if (especialidad !== undefined) data.especialidad = especialidad;
        if (esCoordinador !== undefined) data.esCoordinador = esCoordinador === true || esCoordinador === 'true';

        const updated = await prisma.enfermero.update({
            where: { enfermeroId: parseInt(id) },
            data
        });

        resp.json({ success: true, data: updated });
    } catch (err) {
        console.error('Error actualizando enfermero:', err);
        if (err.code === 'P2002' && err.meta && err.meta.target && err.meta.target.includes('numeroEmpleado')) {
            return resp.status(409).json({ success: false, error: 'Número de empleado ya existe' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

module.exports = {
    login,
    listEnfermeros,
    createEnfermero,
    deleteEnfermero,
    updateEnfermero
};