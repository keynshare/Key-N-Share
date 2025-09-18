
const Order = require('../models/Order');
const DatasetCatalogue = require('../models/DatasetCatalogue');

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
    const { userId, page = 1, limit = 20 } = req.body;

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

    const datasetIds = [...new Set(orders.map(o => String(o.datasetId)))];
    const datasets = await DatasetCatalogue.find({ _id: { $in: datasetIds } })
      .select(DATASET_SELECT)
      .lean();
    const datasetMap = new Map(datasets.map(d => [String(d._id), d]));

    const enriched = orders.map(o => ({
      ...o,
      dataset: datasetMap.get(String(o.datasetId)) || null
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

    return res.status(200).json({
      order: {
        ...order,
        dataset
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