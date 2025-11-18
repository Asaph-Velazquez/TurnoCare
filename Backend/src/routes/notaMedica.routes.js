const { Router } = require("express");
const {
    generateMedicalNote,
    downloadMedicalNotePDF
} = require("../controllers/notaMedica.controller");

const router = Router();


router.post("/createNew", generateMedicalNote);
router.get("/nota-medica/pdf/:registroId", downloadMedicalNotePDF);

module.exports = router;
