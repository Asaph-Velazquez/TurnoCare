const { Router } = require("express");
const {
  createInsumo,
  getAllInsumos,
  getInsumoById,
  updateInsumo,
  deleteInsumo,
} = require("../controllers/insumos.controller");

const router = Router();

router.get("/hola", (_req, res) => {
  res.send("Insumos API");
});

router.post("/", createInsumo);
router.get("/", getAllInsumos);
router.get("/:id", getInsumoById);
router.put("/:id", updateInsumo);
router.delete("/:id", deleteInsumo);

module.exports = router;
