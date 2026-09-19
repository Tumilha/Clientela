const express = require("express");
const router = express.Router();

const LoginController = require("../controllers/Login/LoginController");

router.post("/", LoginController.login);

module.exports = router;