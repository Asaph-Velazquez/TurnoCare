const { Router } = require("express");
const {
  generateMedicalNote,
  downloadMedicalNotePDF,
} = require("../controllers/notaMedica.controller");

const router = Router();

router.post("/", generateMedicalNote);
router.get("/pdf/:registroId", downloadMedicalNotePDF);

module.exports = router;
