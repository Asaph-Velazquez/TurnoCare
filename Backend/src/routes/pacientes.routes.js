const { Router } = require("express");
const { listPacientes, createPaciente, deletePaciente } = require("../controllers/pacientes.controller");

const router = Router();

// Ruta de prueba
router.get("/hola", (req, resp) => {
    resp.send("Pacientes API");
});

// Listar pacientes
router.get("/", listPacientes);

// Crear paciente
router.post("/", createPaciente);

// Eliminar paciente
router.delete("/:id", deletePaciente);

module.exports = router;