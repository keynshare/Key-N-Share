const express = require('express');
const router = express.Router();
const {
  submitRating,
  getDatasetRatings,
  getUserRatings,
  getDatasetRatingSummary,
  getUserRatingSummary
} = require('../controllers/ratingController');

// Submit a rating (requires authentication)
router.post('/ratings', submitRating);

// Get ratings for a specific dataset
router.get('/datasets/:datasetId/ratings', getDatasetRatings);

// Get ratings for a specific user (as seller or buyer)
router.get('/users/:userId/ratings', getUserRatings);

// Get rating summary for a dataset
router.get('/datasets/:datasetId/rating-summary', getDatasetRatingSummary);

// Get rating summary for a user
router.get('/users/:userId/rating-summary', getUserRatingSummary);

module.exports = router;
