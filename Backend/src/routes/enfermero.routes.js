const { Router } = require("express"); 
//const app = require("../app");
const { login, listEnfermeros, createEnfermero } = require("../controllers/enfermero.controller");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Enfermero API");
});

// Listar enfermeros
router.get("/", listEnfermeros);

// Crear enfermero
router.post("/", createEnfermero);

// Login (siempre disponible)
router.post("/login", login);

module.exports = router;