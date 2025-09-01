const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserProfile,
  getCurrentUserProfile,
  updateUserProfile,
  incrementProfileViews,
  getUserDatasets,
  getCurrentUserDatasets,
  getUserSoldDatasets,
  getCurrentUserSoldDatasets,
  getUserStatistics,
  getCurrentUserStatistics
} = require('../controllers/profileController');

// Public routes (no authentication required)
router.get('/:userId', getUserProfile); // Get any user's public profile
router.post('/:userId/view', incrementProfileViews); // Increment profile views

// Protected routes (authentication required)
router.get('/me/profile', authenticateToken, getCurrentUserProfile); // Get current user's profile
router.put('/me/profile', authenticateToken, updateUserProfile); // Update current user's profile
router.get('/me/datasets', authenticateToken, getCurrentUserDatasets); // Get current user's datasets
router.get('/me/sold-datasets', authenticateToken, getCurrentUserSoldDatasets); // Get current user's sold datasets
router.get('/me/statistics', authenticateToken, getCurrentUserStatistics); // Get current user's statistics

// Alternative route for getting other user's datasets (public)
router.get('/:userId/datasets', getUserDatasets);

module.exports = router;
