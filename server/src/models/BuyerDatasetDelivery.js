const mongoose = require('mongoose');

const buyerDatasetDeliverySchema = new mongoose.Schema({
  datasetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'DatasetCatalogue', 
    index: true
  },
  buyerAddress: {
    type: String,
    required: true,
    index: true
  },
  buyerId: { 
    type: String 
  },
  watermarkedEncryptedDataCID: { 
    type: String, 
    required: true
 },
  encryptedSymmetricKey: {
    type: String,
    required: true
  },
}, { timestamps: true });

buyerDatasetDeliverySchema.index({ datasetId: 1, buyerAddress: 1 }, { unique: true });

buyerDatasetDeliverySchema.index({ datasetId: 1, buyerId: 1 }, { unique: true }); 

module.exports = mongoose.model('BuyerDatasetDelivery', buyerDatasetDeliverySchema);
