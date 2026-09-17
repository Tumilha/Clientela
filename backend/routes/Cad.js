const express = require("express");
const router = express.Router();

const ProdutoController = require("../controllers/ProdutoController");

router.get("/", ProdutoController.list);

router.get("/:idProduto", ProdutoController.get);

router.put("/:idProduto", ProdutoController.update);

router.delete("/:idProduto", ProdutoController.remove);

module.exports = router;