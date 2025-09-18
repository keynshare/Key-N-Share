// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    buyerAddress: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DatasetCatalogue', // important for populate
      required: true,
      index: true
    },
    txnSign: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

orderSchema.index({ buyerId: 1, datasetId: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);
