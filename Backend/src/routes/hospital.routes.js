const { Router } = require("express"); 
const { createHospital, listHospitales } = require("../controllers/hospital.controller");

const router = Router();

// Ruta de prueba simple (opcional)
router.get("/status", (req, resp) => {
    resp.send("Hospitales API está activo");
});

// Listar todos los hospitales
// GET /api/hospitales/
router.get("/", listHospitales);

// Registrar un nuevo hospital
// POST /api/hospitales/
router.post("/", createHospital);

module.exports = router;
