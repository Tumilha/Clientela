const express = require("express");
const router = express.Router();
const CaixaController = require("../controllers/CaixaController");

// Rota de busca por código no caixa
router.get("/produto/:code", CaixaController.getProductByCode);

router.post("/", CaixaController.create);
router.post("/login", CaixaController.login);

module.exports = router;