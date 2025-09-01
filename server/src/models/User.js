const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      trim: true,
      maxlength: 100,
      default: '',
      required: false
    },
    bio: { 
      type: String, 
      trim: true, 
      maxlength: 500,
      default: '' 
    },
    datasets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DatasetCatalogue'
    }],
    profileViewsCount: {
      type: Number,
      default: 0
    },
    disputesRaised: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute'
    }],
    disputesSolved: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute'
    }],
    datasetsSold: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }],
    termsAccepted: {
      accepted: { type: Boolean, default: false },
      acceptedAt: { type: Date },
      acceptedVersion: { type: String, default: '1.0.0' },
      ipAddress: { type: String },
      userAgent: { type: String }
    },
    // preferences: {
    //   rememberMe: { type: Boolean, default: false },
    //   lastLoginAt: { type: Date },
    //   loginCount: { type: Number, default: 0 }
    // },
    // walletAddress: {
    //   type: String,
    //   required: false,
    //   unique: true,
    //   trim: true
    // },
    sellerRating: {
      totalRating: { type: Number, default: 0 },
      numberOfRatings: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    },
    buyerRating: {
      totalRating: { type: Number, default: 0 },
      numberOfRatings: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// Update lastLoginAt and increment loginCount on each login
userSchema.methods.updateLoginStats = function () {
  this.preferences.lastLoginAt = new Date();
  this.preferences.loginCount += 1;
  return this.save();
};

// Method to increment profile views
userSchema.methods.incrementProfileViews = function () {
  this.profileViewsCount += 1;
  return this.save();
};

// Method to add a dataset to user's datasets array
userSchema.methods.addDataset = function (datasetId) {
  if (!this.datasets.includes(datasetId)) {
    this.datasets.push(datasetId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a dataset from user's datasets array
userSchema.methods.removeDataset = function (datasetId) {
  this.datasets = this.datasets.filter(id => !id.equals(datasetId));
  return this.save();
};

// Method to add a dispute to disputesRaised array
userSchema.methods.addDisputeRaised = function (disputeId) {
  if (!this.disputesRaised.includes(disputeId)) {
    this.disputesRaised.push(disputeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add a dispute to disputesSolved array
userSchema.methods.addDisputeSolved = function (disputeId) {
  if (!this.disputesSolved.includes(disputeId)) {
    this.disputesSolved.push(disputeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add a sold dataset transaction
userSchema.methods.addDatasetSold = function (transactionId) {
  if (!this.datasetsSold.includes(transactionId)) {
    this.datasetsSold.push(transactionId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a sold dataset transaction
userSchema.methods.removeDatasetSold = function (transactionId) {
  this.datasetsSold = this.datasetsSold.filter(id => !id.equals(transactionId));
  return this.save();
};

module.exports = mongoose.model('User', userSchema);


