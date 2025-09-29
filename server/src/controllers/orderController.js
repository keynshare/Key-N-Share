
const Order = require('../models/Order');
const DatasetCatalogue = require('../models/DatasetCatalogue');
const Rating = require('../models/Rating');

// Projection for dataset fields returned to clients
const DATASET_SELECT =
  'userId sellerAddress title price dataCID originalContentHash description coverImageUrl tags fileSize extension downloads views averageRating schema source createdAt updatedAt';

const createOrder = async (req, res) => {
  try {
    const { buyerId, buyerAddress, datasetId, txnSign } = req.body;

    if (!buyerId || !buyerAddress || !datasetId || !txnSign) {
      return res.status(400).json({ error: 'buyerId, buyerAddress, datasetId, and txnSign are required' });
    }

    const order = await Order.create({ buyerId, buyerAddress, datasetId, txnSign });

    const dataset = await DatasetCatalogue.findById(order.datasetId)
      .select(DATASET_SELECT)
      .lean();

    return res.status(201).json({
      message: 'Order created',
      order: {
        ...order.toObject(),
        dataset
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Order already exists for buyerId and datasetId' });
    }
    console.error('createOrder error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const listOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(100, Number(req.query.limit) > 0 ? Number(req.query.limit) : 20);


    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { buyerId: userId };

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Order.countDocuments(filter)
    ]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    const datasetIds = [...new Set(orders.map(o => String(o.datasetId)))];
    const datasets = await DatasetCatalogue.find({ _id: { $in: datasetIds } })
      .select(DATASET_SELECT)
      .lean();
    const datasetMap = new Map(datasets.map(d => [String(d._id), d]));

    // Get rating summaries for datasets
    const datasetRatingSummaries = await Promise.all(
      datasetIds.map(async (datasetId) => {
        const ratings = await Rating.find({ datasetId, ratingType: 'dataset' }).lean();
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
          : 0;
        
        return {
          datasetId,
          ratingSummary: {
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings
          }
        };
      })
    );

    const ratingMap = new Map(datasetRatingSummaries.map(r => [r.datasetId, r.ratingSummary]));

    const enriched = orders.map(o => ({
      ...o,
      dataset: datasetMap.get(String(o.datasetId)) || null,
      ratingSummary: ratingMap.get(String(o.datasetId)) || { averageRating: 0, totalRatings: 0 }
    }));

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      orders: enriched
    });
  } catch (err) {
    console.error('listOrders error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const dataset = await DatasetCatalogue.findById(order.datasetId)
      .select(DATASET_SELECT)
      .lean();

    // Get rating summary for the dataset
    const ratings = await Rating.find({ datasetId: order.datasetId, ratingType: 'dataset' }).lean();
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    const ratingSummary = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings
    };

    return res.status(200).json({
      order: {
        ...order,
        dataset,
        ratingSummary
      }
    });
  } catch (err) {
    console.error('getOrderById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  listOrders,
  getOrderById
};