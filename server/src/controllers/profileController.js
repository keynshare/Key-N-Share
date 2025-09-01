const User = require('../models/User');
const DatasetCatalogue = require('../models/DatasetCatalogue');
const Transaction = require('../models/Transaction');
const Dispute = require('../models/Dispute');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-passwordHash') // Exclude password hash
      .populate('datasets', 'title description coverImageUrl price downloads views averageRating')
      .populate('datasetsSold', 'price currency status completedAt')
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate additional statistics
    const totalDatasets = user.datasets.length;
    const totalSold = user.datasetsSold.length;
    const totalEarnings = user.datasetsSold
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.price, 0);

    const profileData = {
      ...user,
      statistics: {
        totalDatasets,
        totalSold,
        totalEarnings,
        profileViews: user.profileViewsCount
      }
    };

    res.status(200).json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user's profile (from auth token)
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('datasets', 'title description coverImageUrl price downloads views averageRating')
      .populate('datasetsSold', 'price currency status completedAt')
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate statistics
    const totalDatasets = user.datasets.length;
    const totalSold = user.datasetsSold.length;
    const totalEarnings = user.datasetsSold
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.price, 0);

    const profileData = {
      ...user,
      statistics: {
        totalDatasets,
        totalSold,
        totalEarnings,
        profileViews: user.profileViewsCount
      }
    };

    res.status(200).json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Error getting current user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { role, bio } = req.body;

    // Validate input
    if (role && role.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Role must be less than 100 characters'
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio must be less than 500 characters'
      });
    }

    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Increment profile views (when someone views the profile)
const incrementProfileViews = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.incrementProfileViews();

    res.status(200).json({
      success: true,
      message: 'Profile views incremented',
      data: { profileViewsCount: user.profileViewsCount }
    });

  } catch (error) {
    console.error('Error incrementing profile views:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user's datasets
const getUserDatasets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skip = (page - 1) * limit;
    
    const datasets = await DatasetCatalogue.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await DatasetCatalogue.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        datasets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDatasets: total,
          hasNext: skip + datasets.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting user datasets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user's datasets
const getCurrentUserDatasets = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    
    const datasets = await DatasetCatalogue.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await DatasetCatalogue.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        datasets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDatasets: total,
          hasNext: skip + datasets.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting current user datasets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user's sold datasets (transactions)
const getUserSoldDatasets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skip = (page - 1) * limit;
    
    let query = { sellerId: userId };
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('datasetId', 'title description coverImageUrl')
      .populate('buyerId', 'firstName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
          hasNext: skip + transactions.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting user sold datasets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user's sold datasets (transactions)
const getCurrentUserSoldDatasets = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { page = 1, limit = 10, status } = req.query;

    const skip = (page - 1) * limit;
    
    let query = { sellerId: userId };
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('datasetId', 'title description coverImageUrl')
      .populate('buyerId', 'firstName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
          hasNext: skip + transactions.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting current user sold datasets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get user statistics summary
const getUserStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get counts
    const totalDatasets = await DatasetCatalogue.countDocuments({ userId });
    const totalSold = await Transaction.countDocuments({ 
      sellerId: userId, 
      status: 'completed' 
    });
    
    // Calculate earnings
    const completedTransactions = await Transaction.find({ 
      sellerId: userId, 
      status: 'completed' 
    }).select('price platformFee royaltyAmount');
    
    const totalEarnings = completedTransactions.reduce((sum, t) => {
      return sum + (t.price - t.platformFee - t.royaltyAmount);
    }, 0);

    // Get recent activity
    const recentDatasets = await DatasetCatalogue.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt price')
      .lean();

    const recentSales = await Transaction.find({ 
      sellerId: userId, 
      status: 'completed' 
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('datasetId', 'title')
      .select('price completedAt')
      .lean();

    const statistics = {
      totalDatasets,
      totalSold,
      totalEarnings,
      profileViews: user.profileViewsCount,
      averageRating: user.sellerRating.averageRating,
      recentActivity: {
        datasets: recentDatasets,
        sales: recentSales
      }
    };

    res.status(200).json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Error getting user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user statistics summary
const getCurrentUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get counts
    const totalDatasets = await DatasetCatalogue.countDocuments({ userId });
    const totalSold = await Transaction.countDocuments({ 
      sellerId: userId, 
      status: 'completed' 
    });
    
    // Calculate earnings
    const completedTransactions = await Transaction.find({ 
      sellerId: userId, 
      status: 'completed' 
    }).select('price platformFee royaltyAmount');
    
    const totalEarnings = completedTransactions.reduce((sum, t) => {
      return sum + (t.price - t.platformFee - t.royaltyAmount);
    }, 0);

    // Get recent activity
    const recentDatasets = await DatasetCatalogue.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt price')
      .lean();

    const recentSales = await Transaction.find({ 
      sellerId: userId, 
      status: 'completed' 
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('datasetId', 'title')
      .select('price completedAt')
      .lean();

    const statistics = {
      totalDatasets,
      totalSold,
      totalEarnings,
      profileViews: user.profileViewsCount,
      averageRating: user.sellerRating.averageRating,
      recentActivity: {
        datasets: recentDatasets,
        sales: recentSales
      }
    };

    res.status(200).json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Error getting current user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
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
};
