const { Router } = require("express");
const {
    createMedicamento,
    getAllMedicamentos,
    getMedicamentoById,
    updateMedicamento,
    deleteMedicamento,
    asignarMedicamentosAPaciente,
    getMedicamentosAsignadosPaciente,
} = require("../controllers/medicamentos.controller");

const router = Router();

// Ruta de prueba
router.get("/hola", (req, resp) => {
    resp.send("Medicamentos API");
});

// CRUD endpoints
router.post("/", createMedicamento);           // CREATE
router.get("/", getAllMedicamentos);            // READ ALL
router.get("/:id", getMedicamentoById);         // READ ONE
router.put("/:id", updateMedicamento);          // UPDATE
router.delete("/:id", deleteMedicamento);       // DELETE

// Endpoints de asignación
router.post("/asignar", asignarMedicamentosAPaciente);         // Asignar medicamentos a paciente
router.get("/asignados/:pacienteId", getMedicamentosAsignadosPaciente); // Obtener medicamentos asignados

module.exports = router;
