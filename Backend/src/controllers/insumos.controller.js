const { prisma } = require("../dbPostgres");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

// CRUD - Crear
const createInsumo = async (req, resp) => {
  const {
    nombre,
    descripcion,
    categoria,
    cantidadDisponible,
    unidadMedida,
    ubicacion,
    responsableId,
  } = req.body;

  const cantidad = parseOptionalInt(cantidadDisponible) ?? 0;
  const responsable = parseOptionalInt(responsableId);

  if (!nombre) {
    return resp
      .status(400)
      .json({ error: "El nombre del insumo es obligatorio" });
  }

  try {
    const insumo = await prisma.insumo.create({
      data: {
        nombre,
        descripcion,
        categoria,
        cantidadDisponible: cantidad,
        unidadMedida,
        ubicacion,
        responsableId: responsable,
      },
    });

    resp.status(201).json({ success: true, data: insumo });
  } catch (err) {
    console.error("Error al crear insumo:", err);
    resp.status(500).json({ error: "Error al crear insumo" });
  }
};

// CRUD - Leer todos
const getAllInsumos = async (_req, resp) => {
  try {
    const insumos = await prisma.insumo.findMany({
      orderBy: { actualizadoEn: "desc" },
      include: { responsable: true },
    });
    resp.json({ success: true, data: insumos });
  } catch (err) {
    console.error("Error al obtener insumos:", err);
    resp.status(500).json({ error: "Error al obtener insumos" });
  }
};

// CRUD - Leer por ID
const getInsumoById = async (req, resp) => {
  const { id } = req.params;

  try {
    const insumo = await prisma.insumo.findUnique({
      where: { insumoId: Number(id) },
      include: { responsable: true },
    });

    if (!insumo) {
      return resp.status(404).json({ error: "Insumo no encontrado" });
    }

    resp.json({ success: true, data: insumo });
  } catch (err) {
    console.error("Error al obtener insumo:", err);
    resp.status(500).json({ error: "Error al obtener insumo" });
  }
};

// CRUD - Actualizar
const updateInsumo = async (req, resp) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    categoria,
    cantidadDisponible,
    unidadMedida,
    ubicacion,
    responsableId,
  } = req.body;

  const cantidad = parseOptionalInt(cantidadDisponible);
  const responsable = parseOptionalInt(responsableId);

  const data = {
    nombre,
    descripcion,
    categoria,
    unidadMedida,
    ubicacion,
    actualizadoEn: new Date(),
  };

  if (cantidad !== null) {
    data.cantidadDisponible = cantidad;
  }

  if (responsable !== null) {
    data.responsableId = responsable;
  } else if (responsableId === null || responsableId === "") {
    data.responsableId = null;
  }

  try {
    const insumo = await prisma.insumo.update({
      where: { insumoId: Number(id) },
      data,
    });
    resp.json({ success: true, data: insumo });
  } catch (err) {
    console.error("Error al actualizar insumo:", err);
    resp.status(500).json({ error: "Error al actualizar insumo" });
  }
};

// CRUD - Eliminar
const deleteInsumo = async (req, resp) => {
  const { id } = req.params;

  try {
    await prisma.insumo.delete({ where: { insumoId: Number(id) } });
    resp.json({ success: true, message: "Insumo eliminado" });
  } catch (err) {
    console.error("Error al eliminar insumo:", err);
    resp.status(500).json({ error: "Error al eliminar insumo" });
  }
};

// Asignar insumos a paciente (reemplazar o agregar)
const asignarInsumosAPaciente = async (req, resp) => {
  const { pacienteId, insumos, reemplazar = true } = req.body;
  if (!pacienteId || !Array.isArray(insumos)) {
    return resp.status(400).json({ error: "Datos insuficientes para asignar insumos" });
  }
  try {
    if (reemplazar) {
      await prisma.pacienteInsumo.deleteMany({ where: { pacienteId } });
    }
    
    const asignaciones = await Promise.all(
      insumos.map(async ({ insumoId, cantidad }) => {
        return prisma.pacienteInsumo.upsert({
          where: {
            pacienteId_insumoId: {
              pacienteId,
              insumoId
            }
          },
          update: {
            cantidad
          },
          create: {
            pacienteId,
            insumoId,
            cantidad
          }
        });
      })
    );
    resp.json({ success: true, data: asignaciones });
  } catch (err) {
    console.error("Error al asignar insumos a paciente:", err);
    resp.status(500).json({ error: "Error al asignar insumos a paciente" });
  }
};

// Obtener insumos asignados a un paciente
const getInsumosAsignadosPaciente = async (req, resp) => {
  const { pacienteId } = req.params;
  if (!pacienteId) {
    return resp.status(400).json({ error: "Falta pacienteId" });
  }
  try {
    const asignados = await prisma.pacienteInsumo.findMany({
      where: { pacienteId: Number(pacienteId) },
      include: { insumo: true },
      orderBy: { asignadoEn: "desc" },
    });
    resp.json({ success: true, data: asignados });
  } catch (err) {
    console.error("Error al consultar insumos asignados:", err);
    resp.status(500).json({ error: "Error al consultar insumos asignados" });
  }
};

// Desasignar insumo de un paciente
const desasignarInsumoDePaciente = async (req, resp) => {
  const { pacienteId, insumoId } = req.params;
  
  if (!pacienteId || !insumoId) {
    return resp.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    await prisma.pacienteInsumo.delete({
      where: {
        pacienteId_insumoId: {
          pacienteId: Number(pacienteId),
          insumoId: Number(insumoId)
        }
      }
    });
    resp.json({ success: true, message: "Insumo desasignado correctamente" });
  } catch (err) {
    console.error("Error al desasignar insumo:", err);
    resp.status(500).json({ error: "Error al desasignar insumo" });
  }
};

module.exports = {
  createInsumo,
  getAllInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
  asignarInsumosAPaciente,
  getInsumosAsignadosPaciente,
  desasignarInsumoDePaciente,
};
