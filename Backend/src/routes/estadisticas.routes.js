const express = require("express");
const router = express.Router();
const {
  getMedicamentosPorServicio,
  getInsumosPorServicio,
  getResumenInventarioPorServicio
} = require("../controllers/estadisticas.controller");

// Obtener estadísticas de medicamentos por servicio (todos o uno específico)
router.get("/medicamentos-por-servicio/:servicioId", getMedicamentosPorServicio);
router.get("/medicamentos-por-servicio", getMedicamentosPorServicio);

// Obtener estadísticas de insumos por servicio (todos o uno específico)
router.get("/insumos-por-servicio/:servicioId", getInsumosPorServicio);
router.get("/insumos-por-servicio", getInsumosPorServicio);

// Obtener resumen general de inventario por servicio
router.get("/resumen-inventario", getResumenInventarioPorServicio);

module.exports = router;
