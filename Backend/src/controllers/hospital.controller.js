const { prisma } = require("../dbPostgres");

// CRUD - Leer todos
const listHospitales = async (req, resp) => {
    try {
        const hospitales = await prisma.hospital.findMany();
        resp.json({ success: true, data: hospitales });
    } catch (err) {
        console.error('Error listando hospitales:', err);
        resp.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// CRUD - Crear
const createHospital = async (req, resp) => {
    const { nombre, direccion, telefono } = req.body;

    if (!nombre || !direccion || !telefono) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos (nombre, dirección y teléfono).' });
    }

    try {
        const hospital = await prisma.hospital.create({
            data: {
                nombre,
                direccion,
                telefono,
            }
        });

        resp.status(201).json({ success: true, data: hospital, message: 'Hospital registrado exitosamente' });
    } catch (err) {
        console.error('Error creando hospital:', err);
        if (err.code === 'P2002' && err.meta && err.meta.target && err.meta.target.includes('nombre')) {
             return resp.status(409).json({ success: false, error: 'Ya existe un hospital con ese nombre.' });
        }
        resp.status(500).json({ success: false, error: 'Error del servidor al intentar registrar el hospital.' });
    }
};

// CRUD - Actualizar
const updateHospital = async (req, resp) => {
  const { id } = req.params;
  const { nombre, direccion, telefono } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return resp.status(400).json({ success: false, error: "ID de hospital inválido." });
  }

  try {
    const existing = await prisma.hospital.findUnique({
      where: { hospitalId: parseInt(id) },
    });

    if (!existing) {
      return resp.status(404).json({ success: false, error: "Hospital no encontrado." });
    }

    const updated = await prisma.hospital.update({
      where: { hospitalId: parseInt(id) },
      data: {
        nombre: nombre ?? existing.nombre,
        direccion: direccion ?? existing.direccion,
        telefono: telefono ?? existing.telefono,
      },
    });

    resp.json({ success: true, data: updated, message: "Hospital actualizado exitosamente." });
  } catch (err) {
    console.error("Error actualizando hospital:", err);
    resp.status(500).json({ success: false, error: err.message || "Error interno del servidor." });
  }
};

// CRUD - Eliminar
const deleteHospital = async (req, resp) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return resp.status(400).json({ success: false, error: "ID de hospital inválido." });
  }

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { hospitalId: parseInt(id) },
    });

    if (!hospital) {
      return resp.status(404).json({ success: false, error: "Hospital no encontrado." });
    }

    await prisma.hospital.delete({
      where: { hospitalId: parseInt(id) },
    });

    resp.json({ success: true, message: "Hospital eliminado correctamente." });
  } catch (err) {
    console.error("Error eliminando hospital:", err);
    if (err.code === "P2003") {
      return resp.status(409).json({
        success: false,
        error: "No se puede eliminar el hospital porque tiene registros relacionados.",
      });
    }
    resp.status(500).json({
      success: false,
      error: "Error del servidor al eliminar hospital.",
    });
  }
};

module.exports = {
  createHospital,
  listHospitales,
  updateHospital,
  deleteHospital,
};
