const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'DatasetCatalogue', unique: true }],
    }, { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);