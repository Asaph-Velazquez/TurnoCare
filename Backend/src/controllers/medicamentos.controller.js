const { prisma } = require("../db");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

// CRUD - Crear
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
  } catch (err) {resp.status(500).json({ error: "Error al crear medicamento" });
  }
};

// CRUD - Leer todos
const getAllMedicamentos = async (req, resp) => {
  try {
    // Solo devolver medicamentos del inventario (sin registroMedicoId)
    const medicamentos = await prisma.medicamento.findMany({
      where: {
        registroMedicoId: null
      },
      orderBy: { actualizadoEn: "desc" },
    });
    resp.json({ success: true, data: medicamentos });
  } catch (err) {resp.status(500).json({ error: "Error al obtener medicamentos" });
  }
};

// CRUD - Leer por ID
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
  } catch (err) {resp.status(500).json({ error: "Error al obtener medicamento" });
  }
};

// CRUD - Actualizar
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
  } catch (err) {resp.status(500).json({ error: "Error al actualizar medicamento" });
  }
};

// CRUD - Eliminar
const deleteMedicamento = async (req, resp) => {
  const { id } = req.params;
  try {
    await prisma.medicamento.delete({
      where: { medicamentoId: Number(id) },
    });
    resp.json({ success: true, message: "Medicamento eliminado" });
  } catch (err) {resp.status(500).json({ error: "Error al eliminar medicamento" });
  }
};

// Asignar medicamentos a paciente (reemplazar o agregar)
const asignarMedicamentosAPaciente = async (req, resp) => {
  const { pacienteId, medicamentos, reemplazar = true } = req.body;
  
  if (!pacienteId || !Array.isArray(medicamentos)) {
    return resp.status(400).json({ error: "Datos insuficientes para asignar medicamentos" });
  }
  try {
    if (reemplazar) {
      await prisma.pacienteMedicamento.deleteMany({ where: { pacienteId } });
    }
    
    const asignaciones = await Promise.all(
      medicamentos.map(async ({ medicamentoId, cantidad, dosis, frecuencia, viaAdministracion }) => {
        return prisma.pacienteMedicamento.upsert({
          where: {
            pacienteId_medicamentoId: {
              pacienteId,
              medicamentoId
            }
          },
          update: {
            cantidadAsignada: cantidad,
            dosis: dosis || null,
            frecuencia: frecuencia || null,
            viaAdministracion: viaAdministracion || null
          },
          create: {
            pacienteId, 
            medicamentoId, 
            cantidadAsignada: cantidad,
            dosis: dosis || null,
            frecuencia: frecuencia || null,
            viaAdministracion: viaAdministracion || null
          }
        });
      })
    );
    resp.json({ success: true, data: asignaciones });
  } catch (err) {resp.status(500).json({ error: "Error al asignar medicamentos a paciente" });
  }
};

// Obtener medicamentos asignados a un paciente
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
  } catch (err) {resp.status(500).json({ error: "Error al consultar medicamentos asignados" });
  }
};

// Desasignar medicamento de un paciente
const desasignarMedicamentoDePaciente = async (req, resp) => {
  const { pacienteId, medicamentoId } = req.params;
  
  if (!pacienteId || !medicamentoId) {
    return resp.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    await prisma.pacienteMedicamento.delete({
      where: {
        pacienteId_medicamentoId: {
          pacienteId: Number(pacienteId),
          medicamentoId: Number(medicamentoId)
        }
      }
    });
    resp.json({ success: true, message: "Medicamento desasignado correctamente" });
  } catch (err) {resp.status(500).json({ error: "Error al desasignar medicamento" });
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
  desasignarMedicamentoDePaciente,
};


