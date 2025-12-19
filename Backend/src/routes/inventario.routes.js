const { Router } = require("express");
const {
  createInventario,
  getAllInventarios,
  getInventarioById,
  updateInventario,
  deleteInventario,
} = require("../controllers/inventario.controller");

const router = Router();

router.get("/hola", (_req, res) => {
  res.send("Inventario API");
});

router.post("/", createInventario);
router.get("/", getAllInventarios);
router.get("/:id", getInventarioById);
router.put("/:id", updateInventario);
router.delete("/:id", deleteInventario);

module.exports = router;


