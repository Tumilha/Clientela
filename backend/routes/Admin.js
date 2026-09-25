const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/dashboard', AdminController.getDashboardData);
router.get('/produto/:code', AdminController.getProductByCode);
router.delete('/produto/:id', AdminController.deleteProduct);
router.post('/venda', AdminController.registrarVenda);

module.exports = router;