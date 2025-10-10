const express = require("express");
const cors = require("cors");
const enfermeroRoutes = require("./routes/enfermero.routes");
const pacientesRoutes = require("./routes/pacientes.routes");
const serviciosRoutes = require("./routes/servicios.routes");
const turnosRoutes = require("./routes/turnos.routes");

const app = express();


app.use(cors());
app.use(express.json());

//routes
app.use("/api/enfermeros", enfermeroRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/turnos", turnosRoutes);

module.exports = app;