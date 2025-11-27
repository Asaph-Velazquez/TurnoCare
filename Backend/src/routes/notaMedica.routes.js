const { Router } = require("express");
const {
  generateMedicalNote,
  getMedicalNotesByPaciente,
  downloadMedicalNotePDF,
} = require("../controllers/notaMedica.controller");

const router = Router();

router.post("/", generateMedicalNote);
router.get("/paciente/:pacienteId", getMedicalNotesByPaciente);
router.get("/pdf/:registroId", downloadMedicalNotePDF);

module.exports = router;
