const { Router } = require("express");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Turnos API");
});



// ===== TURNOS =====
// Aquí van los endpoints para manejar turnos
// Ejemplo:
// app.get("/api/turnos", async (req, resp) => {
//     try {
//         const turnos = await prisma.turno.findMany();
//         resp.json(turnos);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });
module.exports = router;