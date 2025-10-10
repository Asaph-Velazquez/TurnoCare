const { Router } = require("express"); 
//const app = require("../app");
const { login } = require("../controllers/enfermero.controller");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Enfermero API");
});
router.post("/login", login);


module.exports = router;