const express = require("express");
const cors = require("cors");
const pacientesRoutes = require("./routes/pacientes.routes");
const enfermeroRoutes = require("./routes/enfermero.routes");
const serviciosRoutes = require("./routes/servicios.routes");
const turnosRoutes = require("./routes/turnos.routes");
const hospitalRoutes = require("./routes/hospital.routes");
const medicamentosRoutes = require("./routes/medicamentos.routes");
const insumosRoutes = require("./routes/insumos.routes");
const inventarioRoutes = require("./routes/inventario.routes");
const estadisticasRoutes = require("./routes/estadisticas.routes");
const notasMedicasRoutes = require("./routes/notaMedica.routes");
const capacitacionesRoutes = require("./routes/capacitaciones.routes");

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/enfermeros", enfermeroRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/medicamentos", medicamentosRoutes);
app.use("/api/insumos", insumosRoutes);
app.use("/api/inventarios", inventarioRoutes);
app.use("/api/estadisticas", estadisticasRoutes);
app.use("/api/notas-medicas", notasMedicasRoutes);
app.use("/api/capacitaciones", capacitacionesRoutes);

module.exports = app;

