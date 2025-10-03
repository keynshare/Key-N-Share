const DatasetCatalogue = require('../models/DatasetCatalogue');
const User = require('../models/User');
const mongoose = require('mongoose');

const DATASET_SELECT = 'title description sellerAddress price coverImageUrl fileSize extension averageRating createdAt dataCID originalContentHash tags schema source userId';
const USER_SELECT = 'firstName role';


async function addDataset(req, res) {
  try {
    const {
      userId,
      sellerAddress,
      title,
      extension,
      price,
      dataCID,
      originalContentHash,
      description,
      coverImageUrl,
      tags,
      fileSize,
      schema,
      source
    } = req.body;

    if (
      !userId || !sellerAddress || !title ||
      !price || !dataCID || !originalContentHash || !description || !extension || !fileSize
    ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const existing = await DatasetCatalogue.findOne({ originalContentHash }).select('_id').lean();
    if (existing) {
      return res.status(404).json({ message: 'A dataset with this originalContentHash already exists.' });
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
      fileSize,
      extension,
      schema,
      source,
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

    const projection = DATASET_SELECT;

    const query = {};
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const [datasets, total] = await Promise.all([
      DatasetCatalogue.find(query)
        .select(projection)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      DatasetCatalogue.countDocuments(query)
    ]);

    const userIds = [...new Set(datasets.map(d => String(d.userId)))];
    const users = await User.find({ _id: { $in: userIds } }).select(USER_SELECT).lean();
    const userMap = new Map(users.map(u => [String(u._id), u]));

    const data = datasets.map(d => {
      const u = userMap.get(String(d.userId));
      return {
        ...d,
        user: u ? { id: String(u._id), name: u.firstName, role: u.role || '' } : null
      };
    });

    res.status(200).json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getDatasetById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid dataset id' });
    }
    const dataset = await DatasetCatalogue.findById(id)
      .select(DATASET_SELECT)
      .lean();

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found.' });
    }

    const u = await User.findById(dataset.userId).select(USER_SELECT).lean();
    const user = u ? { id: String(u._id), name: u.firstName, role: u.role || '' } : null;

    res.status(200).json({ ...dataset, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getDatasetByUser(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

    const [datasets, total] = await Promise.all([
      DatasetCatalogue.find({ userId })
        .select(DATASET_SELECT)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      DatasetCatalogue.countDocuments({ userId })
    ]);

    if (!datasets.length) {
      return res.status(200).json({ data: [], page, limit, total: 0, totalPages: 0 });
    }

    const u = await User.findById(userId).select(USER_SELECT).lean();
    const user = u ? { id: String(u._id), name: u.firstName, role: u.role || '' } : null;

    const data = datasets.map(d => ({ ...d, user }));

    return res.status(200).json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// async function getDatasetName(req, res) {
//   try {
//     const { id } = req.query;
//     console.log("Dataset ID:", id); // Debug log
//     const dataset = await DatasetCatalogue.findById(id)
//       .select('title')
//       .lean();  
//     if (!dataset) {
//       return res.status(404).json({ message: 'Dataset not found.' });
//     } 
//     res.status(200).json({ title: dataset.title });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   } 
// }

module.exports = {
  addDataset,
  getDatasets,
  getDatasetById,
 getDatasetByUser,
  // getDatasetName
};