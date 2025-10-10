const { Router } = require("express");

const router = Router();

router.get("/hola", (req, resp) => {
    resp.send("Pacientes API");
});




// ===== PACIENTES =====
// Aquí van los endpoints para manejar pacientes
// Ejemplo:
// app.get("/api/pacientes", async (req, resp) => {
//     try {
//         const pacientes = await prisma.paciente.findMany();
//         resp.json(pacientes);
//     } catch(err) {
//         resp.status(500).json({error: "Error"});
//     }
// });

module.exports = router;