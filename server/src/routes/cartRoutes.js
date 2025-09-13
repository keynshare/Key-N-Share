
const { addItemToCart, getCartByUserId, removeItemFromCart, clearCart } = require('../controllers/cartController.js');

const express = require('express');
const router = express.Router();

router.put('/add', addItemToCart);
router.get('/:userId', getCartByUserId);
router.delete('/delete/:datasetId', removeItemFromCart);

module.exports = router;