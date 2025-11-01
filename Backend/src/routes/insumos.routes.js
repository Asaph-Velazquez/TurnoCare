
const { Router } = require("express");
const {
  createInsumo,
  getAllInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
  asignarInsumosAPaciente,
  getInsumosAsignadosPaciente,
} = require("../controllers/insumos.controller");

const router = Router();

// Consultar insumos asignados a un paciente
router.get("/asignados/:pacienteId", getInsumosAsignadosPaciente);
// Asignar insumos a un paciente
router.post("/asignar", asignarInsumosAPaciente);

router.get("/hola", (_req, res) => {
  res.send("Insumos API");
});

router.post("/", createInsumo);
router.get("/", getAllInsumos);
router.get("/:id", getInsumoById);
router.put("/:id", updateInsumo);
router.delete("/:id", deleteInsumo);

module.exports = router;
