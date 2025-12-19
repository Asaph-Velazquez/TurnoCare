const { Router } = require("express");
const {
    registerService,
    deleteService,
    updateService,
    listServices
} = require("../controllers/servicios.controller");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Servicios API");
});

router.post("/createService", registerService);
router.delete("/deleteService/:id", deleteService);
router.put("/updateService/:id", updateService);
router.get("/listServices", listServices);


module.exports = router;


