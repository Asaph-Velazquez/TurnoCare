const { Router } = require("express");
const {
    createMedicamento,
    getAllMedicamentos,
    getMedicamentoById,
    updateMedicamento,
    deleteMedicamento
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

module.exports = router;
