const { Router } = require("express"); 
//const app = require("../app");
const { login, listEnfermeros, createEnfermero, deleteEnfermero, updateEnfermero } = require("../controllers/enfermero.controller");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Enfermero API");
});

// Listar enfermeros
router.get("/", listEnfermeros);

// Crear enfermero
router.post("/", createEnfermero);

// Eliminar enfermero por ID
router.delete("/:id", deleteEnfermero);

// Actualizar enfermero por ID
router.put("/:id", updateEnfermero);

// Login (siempre disponible)
router.post("/login", login);

module.exports = router;