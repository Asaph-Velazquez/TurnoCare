const { prisma } = require("../dbPostgres");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

// Crear medicamento (RF-M001, RF-M002, RF-M005)
const createMedicamento = async (req, resp) => {
  const {
    nombre,
    descripcion,
    cantidadStock,
    lote,
    fechaCaducidad,
    ubicacion,
  } = req.body;

  if (!nombre) {
    return resp.status(400).json({ error: "El nombre del medicamento es obligatorio" });
  }

  const cantidad = parseOptionalInt(cantidadStock) ?? 0;

  try {
    const medicamento = await prisma.medicamento.create({
      data: {
        nombre,
        descripcion,
        cantidadStock: cantidad,
        lote,
        fechaCaducidad: fechaCaducidad ? new Date(fechaCaducidad) : null,
        ubicacion,
      },
    });
    resp.status(201).json({ success: true, data: medicamento });
  } catch (err) {
    console.error("Error al crear medicamento:", err);
    resp.status(500).json({ error: "Error al crear medicamento" });
  }
};

// Obtener todos los medicamentos (RF-M001)
const getAllMedicamentos = async (req, resp) => {
  try {
    const medicamentos = await prisma.medicamento.findMany({
      orderBy: { actualizadoEn: "desc" },
    });
    resp.json({ success: true, data: medicamentos });
  } catch (err) {
    console.error("Error al obtener medicamentos:", err);
    resp.status(500).json({ error: "Error al obtener medicamentos" });
  }
};

// Obtener medicamento por ID
const getMedicamentoById = async (req, resp) => {
  const { id } = req.params;
  try {
    const medicamento = await prisma.medicamento.findUnique({
      where: { medicamentoId: Number(id) },
    });
    if (!medicamento) {
      return resp.status(404).json({ error: "Medicamento no encontrado" });
    }
    resp.json({ success: true, data: medicamento });
  } catch (err) {
    console.error("Error al obtener medicamento:", err);
    resp.status(500).json({ error: "Error al obtener medicamento" });
  }
};

// Actualizar medicamento (RF-M002, RF-M003)
const updateMedicamento = async (req, resp) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    cantidadStock,
    lote,
    fechaCaducidad,
    ubicacion,
  } = req.body;

  const cantidad = parseOptionalInt(cantidadStock);

  const data = {
    nombre,
    descripcion,
    lote,
    ubicacion,
    actualizadoEn: new Date(),
  };

  if (cantidad !== null) {
    data.cantidadStock = cantidad;
  }

  if (fechaCaducidad !== undefined) {
    data.fechaCaducidad = fechaCaducidad ? new Date(fechaCaducidad) : null;
  }

  try {
    const medicamento = await prisma.medicamento.update({
      where: { medicamentoId: Number(id) },
      data,
    });
    resp.json({ success: true, data: medicamento });
  } catch (err) {
    console.error("Error al actualizar medicamento:", err);
    resp.status(500).json({ error: "Error al actualizar medicamento" });
  }
};

// Eliminar medicamento
const deleteMedicamento = async (req, resp) => {
  const { id } = req.params;
  try {
    await prisma.medicamento.delete({
      where: { medicamentoId: Number(id) },
    });
    resp.json({ success: true, message: "Medicamento eliminado" });
  } catch (err) {
    console.error("Error al eliminar medicamento:", err);
    resp.status(500).json({ error: "Error al eliminar medicamento" });
  }
};

// Asignar medicamentos a un paciente
const asignarMedicamentosAPaciente = async (req, resp) => {
  // Espera body: { pacienteId: number, medicamentos: [{ medicamentoId: number, cantidad: number }] }
  const { pacienteId, medicamentos } = req.body;
  if (!pacienteId || !Array.isArray(medicamentos)) {
    return resp.status(400).json({ error: "Datos insuficientes para asignar medicamentos" });
  }
  try {
    // Borra asignaciones previas (opcional, según lógica de negocio)
    await prisma.pacienteMedicamento.deleteMany({ where: { pacienteId } });
    // Asigna los nuevos medicamentos
    const asignaciones = await Promise.all(
      medicamentos.map(({ medicamentoId, cantidad }) =>
        prisma.pacienteMedicamento.create({
          data: { pacienteId, medicamentoId, cantidad }
        })
      )
    );
    resp.json({ success: true, data: asignaciones });
  } catch (err) {
    console.error("Error al asignar medicamentos a paciente:", err);
    resp.status(500).json({ error: "Error al asignar medicamentos a paciente" });
  }
};

// Consultar medicamentos asignados a un paciente
const getMedicamentosAsignadosPaciente = async (req, resp) => {
  const { pacienteId } = req.params;
  if (!pacienteId) {
    return resp.status(400).json({ error: "Falta pacienteId" });
  }
  try {
    const asignados = await prisma.pacienteMedicamento.findMany({
      where: { pacienteId: Number(pacienteId) },
      include: { medicamento: true },
      orderBy: { asignadoEn: "desc" },
    });
    resp.json({ success: true, data: asignados });
  } catch (err) {
    console.error("Error al consultar medicamentos asignados:", err);
    resp.status(500).json({ error: "Error al consultar medicamentos asignados" });
  }
};

module.exports = {
  createMedicamento,
  getAllMedicamentos,
  getMedicamentoById,
  updateMedicamento,
  deleteMedicamento,
  asignarMedicamentosAPaciente,
  getMedicamentosAsignadosPaciente,
};
