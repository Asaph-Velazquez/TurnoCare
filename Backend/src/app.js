const express = require("express");
const cors = require("cors");
const pacientesRoutes = require("./routes/pacientes.routes");
const enfermeroRoutes = require("./routes/enfermero.routes");
const serviciosRoutes = require("./routes/servicios.routes");
const turnosRoutes = require("./routes/turnos.routes");
const hospitalRoutes = require("./routes/hospital.routes");
console.log("✅ hospitalRoutes:", hospitalRoutes);

const app = express();


app.use(cors());
app.use(express.json());

// Aquí asegúrate de montar el router en la ruta correcta:
app.use("/api/pacientes", pacientesRoutes);

//routes

app.use("/api/enfermeros", enfermeroRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/hospital", hospitalRoutes);

module.exports = app;