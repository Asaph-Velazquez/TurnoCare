const { Router } = require("express");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Servicios API");
});




// ===== SERVICIOS =====
// Aquí van los endpoints para manejar servicios del hospital
// Ejemplo:
// app.get("/api/servicios", async (req, resp) => {
//     try {
//         const servicios = await prisma.servicio.findMany();
//         resp.json(servicios);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });

module.exports = router;
