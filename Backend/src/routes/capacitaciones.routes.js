const { Router } = require("express");
const { prisma } = require("../dbPostgres");

const router = Router();

// Listar todas las capacitaciones
router.get("/", async (req, res) => {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      include: {
        enfermeros: {
          include: {
            enfermero: {
              select: {
                enfermeroId: true,
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                numeroEmpleado: true,
                especialidad: true
              }
            }
          }
        }
      },
      orderBy: { fechaImparticion: 'desc' }
    });
    
    console.log('Capacitaciones con enfermeros:', JSON.stringify(capacitaciones, null, 2));
    res.json(capacitaciones);
  } catch (error) {
    console.error('Error al listar capacitaciones:', error);
    res.status(500).json({ error: 'Error al listar capacitaciones' });
  }
});

// Obtener capacitaciones de un enfermero específico
router.get("/enfermero/:enfermeroId", async (req, res) => {
  try {
    const { enfermeroId } = req.params;
    const capacitaciones = await prisma.enfermeroCapacitacion.findMany({
      where: { enfermeroId: parseInt(enfermeroId) },
      include: {
        capacitacion: true
      }
    });
    res.json(capacitaciones);
  } catch (error) {
    console.error('Error al obtener capacitaciones del enfermero:', error);
    res.status(500).json({ error: 'Error al obtener capacitaciones' });
  }
});

// Crear una nueva capacitación (solo coordinador)
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, fechaImparticion, duracion, instructor } = req.body;
    
    const nuevaCapacitacion = await prisma.capacitacion.create({
      data: {
        titulo,
        descripcion,
        fechaImparticion: fechaImparticion ? new Date(fechaImparticion) : null,
        duracion: duracion ? parseInt(duracion) : null,
        instructor
      }
    });
    
    res.status(201).json(nuevaCapacitacion);
  } catch (error) {
    console.error('Error al crear capacitación:', error);
    res.status(500).json({ error: 'Error al crear capacitación' });
  }
});

// Inscribir a un enfermero en una capacitación
router.post("/inscribir", async (req, res) => {
  try {
    const { enfermeroId, capacitacionId } = req.body;
    
    // Verificar si ya está inscrito
    const existente = await prisma.enfermeroCapacitacion.findUnique({
      where: {
        enfermeroId_capacitacionId: {
          enfermeroId: parseInt(enfermeroId),
          capacitacionId: parseInt(capacitacionId)
        }
      }
    });
    
    if (existente) {
      return res.status(400).json({ error: 'Ya estás inscrito en esta capacitación' });
    }
    
    const inscripcion = await prisma.enfermeroCapacitacion.create({
      data: {
        enfermeroId: parseInt(enfermeroId),
        capacitacionId: parseInt(capacitacionId),
        asistio: false
      }
    });
    
    res.status(201).json(inscripcion);
  } catch (error) {
    console.error('Error al inscribir enfermero:', error);
    res.status(500).json({ error: 'Error al inscribir en la capacitación' });
  }
});

// Marcar/Actualizar asistencia (NUEVO)
router.put("/asistencia/:capacitacionId/:enfermeroId", async (req, res) => {
  try {
    const { capacitacionId, enfermeroId } = req.params;
    const { asistio } = req.body; // true o false

    if (typeof asistio !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: "El campo 'asistio' debe ser un valor booleano (true/false)"
      });
    }

    // Verificar que la inscripción existe
    const inscripcion = await prisma.enfermeroCapacitacion.findUnique({
      where: {
        enfermeroId_capacitacionId: {
          enfermeroId: parseInt(enfermeroId),
          capacitacionId: parseInt(capacitacionId)
        }
      }
    });

    if (!inscripcion) {
      return res.status(404).json({
        success: false,
        error: "El enfermero no está inscrito en esta capacitación"
      });
    }

    // Actualizar asistencia
    const updated = await prisma.enfermeroCapacitacion.update({
      where: {
        enfermeroId_capacitacionId: {
          enfermeroId: parseInt(enfermeroId),
          capacitacionId: parseInt(capacitacionId)
        }
      },
      data: {
        asistio: asistio
      },
      include: {
        enfermero: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true
          }
        },
        capacitacion: {
          select: {
            titulo: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Asistencia ${asistio ? 'confirmada' : 'removida'} exitosamente`,
      data: updated
    });
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar asistencia: " + error.message
    });
  }
});

// Actualizar capacitación
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaImparticion, duracion, instructor } = req.body;
    
    const capacitacionActualizada = await prisma.capacitacion.update({
      where: { capacitacionId: parseInt(id) },
      data: {
        titulo,
        descripcion,
        fechaImparticion: fechaImparticion ? new Date(fechaImparticion) : null,
        duracion: duracion ? parseInt(duracion) : null,
        instructor
      }
    });
    
    res.json(capacitacionActualizada);
  } catch (error) {
    console.error('Error al actualizar capacitación:', error);
    res.status(500).json({ error: 'Error al actualizar capacitación' });
  }
});

// Eliminar capacitación
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.capacitacion.delete({
      where: { capacitacionId: parseInt(id) }
    });
    res.json({ message: 'Capacitación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar capacitación:', error);
    res.status(500).json({ error: 'Error al eliminar capacitación' });
  }
});

// Cancelar inscripción
router.delete("/inscripcion/:enfermeroId/:capacitacionId", async (req, res) => {
  try {
    const { enfermeroId, capacitacionId } = req.params;
    
    await prisma.enfermeroCapacitacion.delete({
      where: {
        enfermeroId_capacitacionId: {
          enfermeroId: parseInt(enfermeroId),
          capacitacionId: parseInt(capacitacionId)
        }
      }
    });
    
    res.json({ message: 'Inscripción cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({ error: 'Error al cancelar inscripción' });
  }
});

module.exports = router;
