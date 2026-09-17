const express = require("express");
const router = express.Router();

const VendaController = require("../controllers/VendaController");

router.get("/", VendaController.list);
router.get("/:notafiscal", VendaController.get);
router.post("/", VendaController.create);
router.delete("/:notafiscal", VendaController.remove);

module.exports = router;