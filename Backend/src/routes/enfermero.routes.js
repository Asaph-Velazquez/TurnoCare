const { Router } = require("express");
const { prisma } = require("../db");

const router = Router();

// Ruta de login
router.post("/login", async (req, res) => {
  try {
    const { numeroEmpleado, nombre, apellidoPaterno, apellidoMaterno } = req.body;
    
    if (!numeroEmpleado || !nombre || !apellidoPaterno || !apellidoMaterno) {
      return res.status(400).json({ 
        success: false,
        error: 'Todos los campos son obligatorios' 
      });
    }

    const enfermero = await prisma.enfermero.findFirst({
      where: {
        numeroEmpleado: numeroEmpleado,
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno
      }
    });

    if (!enfermero) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales incorrectas' 
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        userid: enfermero.enfermeroId,
        enfermeroId: enfermero.enfermeroId,
        numeroEmpleado: enfermero.numeroEmpleado,
        nombre: enfermero.nombre,
        apellidoPaterno: enfermero.apellidoPaterno,
        apellidoMaterno: enfermero.apellidoMaterno,
        esCoordinador: enfermero.esCoordinador,
        especialidad: enfermero.especialidad
      },
      token: 'token_jwt_aqui'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor: ' + error.message
    });
  }
});

// Listar todos los enfermeros
router.get("/", async (req, res) => {
  try {
    const enfermeros = await prisma.enfermero.findMany({
      include: {
        turno: {
          select: {
            turnoId: true,
            nombre: true,
            horaInicio: true,
            horaFin: true
          }
        },
        servicio: {
          select: {
            servicioId: true,
            nombre: true,
            descripcion: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: enfermeros
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error al listar enfermeros: ' + error.message 
    });
  }
});

// Crear enfermero
router.post("/", async (req, res) => {
  try {
    const { 
      numeroEmpleado, 
      nombre, 
      apellidoPaterno, 
      apellidoMaterno, 
      especialidad, 
      esCoordinador, 
      servicioActualId, 
      habitacionesAsignadas,
      turno 
    } = req.body;

    const dataToCreate = {
      numeroEmpleado,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      especialidad: especialidad || null,
      esCoordinador: esCoordinador || false,
      habitacionAsignada: habitacionesAsignadas || null,
      habitacionesAsignadas: habitacionesAsignadas || null,
    };

    // Conectar servicio si existe
    if (servicioActualId) {
      dataToCreate.servicio = {
        connect: { servicioId: parseInt(servicioActualId) }
      };
    }

    // Conectar turno si existe
    if (turno) {
      dataToCreate.turno = {
        connect: { turnoId: parseInt(turno) }
      };
    }

    const nuevoEnfermero = await prisma.enfermero.create({
      data: dataToCreate,
      include: {
        servicio: true,
        turno: true
      }
    });

    res.status(201).json({
      success: true,
      data: nuevoEnfermero
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error al crear enfermero: ' + error.message 
    });
  }
});

// Actualizar enfermero
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      numeroEmpleado, 
      nombre, 
      apellidoPaterno, 
      apellidoMaterno, 
      especialidad, 
      esCoordinador, 
      servicioActualId, 
      habitacionesAsignadas,
      turno,
      turnoAsignadoId
    } = req.body;

    const dataToUpdate = {
      numeroEmpleado,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      especialidad: especialidad || null,
      esCoordinador: esCoordinador || false,
      habitacionAsignada: habitacionesAsignadas || null,
      habitacionesAsignadas: habitacionesAsignadas || null,
    };

    // Actualizar servicio
    if (servicioActualId !== undefined) {
      if (servicioActualId === null) {
        dataToUpdate.servicio = { disconnect: true };
      } else {
        dataToUpdate.servicio = {
          connect: { servicioId: parseInt(servicioActualId) }
        };
      }
    }

    // Actualizar turno
    const turnoId = turnoAsignadoId || turno;
    if (turnoId !== undefined) {
      if (turnoId === null) {
        dataToUpdate.turno = { disconnect: true };
      } else {
        dataToUpdate.turno = {
          connect: { turnoId: parseInt(turnoId) }
        };
      }
    }

    const enfermeroActualizado = await prisma.enfermero.update({
      where: { enfermeroId: parseInt(id) },
      data: dataToUpdate,
      include: {
        servicio: true,
        turno: true
      }
    });

    res.json({
      success: true,
      data: enfermeroActualizado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar enfermero: ' + error.message 
    });
  }
});

// Eliminar enfermero
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enfermero.delete({
      where: { enfermeroId: parseInt(id) }
    });
    res.json({ 
      success: true,
      message: 'Enfermero eliminado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar enfermero: ' + error.message 
    });
  }
});

module.exports = router;

