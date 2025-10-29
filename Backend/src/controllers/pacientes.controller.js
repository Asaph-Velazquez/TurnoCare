const { prisma } = require("../dbPostgres");

// Listar todos los pacientes
const listPacientes = async (req, resp) => {
    try {
        const pacientes = await prisma.paciente.findMany();
        resp.json({ success: true, data: pacientes });
    } catch (err) {
        console.error('Error listando pacientes:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Crear un nuevo paciente
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

    /*if (!apellidop || !apellidom || !nombre || !numeroExpediente || !edad || !numeroCama || !numeroHabitacion || !fechaIngreso || !motivoConsulta || !servicioId) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }*/

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
    } catch (err) {
        console.error('Error creando paciente:', err);
        if (err.code === 'P2002') {
            return resp.status(409).json({ success: false, error: 'Número de expediente ya existe' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Eliminar paciente
const deletePaciente = async (req, resp) => {
    const { id } = req.params;
    
    try {
        await prisma.paciente.delete({
            where: { pacienteId: parseInt(id) }
        });
        resp.json({ success: true, message: 'Paciente eliminado' });
    } catch (err) {
        console.error('Error eliminando paciente:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Actualizar paciente
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
        motivoConsulta
    } = req.body;

    try {
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
                motivoConsulta
            }
        });

        resp.json({ success: true, data: paciente });
    } catch (err) {
        console.error('Error actualizando paciente:', err);
        if (err.code === 'P2002') {
            return resp.status(409).json({ success: false, error: 'Número de expediente ya existe' });
        }
        if (err.code === 'P2025') {
            return resp.status(404).json({ success: false, error: 'Paciente no encontrado' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

module.exports = {
    listPacientes,
    createPaciente,
    deletePaciente,
    updatePaciente
};

