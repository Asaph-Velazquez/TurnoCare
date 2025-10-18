const { prisma } = require("../dbPostgres");

// ===== HOSPITALES =====

/**
 * Registra un nuevo hospital en la base de datos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} resp - Objeto de respuesta de Express.
 */
const createHospital = async (req, resp) => {
    const { nombre, direccion, telefono } = req.body;

    // 1. Validación de campos requeridos
    if (!nombre || !direccion || !telefono) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos (nombre, dirección y teléfono).' });
    }

    try {
        // 2. Crear el nuevo registro de hospital usando Prisma
        const hospital = await prisma.hospital.create({
            data: {
                nombre,
                direccion,
                telefono,
                
            }
        });

        
        console.log(`✅ Hospital registrado: ${nombre}`);
        resp.status(201).json({ success: true, data: hospital, message: 'Hospital registrado exitosamente' });

    } catch (err) {
        console.error('❌ Error creando hospital:', err);
        
        // Manejo de error de unique constraint (ej: si el nombre del hospital debe ser único)
        if (err.code === 'P2002' && err.meta && err.meta.target && err.meta.target.includes('nombre')) {
             return resp.status(409).json({ success: false, error: 'Ya existe un hospital con ese nombre.' });
        }
        
        // Error genérico del servidor
        resp.status(500).json({ success: false, error: 'Error del servidor al intentar registrar el hospital.' });
    }
};

/**
 * Lista todos los hospitales registrados en la base de datos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} resp - Objeto de respuesta de Express.
 */
const listHospitales = async (req, resp) => {
    try {
        const hospitales = await prisma.hospital.findMany({
            // Puedes agregar 'select' u 'orderBy' si es necesario
        });
        
        resp.json({ success: true, data: hospitales });
    } catch (err) {
        console.error('Error listando hospitales:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};


module.exports = {
    createHospital,
    listHospitales
};