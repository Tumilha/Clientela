const express = require("express");
const router = express.Router();

const funcController = require("../controllers/funcController");

router.post("/", funcController.create);
router.get("/", funcController.list);
router.get("/:cpf", funcController.get);
router.put("/:cpf", funcController.update);
router.delete("/:cpf", funcController.remove);

module.exports = router;