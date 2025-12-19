const { prisma } = require("../db");

// CRUD - Leer todos
const listTurnos = async (req, resp) => {
    try {
        const turnos = await prisma.turno.findMany({
            include: {
                enfermeros: true
            }
        });
        resp.json({ success: true, data: turnos });
    } catch (err) {resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Leer uno por ID
const getTurnoById = async (req, resp) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return resp.status(400).json({ success: false, error: "ID de turno inválido." });
    }

    try {
        const turno = await prisma.turno.findUnique({
            where: { turnoId: parseInt(id) },
            include: {
                enfermeros: true
            }
        });

        if (!turno) {
            return resp.status(404).json({ success: false, error: 'Turno no encontrado.' });
        }

        resp.json({ success: true, data: turno });
    } catch (err) {resp.status(500).json({ success: false, error: 'Error del servidor.' });
    }
};

// CRUD - Crear
const createTurno = async (req, resp) => {
    const { nombre, horaInicio, horaFin, tipo, observaciones } = req.body;

    // Validación: horaInicio y horaFin son requeridos
    if (!horaInicio || !horaFin) {
        return resp.status(400).json({ 
            success: false, 
            error: 'Los campos horaInicio y horaFin son requeridos.' 
        });
    }

    try {
        // Convertir las horas en formato ISO datetime para Prisma
        // Prisma espera DateTime para campos @db.Time
        const baseDate = '1970-01-01T';
        const horaInicioDateTime = new Date(`${baseDate}${horaInicio}:00.000Z`);
        const horaFinDateTime = new Date(`${baseDate}${horaFin}:00.000Z`);

        // Si se proporciona tipo, usarlo como nombre, sino usar un nombre por defecto
        const nombreTurno = nombre || tipo || 'Turno';

        const data = {
            nombre: nombreTurno,
            horaInicio: horaInicioDateTime,
            horaFin: horaFinDateTime,
        };

        const turno = await prisma.turno.create({
            data: data
        });

        resp.status(201).json({ 
            success: true, 
            data: turno, 
            message: 'Turno registrado exitosamente' 
        });
    } catch (err) {resp.status(500).json({ 
            success: false, 
            error: 'Error del servidor al intentar registrar el turno.' 
        });
    }
};

// CRUD - Actualizar
const updateTurno = async (req, resp) => {
    const { id } = req.params;
    const { nombre, horaInicio, horaFin } = req.body;

    if (!id || isNaN(parseInt(id))) {
        return resp.status(400).json({ success: false, error: "ID de turno inválido." });
    }

    try {
        // Verificar que el turno existe
        const turnoExiste = await prisma.turno.findUnique({
            where: { turnoId: parseInt(id) }
        });

        if (!turnoExiste) {
            return resp.status(404).json({ success: false, error: 'Turno no encontrado.' });
        }

        const data = {};
        
        if (nombre) data.nombre = nombre;
        
        if (horaInicio) {
            const baseDate = '1970-01-01T';
            data.horaInicio = new Date(`${baseDate}${horaInicio}:00.000Z`);
        }
        
        if (horaFin) {
            const baseDate = '1970-01-01T';
            data.horaFin = new Date(`${baseDate}${horaFin}:00.000Z`);
        }

        const turno = await prisma.turno.update({
            where: { turnoId: parseInt(id) },
            data: data
        });

        resp.json({ 
            success: true, 
            data: turno, 
            message: 'Turno actualizado exitosamente' 
        });
    } catch (err) {resp.status(500).json({ 
            success: false, 
            error: 'Error del servidor al intentar actualizar el turno.' 
        });
    }
};

// CRUD - Eliminar
const deleteTurno = async (req, resp) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return resp.status(400).json({ success: false, error: "ID de turno inválido." });
    }

    try {
        // Verificar que el turno existe
        const turnoExiste = await prisma.turno.findUnique({
            where: { turnoId: parseInt(id) }
        });

        if (!turnoExiste) {
            return resp.status(404).json({ success: false, error: 'Turno no encontrado.' });
        }

        await prisma.turno.delete({
            where: { turnoId: parseInt(id) }
        });

        resp.json({ 
            success: true, 
            message: 'Turno eliminado exitosamente' 
        });
    } catch (err) {resp.status(500).json({ 
            success: false, 
            error: 'Error del servidor al intentar eliminar el turno.' 
        });
    }
};

// Obtener turno por enfermeroId
const getTurnoByEnfermeroId = async (req, resp) => {
    const { enfermeroId } = req.params;

    if (!enfermeroId || isNaN(parseInt(enfermeroId))) {
        return resp.status(400).json({ success: false, error: "ID de enfermero inválido." });
    }

    try {
        const enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId: parseInt(enfermeroId) },
            include: {
                turno: true
            }
        });

        if (!enfermero) {
            return resp.status(404).json({ success: false, error: 'Enfermero no encontrado.' });
        }

        if (!enfermero.turno) {
            return resp.status(404).json({ success: false, error: 'El enfermero no tiene un turno asignado.' });
        }

        resp.json({ success: true, data: enfermero.turno });
    } catch (err) {
        resp.status(500).json({ success: false, error: 'Error del servidor.' });
    }
};

module.exports = {
    listTurnos,
    getTurnoById,
    createTurno,
    updateTurno,
    deleteTurno,
    getTurnoByEnfermeroId
};

