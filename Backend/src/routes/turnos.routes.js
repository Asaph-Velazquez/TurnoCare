const { Router } = require("express");
const {
    listTurnos,
    getTurnoById,
    createTurno,
    updateTurno,
    deleteTurno,
    getTurnoByEnfermeroId
} = require("../controllers/turnos.controller");

const router = Router();

// Ruta de prueba
router.get("/hola", (req, resp) => {
    resp.send("Turnos API");
});

// CRUD Turnos
router.get("/", listTurnos);              // GET /api/turnos
router.get("/enfermero/:enfermeroId", getTurnoByEnfermeroId);  // GET /api/turnos/enfermero/:enfermeroId
router.get("/:id", getTurnoById);          // GET /api/turnos/:id
router.post("/", createTurno);             // POST /api/turnos
router.put("/:id", updateTurno);           // PUT /api/turnos/:id
router.delete("/:id", deleteTurno);        // DELETE /api/turnos/:id

module.exports = router;