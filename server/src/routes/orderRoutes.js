
const express = require('express');
const router = express.Router();
const {
  createOrder,
  listOrders,
  getOrderById,
  listDatasetBuyers
} = require('../controllers/orderController');

router.post('/orders', createOrder);
router.get('/orders', listOrders);
router.get('/orders/:id', getOrderById);
router.get('/datasets/:datasetId/buyers', listDatasetBuyers);

module.exports = router;
