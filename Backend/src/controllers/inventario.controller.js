const { prisma } = require("../dbPostgres");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseMedicamentosDisponibles = (value) => {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.warn(
        "Valor de medicamentosDisponibles no es JSON válido, se guardará como string."
      );
      return value;
    }
  }

  return value;
};

// CRUD - Leer todos
const getAllInventarios = async (_req, resp) => {
  try {
    const inventarios = await prisma.inventarioMedicamentos.findMany({
      include: { responsable: true },
      orderBy: { inventarioId: "desc" },
    });
    resp.json({ success: true, data: inventarios });
  } catch (err) {
    console.error("Error al obtener inventarios:", err);
    resp.status(500).json({ error: "Error al obtener inventarios" });
  }
};

// CRUD - Leer por ID
const getInventarioById = async (req, resp) => {
  const { id } = req.params;

  try {
    const inventario = await prisma.inventarioMedicamentos.findUnique({
      where: { inventarioId: Number(id) },
      include: { responsable: true },
    });

    if (!inventario) {
      return resp.status(404).json({ error: "Inventario no encontrado" });
    }

    resp.json({ success: true, data: inventario });
  } catch (err) {
    console.error("Error al obtener inventario:", err);
    resp.status(500).json({ error: "Error al obtener inventario" });
  }
};

// CRUD - Crear
const createInventario = async (req, resp) => {
  const { medicamentosDisponibles, ubicacionAlmacen, responsableId } = req.body;

  const responsable = parseOptionalInt(responsableId);

  if (!responsable) {
    return resp.status(400).json({ error: "El responsableId es obligatorio" });
  }

  try {
    const inventario = await prisma.inventarioMedicamentos.create({
      data: {
        medicamentosDisponibles: parseMedicamentosDisponibles(
          medicamentosDisponibles
        ),
        ubicacionAlmacen,
        responsableId: responsable,
      },
    });

    resp.status(201).json({ success: true, data: inventario });
  } catch (err) {
    console.error("Error al crear inventario:", err);
    resp.status(500).json({ error: "Error al crear inventario" });
  }
};

// CRUD - Actualizar
const updateInventario = async (req, resp) => {
  const { id } = req.params;
  const { medicamentosDisponibles, ubicacionAlmacen, responsableId } = req.body;

  const data = {};

  if (medicamentosDisponibles !== undefined) {
    data.medicamentosDisponibles = parseMedicamentosDisponibles(
      medicamentosDisponibles
    );
  }

  if (ubicacionAlmacen !== undefined) {
    data.ubicacionAlmacen = ubicacionAlmacen;
  }

  if (responsableId !== undefined) {
    const responsable = parseOptionalInt(responsableId);
    if (responsable === null) {
      return resp
        .status(400)
        .json({ error: "El responsableId debe ser un número válido" });
    }
    data.responsableId = responsable;
  }

  try {
    const inventario = await prisma.inventarioMedicamentos.update({
      where: { inventarioId: Number(id) },
      data,
    });
    resp.json({ success: true, data: inventario });
  } catch (err) {
    console.error("Error al actualizar inventario:", err);
    resp.status(500).json({ error: "Error al actualizar inventario" });
  }
};

// CRUD - Eliminar
const deleteInventario = async (req, resp) => {
  const { id } = req.params;

  try {
    await prisma.inventarioMedicamentos.delete({
      where: { inventarioId: Number(id) },
    });
    resp.json({ success: true, message: "Inventario eliminado" });
  } catch (err) {
    console.error("Error al eliminar inventario:", err);
    resp.status(500).json({ error: "Error al eliminar inventario" });
  }
};

module.exports = {
  createInventario,
  getAllInventarios,
  getInventarioById,
  updateInventario,
  deleteInventario,
};
