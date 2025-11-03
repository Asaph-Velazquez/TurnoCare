const { prisma } = require("../dbPostgres");

// CRUD - Leer todos
const listPacientes = async (req, resp) => {
    try {
        const pacientes = await prisma.paciente.findMany();
        resp.json({ success: true, data: pacientes });
    } catch (err) {resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Leer por ID
const getPacienteById = async (req, resp) => {
    const { id } = req.params;
    try {
        const paciente = await prisma.paciente.findUnique({
            where: { pacienteId: parseInt(id) }
        });
        if (!paciente) {
            return resp.status(404).json({ success: false, error: 'Paciente no encontrado' });
        }
        resp.json({ success: true, data: paciente });
    } catch (err) {resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Crear
const createPaciente = async (req, resp) => {
    const { 
        apellidop,
        apellidom,
        nombre,
        numeroExpediente,
        edad,
        numeroCama,
        numeroHabitacion,
        fechaIngreso,
        motivoConsulta,
        servicioId
    } = req.body;

    try {
        const paciente = await prisma.paciente.create({
            data: {
                apellidop,
                apellidom,
                nombre,
                numeroExpediente,
                edad,
                numeroCama,
                numeroHabitacion,
                fechaIngreso,
                motivoConsulta,
                servicioId
            }
        });

        resp.status(201).json({ success: true, data: paciente });
    } catch (err) {if (err.code === 'P2002') {
            return resp.status(409).json({ success: false, error: 'Número de expediente ya existe' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Actualizar
const updatePaciente = async (req, resp) => {
    const { id } = req.params;
    const {
        numeroExpediente,
        nombre,
        apellidop,
        apellidom,
        edad,
        numeroCama,
        numeroHabitacion,
        motivoConsulta,
        servicioId
    } = req.body;

    try {
        if (servicioId !== undefined && servicioId !== null) {
            const servicioExists = await prisma.servicio.findUnique({
                where: { servicioId: servicioId }
            });
            
            if (!servicioExists) {
                return resp.status(400).json({ 
                    success: false, 
                    error: 'El servicio especificado no existe' 
                });
            }
        }

        const paciente = await prisma.paciente.update({
            where: { pacienteId: parseInt(id) },
            data: {
                numeroExpediente,
                nombre,
                apellidop,
                apellidom,
                edad,
                numeroCama,
                numeroHabitacion,
                motivoConsulta,
                servicioId: servicioId !== undefined ? servicioId : undefined
            }
        });

        resp.json({ success: true, data: paciente });
    } catch (err) {if (err.code === 'P2002') {
            return resp.status(409).json({ success: false, error: 'Número de expediente ya existe' });
        }
        if (err.code === 'P2025') {
            return resp.status(404).json({ success: false, error: 'Paciente no encontrado' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Eliminar
const deletePaciente = async (req, resp) => {
    const { id } = req.params;
    
    try {
        await prisma.paciente.delete({
            where: { pacienteId: parseInt(id) }
        });
        resp.json({ success: true, message: 'Paciente eliminado' });
    } catch (err) {resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

module.exports = {
    listPacientes,
    createPaciente,
    deletePaciente,
    updatePaciente,
    getPacienteById
};

