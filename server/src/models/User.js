const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    termsAccepted: {
      accepted: { type: Boolean, default: false },
      acceptedAt: { type: Date },
      acceptedVersion: { type: String, default: '1.0.0' },
      ipAddress: { type: String },
      userAgent: { type: String }
    },
    preferences: {
      rememberMe: { type: Boolean, default: false },
      lastLoginAt: { type: Date },
      loginCount: { type: Number, default: 0 }
    },
    walletAddress: {
      type: String,
      required: false,
      unique: true,
      trim: true
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

module.exports = mongoose.model('User', userSchema);


