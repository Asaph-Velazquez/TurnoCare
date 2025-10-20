const { prisma } = require("../dbPostgres");

// Actualiza un hospital existente por su ID.
const updateHospital = async (req, resp) => {
  const { id } = req.params;
  const { nombre, direccion, telefono } = req.body;

  console.log("📩 PUT /api/hospital/:id recibido");
  console.log("🧾 Datos recibidos:", { id, nombre, direccion, telefono });

  if (!id || isNaN(parseInt(id))) {
    return resp.status(400).json({ success: false, error: "ID de hospital inválido." });
  }

  try {
    const existing = await prisma.hospital.findUnique({
      where: { hospitalId: parseInt(id) },
    });

    console.log("📍 Hospital encontrado:", existing);

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

    console.log("✅ Hospital actualizado correctamente:", updated);
    resp.json({ success: true, data: updated, message: "Hospital actualizado exitosamente." });

  } catch (err) {
    console.error("❌ Error actualizando hospital:", err);
    resp.status(500).json({ success: false, error: err.message || "Error interno del servidor." });
  }
};

// Elimina un hospital por su ID.
const deleteHospital = async (req, resp) => {
  const { id } = req.params;

  // Validar el ID
  if (!id || isNaN(parseInt(id))) {
    return resp.status(400).json({ success: false, error: "ID de hospital inválido." });
  }

  try {
    // Verificar si existe
    const hospital = await prisma.hospital.findUnique({
      where: { hospitalId: parseInt(id) },
    });

    if (!hospital) {
      return resp.status(404).json({ success: false, error: "Hospital no encontrado." });
    }

    // Eliminar (esto disparará los onDelete: Cascade)
    await prisma.hospital.delete({
      where: { hospitalId: parseInt(id) },
    });

    console.log(`🗑️ Hospital eliminado (ID: ${id})`);
    resp.json({ success: true, message: "Hospital eliminado correctamente." });

  } catch (err) {
    console.error("❌ Error eliminando hospital:", err);

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
  listHospitales,
  updateHospital,
  deleteHospital,
};
