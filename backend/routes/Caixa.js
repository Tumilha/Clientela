const express = require("express");
const router = express.Router();
const CaixaController = require("../controllers/CaixaController");

router.post("/", CaixaController.create);
router.post("/login", CaixaController.login);

module.exports = router;