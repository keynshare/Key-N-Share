const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    // Transaction details
    transactionHash: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    
    // Dataset being sold
    datasetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'DatasetCatalogue' 
    },
    
    // Seller and buyer information
    sellerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    buyerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    
    // Financial details
    price: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: 'MATIC', 
      enum: ['MATIC', 'ETH', 'USD'] 
    },
    
    // Transaction status
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending' 
    },
    
    // Platform fees and royalties
    platformFee: { 
      type: Number, 
      default: 0 
    },
    royaltyAmount: { 
      type: Number, 
      default: 0 
    },
    
    // Metadata
    paymentMethod: { 
      type: String, 
      enum: ['crypto', 'fiat', 'credit_card'],
      default: 'crypto' 
    },
    
    // Timestamps
    completedAt: { 
      type: Date 
    },
    cancelledAt: { 
      type: Date 
    },
    
    // Additional notes
    notes: { 
      type: String, 
      trim: true,
      maxlength: 500 
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ datasetId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

// Method to mark transaction as completed
transactionSchema.methods.markCompleted = function () {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to mark transaction as cancelled
transactionSchema.methods.markCancelled = function (notes = '') {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  if (notes) this.notes = notes;
  return this.save();
};

// Method to mark transaction as failed
transactionSchema.methods.markFailed = function (notes = '') {
  this.status = 'failed';
  if (notes) this.notes = notes;
  return this.save();
};

// Virtual for total amount (price + platform fee)
transactionSchema.virtual('totalAmount').get(function() {
  return this.price + this.platformFee;
});

// Virtual for seller's net amount (price - platform fee - royalty)
transactionSchema.virtual('sellerNetAmount').get(function() {
  return this.price - this.platformFee - this.royaltyAmount;
});

// Ensure virtual fields are included when converting to JSON
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);
