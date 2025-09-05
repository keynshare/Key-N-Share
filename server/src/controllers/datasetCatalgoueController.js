const DatasetCatalogue = require('../models/DatasetCatalogue');

async function addDataset(req, res) {
    try {
        const {
                userId,
                sellerAddress,
                title,
                price,
                dataCID,
                originalContentHash,
                description,
                coverImageUrl,
                tags,
                fileSize
            } = req.body;

            if (
                !userId || !sellerAddress || !title ||
                !price || !dataCID || !originalContentHash || !description
            ) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            const newDataset = new DatasetCatalogue({
                userId,
                sellerAddress,
                title,
                price,
                dataCID,
                originalContentHash,
                description,
                coverImageUrl,
                tags,
                fileSize
            });

            const savedDataset = await newDataset.save();
            res.status(201).json(savedDataset);
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: 'Duplicate dataCID.' });
            }
            res.status(500).json({ message: err.message });
    }
}

async function getDatasets(req, res) {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

    const projection = 'title description sellerAddress price coverImageUrl tags downloads views fileSize extension averageRating createdAt';

    const datasets = await DatasetCatalogue.find({})
      .select(projection)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await DatasetCatalogue.countDocuments();

    res.status(200).json({
      data: datasets,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getDatasetById(req, res){
  try {
    const dataset = await DatasetCatalogue.findById(req.params.id).lean();

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found.' });
    }

    res.status(200).json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getDatasetByUser(req,res){
  try {
    const datasets = await DatasetCatalogue.find({ userId: req.params.userId }).lean();

    if (!datasets || datasets.length === 0) {
      return res.status(404).json({ message: 'No datasets found for this user.' });
    }

    res.status(200).json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
    addDataset,
    getDatasets,
    getDatasetById,
    getDatasetByUser
};