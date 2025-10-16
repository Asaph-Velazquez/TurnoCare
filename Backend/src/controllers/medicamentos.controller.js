const { prisma } = require("../dbPostgres");

// Crear medicamento (RF-M001, RF-M002, RF-M005)
const createMedicamento = async (req, resp) => {
  const {
    nombre,
    dosis,
    viaAdministracion,
    frecuencia,
    fechaHoraAdministracion,
    registroMedicoId,
    enfermeroResponsable,
  } = req.body;

  const registroId = Number(registroMedicoId);
  const enfermeroId = Number(enfermeroResponsable);

  if (!nombre || !registroId || !enfermeroId) {
    return resp.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const medicamento = await prisma.medicamentos.create({
      data: {
        nombre,
        dosis,
        viaAdministracion,
        frecuencia,
        fechaHoraAdministracion: fechaHoraAdministracion
          ? new Date(fechaHoraAdministracion)
          : null,
        registroMedicoId: registroId,
        enfermeroResponsable: enfermeroId,
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
    const medicamentos = await prisma.medicamentos.findMany({
      include: {
        registroMedico: true,
        enfermero: true,
      },
    });
    resp.json({ success: true, data: medicamentos });
  } catch (err) {
    resp.status(500).json({ error: "Error al obtener medicamentos" });
  }
};

// Obtener medicamento por ID
const getMedicamentoById = async (req, resp) => {
  const { id } = req.params;
  try {
    const medicamento = await prisma.medicamentos.findUnique({
      where: { medicamentoId: parseInt(id) },
      include: {
        registroMedico: true,
        enfermero: true,
      },
    });
    if (!medicamento) return resp.status(404).json({ error: "No encontrado" });
    resp.json({ success: true, data: medicamento });
  } catch (err) {
    resp.status(500).json({ error: "Error al obtener medicamento" });
  }
};

// Actualizar medicamento (RF-M002, RF-M003)
const updateMedicamento = async (req, resp) => {
  const { id } = req.params;
  const {
    nombre,
    dosis,
    viaAdministracion,
    frecuencia,
    fechaHoraAdministracion,
  } = req.body;

  const data = {
    nombre,
    dosis,
    viaAdministracion,
    frecuencia,
  };

  if (fechaHoraAdministracion !== undefined) {
    data.fechaHoraAdministracion = fechaHoraAdministracion
      ? new Date(fechaHoraAdministracion)
      : null;
  }
  try {
    const medicamento = await prisma.medicamentos.update({
      where: { medicamentoId: parseInt(id) },
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
    await prisma.medicamentos.delete({
      where: { medicamentoId: parseInt(id) },
    });
    resp.json({ success: true, message: "Medicamento eliminado" });
  } catch (err) {
    console.error("Error al eliminar medicamento:", err);
    resp.status(500).json({ error: "Error al eliminar medicamento" });
  }
};

module.exports = {
  createMedicamento,
  getAllMedicamentos,
  getMedicamentoById,
  updateMedicamento,
  deleteMedicamento,
};
