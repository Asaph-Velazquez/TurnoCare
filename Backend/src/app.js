const express = require("express");
const cors = require("cors");
const enfermeroRoutes = require("./routes/enfermero.routes");
const pacientesRoutes = require("./routes/pacientes.routes");
const serviciosRoutes = require("./routes/servicios.routes");
const turnosRoutes = require("./routes/turnos.routes");

const medicamentosRoutes = require("./routes/medicamentos.routes");
const insumosRoutes = require("./routes/insumos.routes");
const inventarioRoutes = require("./routes/inventario.routes");

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/enfermeros", enfermeroRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/medicamentos", medicamentosRoutes);
app.use("/api/insumos", insumosRoutes);
app.use("/api/inventarios", inventarioRoutes);

module.exports = app;
