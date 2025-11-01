const { prisma } = require("../dbPostgres");

// Autenticación
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
                    habitacionAsignada: enfermero.habitacionAsignada,
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

// CRUD - Leer todos
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

// CRUD - Crear
const createEnfermero = async (req, resp) => {
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, especialidad, esCoordinador, servicioActualId, habitacionesAsignadas, turno } = req.body;

    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    try {
        if (servicioActualId) {
            const servicioExists = await prisma.servicio.findUnique({
                where: { servicioId: servicioActualId }
            });
            
            if (!servicioExists) {
                return resp.status(400).json({ 
                    success: false, 
                    error: 'El servicio especificado no existe' 
                });
            }
        }

        const enfermero = await prisma.enfermero.create({
            data: {
                numeroEmpleado,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                especialidad: especialidad || null,
                esCoordinador: esCoordinador === true || esCoordinador === 'true',
                servicioActualId: servicioActualId || null
            }
        });

        resp.status(201).json({ success: true, data: enfermero });
    } catch (err) {
        console.error('Error creando enfermero:', err);
        if (err.code === 'P2002' && err.meta && err.meta.target && err.meta.target.includes('numeroEmpleado')) {
            return resp.status(409).json({ success: false, error: 'Número de empleado ya existe' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Actualizar
const updateEnfermero = async (req, resp) => {
    const { id } = req.params;
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno, especialidad, esCoordinador, servicioActualId, habitacionesAsignadas, turno } = req.body;

    if (!id) {
        return resp.status(400).json({ success: false, error: 'ID de enfermero requerido' });
    }

    try {
        const existing = await prisma.enfermero.findUnique({ where: { enfermeroId: parseInt(id) } });
        if (!existing) {
            return resp.status(404).json({ success: false, error: 'Enfermero no encontrado' });
        }

        if (servicioActualId !== undefined && servicioActualId !== null) {
            const servicioExists = await prisma.servicio.findUnique({
                where: { servicioId: servicioActualId }
            });
            
            if (!servicioExists) {
                return resp.status(400).json({ 
                    success: false, 
                    error: 'El servicio especificado no existe' 
                });
            }
        }

        const data = {};
        if (numeroEmpleado !== undefined) data.numeroEmpleado = numeroEmpleado;
        if (nombre !== undefined) data.nombre = nombre;
        if (apellidoPaterno !== undefined) data.apellidoPaterno = apellidoPaterno;
        if (apellidoMaterno !== undefined) data.apellidoMaterno = apellidoMaterno;
        if (especialidad !== undefined) data.especialidad = especialidad;
        if (esCoordinador !== undefined) data.esCoordinador = esCoordinador === true || esCoordinador === 'true';
        if (servicioActualId !== undefined) {
            if (servicioActualId === null || servicioActualId === "") {
                data.servicio = { disconnect: true };
            } else {
                data.servicio = { connect: { servicioId: servicioActualId } };
            }
        }
        if (habitacionesAsignadas !== undefined) data.habitacionAsignada = habitacionesAsignadas;
        if (turno !== undefined) {
            if (turno === null || turno === "") {
                data.turno = { disconnect: true };
            } else {
                const turnoObj = await prisma.turno.findFirst({ where: { nombre: { equals: turno, mode: 'insensitive' } } });
                if (!turnoObj) {
                    return resp.status(400).json({ success: false, error: `El turno '${turno}' no existe` });
                }
                data.turno = { connect: { turnoId: turnoObj.turnoId } };
            }
        }

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

// CRUD - Eliminar
const deleteEnfermero = async (req, resp) => {
    const { id } = req.params;

    if (!id) {
        return resp.status(400).json({ success: false, error: 'ID de enfermero requerido' });
    }

    try {
        const enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId: parseInt(id) }
        });

        if (!enfermero) {
            return resp.status(404).json({ success: false, error: 'Enfermero no encontrado' });
        }

        await prisma.enfermero.delete({
            where: { enfermeroId: parseInt(id) }
        });

        resp.json({ success: true, message: 'Enfermero eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando enfermero:', err);
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