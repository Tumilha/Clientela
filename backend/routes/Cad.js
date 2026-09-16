const express = require("express");
const router = express.Router();

const eventoController = require("../controllers/ProdutoController");

router.get("/", eventoController.list);

router.get("/:idProduto", eventoController.get);

router.put("/:idProduto", eventoController.update);

router.delete("/:idProduto", eventoController.remove);

module.exports = router;