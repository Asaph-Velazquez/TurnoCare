const { Router } = require("express");
const { listPacientes, createPaciente, deletePaciente, updatePaciente } = require("../controllers/pacientes.controller");

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

// Actualizar paciente
router.put("/:id", updatePaciente);

module.exports = router;