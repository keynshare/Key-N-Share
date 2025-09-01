const mongoose = require('mongoose');

const datasetCatalogueSchema = new mongoose.Schema(
    {
        // A direct reference to the User model for easy identification and joins
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

        // Dataset ID from the smart contract, for indexing
        datasetId: { type: Number, required: true, unique: true },

        // Core on-chain metadata (from the smart contract)
        sellerAddress: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        dataCID: { type: String, required: true, unique: true, trim: true },
        originalContentHash: { type: String, required: true, trim: true },

        // Additional off-chain metadata for search & display
        description: { type: String, required: true },
        coverImageUrl: { type: String, trim: true },
        tags: { type: [String], trim: true },
        fileSize: { type: String, trim: true },

        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
    },
    { timestamps: true }
);

datasetCatalogueSchema.index({ datasetId: 1 });
datasetCatalogueSchema.index({ sellerAddress: 1 });

module.exports = mongoose.model('DatasetCatalogue', datasetCatalogueSchema);