
const { addToFavorite, getFavoritesByUserId, removeItemFromFavorites } = require('../controllers/FavoritesController');
const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.put('/add', authMiddleware, addToFavorite);
router.get('/:userId', authMiddleware, getFavoritesByUserId);
router.delete('/delete/:datasetId', authMiddleware, removeItemFromFavorites);

module.exports = router;