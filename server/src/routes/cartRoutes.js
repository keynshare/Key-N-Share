
const { addItemToCart, getCartByUserId, removeItemFromCart, clearCart } = require('../controllers/cartController.js');
const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.put('/add', authMiddleware, addItemToCart);
router.get('/:userId', authMiddleware, getCartByUserId);
router.delete('/delete/:datasetId', authMiddleware, removeItemFromCart);

module.exports = router;