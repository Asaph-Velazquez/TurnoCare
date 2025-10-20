const { Router } = require("express");
const {
  createHospital,
  listHospitales,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospital.controller");

const router = Router();

// Ruta de prueba
router.get("/status", (req, resp) => {
  resp.send("Hospitales API está activo");
});

// Listar todos los hospitales
router.get("/", listHospitales);

// Registrar un nuevo hospital
router.post("/", createHospital);

// Actualizar hospital existente
router.put("/:id", updateHospital);

// Eliminar hospital por ID
router.delete("/:id", deleteHospital);


module.exports = router;
