const { Router } = require("express");
const {
    createMedicamento,
    getAllMedicamentos,
    getMedicamentoById,
    updateMedicamento,
    deleteMedicamento,
    asignarMedicamentosAPaciente,
    getMedicamentosAsignadosPaciente,
    desasignarMedicamentoDePaciente,
} = require("../controllers/medicamentos.controller");

const router = Router();

// Asignación a pacientes (rutas específicas primero)
router.post("/asignar", asignarMedicamentosAPaciente);
router.get("/asignados/:pacienteId", getMedicamentosAsignadosPaciente);
router.delete("/desasignar/:pacienteId/:medicamentoId", desasignarMedicamentoDePaciente);

// CRUD
router.post("/", createMedicamento);
router.get("/", getAllMedicamentos);
router.get("/:id", getMedicamentoById);
router.put("/:id", updateMedicamento);
router.delete("/:id", deleteMedicamento);

module.exports = router;
