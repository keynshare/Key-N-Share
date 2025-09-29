const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    // Rating for a dataset
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DatasetCatalogue',
      required: false,
      index: true
    },
    // Rating for a user (as seller or buyer)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    // Who gave the rating
    raterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Rating value (1-5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Optional comment/review
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    // Type of rating: 'dataset', 'seller', 'buyer'
    ratingType: {
      type: String,
      required: true,
      enum: ['dataset', 'seller', 'buyer'],
      index: true
    },
    // Related order (if rating is from a purchase)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
      index: true
    }
  },
  { timestamps: true }
);

// Ensure one rating per rater per target (dataset or user)
ratingSchema.index({ raterId: 1, datasetId: 1 }, { unique: true, partialFilterExpression: { datasetId: { $exists: true } } });
ratingSchema.index({ raterId: 1, userId: 1, ratingType: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });

// Compound indexes for efficient queries
ratingSchema.index({ datasetId: 1, ratingType: 1 });
ratingSchema.index({ userId: 1, ratingType: 1 });
ratingSchema.index({ orderId: 1 });

module.exports = mongoose.model('Rating', ratingSchema);
