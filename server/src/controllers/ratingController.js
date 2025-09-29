const Rating = require('../models/Rating');
const User = require('../models/User');
const DatasetCatalogue = require('../models/DatasetCatalogue');
const Order = require('../models/Order');

// Submit a rating for a dataset or user
const submitRating = async (req, res) => {
  try {
    const { datasetId, userId, rating, comment, ratingType, orderId } = req.body;
    const raterId = req.user?.id; // Assuming auth middleware sets req.user

    if (!raterId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!ratingType || !['dataset', 'seller', 'buyer'].includes(ratingType)) {
      return res.status(400).json({ error: 'Invalid rating type' });
    }

    // Validate that either datasetId or userId is provided based on ratingType
    if (ratingType === 'dataset' && !datasetId) {
      return res.status(400).json({ error: 'datasetId is required for dataset ratings' });
    }
    if ((ratingType === 'seller' || ratingType === 'buyer') && !userId) {
      return res.status(400).json({ error: 'userId is required for user ratings' });
    }

    // Check if user is trying to rate themselves
    if (userId && userId === raterId) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }

    // If orderId is provided, verify the rater was involved in the order
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (order.buyerId.toString() !== raterId) {
        return res.status(403).json({ error: 'Can only rate orders you participated in' });
      }
    }

    // Create the rating
    const ratingData = {
      raterId,
      rating,
      comment,
      ratingType,
      orderId
    };

    if (datasetId) ratingData.datasetId = datasetId;
    if (userId) ratingData.userId = userId;

    const newRating = await Rating.create(ratingData);

    // Update average ratings
    await updateAverageRatings(datasetId, userId, ratingType);

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'You have already rated this item' });
    }
    console.error('submitRating error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get ratings for a dataset
const getDatasetRatings = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(50, Number(req.query.limit) > 0 ? Number(req.query.limit) : 10);

    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ datasetId, ratingType: 'dataset' })
        .populate('raterId', 'firstName email comment')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Rating.countDocuments({ datasetId, ratingType: 'dataset' })
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      ratings
    });
  } catch (err) {
    console.error('getDatasetRatings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get ratings for a user (as seller or buyer)
const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ratingType = 'seller' } = req.query; // 'seller' or 'buyer'
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(50, Number(req.query.limit) > 0 ? Number(req.query.limit) : 10);

    if (!['seller', 'buyer'].includes(ratingType)) {
      return res.status(400).json({ error: 'Invalid rating type. Must be seller or buyer' });
    }

    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ userId, ratingType })
        .populate('raterId', 'firstName email')
        .populate('datasetId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Rating.countDocuments({ userId, ratingType })
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      ratingType,
      ratings
    });
  } catch (err) {
    console.error('getUserRatings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get rating summary for a dataset
const getDatasetRatingSummary = async (req, res) => {
  try {
    const { datasetId } = req.params;

    const ratings = await Rating.find({ datasetId, ratingType: 'dataset' }).lean();
    
    if (ratings.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    
    const ratingDistribution = ratings.reduce((dist, r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      return dist;
    }, {});

    // Fill missing ratings with 0
    for (let i = 1; i <= 5; i++) {
      if (!ratingDistribution[i]) ratingDistribution[i] = 0;
    }
     const raterIds = ratings.map(rating => rating.raterId);

    res.status(200).json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings,
      ratingDistribution,
      raterIds
    });
  } catch (err) {
    console.error('getDatasetRatingSummary error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get rating summary for a user
const getUserRatingSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ratingType = 'seller' } = req.query;

    if (!['seller', 'buyer'].includes(ratingType)) {
      return res.status(400).json({ error: 'Invalid rating type. Must be seller or buyer' });
    }

    const ratings = await Rating.find({ userId, ratingType }).lean();
    
    if (ratings.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    
    const ratingDistribution = ratings.reduce((dist, r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      return dist;
    }, {});

    // Fill missing ratings with 0
    for (let i = 1; i <= 5; i++) {
      if (!ratingDistribution[i]) ratingDistribution[i] = 0;
    }

    res.status(200).json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      ratingDistribution,
      ratingType
    });
  } catch (err) {
    console.error('getUserRatingSummary error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to update average ratings in User and DatasetCatalogue models
const updateAverageRatings = async (datasetId, userId, ratingType) => {
  try {
    // Update dataset average rating
    if (datasetId && ratingType === 'dataset') {
      const ratings = await Rating.find({ datasetId, ratingType: 'dataset' }).lean();
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      await DatasetCatalogue.findByIdAndUpdate(datasetId, {
        averageRating: Math.round(averageRating * 10) / 10
      });
    }

    // Update user seller/buyer ratings
    if (userId && (ratingType === 'seller' || ratingType === 'buyer')) {
      const ratings = await Rating.find({ userId, ratingType }).lean();
      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const numberOfRatings = ratings.length;
      const averageRating = numberOfRatings > 0 ? totalRating / numberOfRatings : 0;

      const updateField = ratingType === 'seller' ? 'sellerRating' : 'buyerRating';
      await User.findByIdAndUpdate(userId, {
        [updateField]: {
          totalRating,
          numberOfRatings,
          averageRating: Math.round(averageRating * 10) / 10
        }
      });
    }
  } catch (err) {
    console.error('updateAverageRatings error:', err);
  }
};

module.exports = {
  submitRating,
  getDatasetRatings,
  getUserRatings,
  getDatasetRatingSummary,
  getUserRatingSummary
};
