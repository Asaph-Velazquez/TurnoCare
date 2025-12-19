const { Router } = require("express");
const {
  createInsumo,
  getAllInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
  asignarInsumosAPaciente,
  getInsumosAsignadosPaciente,
  desasignarInsumoDePaciente,
} = require("../controllers/insumos.controller");

const router = Router();

// Asignación a pacientes (rutas específicas primero)
router.post("/asignar", asignarInsumosAPaciente);
router.get("/asignados/:pacienteId", getInsumosAsignadosPaciente);
router.delete("/desasignar/:pacienteId/:insumoId", desasignarInsumoDePaciente);

// CRUD
router.post("/", createInsumo);
router.get("/", getAllInsumos);
router.get("/:id", getInsumoById);
router.put("/:id", updateInsumo);
router.delete("/:id", deleteInsumo);

module.exports = router;


