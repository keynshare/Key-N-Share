
const Order = require('../models/Order');
const DatasetCatalogue = require('../models/DatasetCatalogue');

const DATASET_SELECT = 'title price dataCID originalContentHash sellerAddress userId';

exports.listPublicLedger = async (req, res) => {
  try {
    // Optional: pagination
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Math.min(100, Number(req.query.limit) > 0 ? Number(req.query.limit) : 50);
    const skip = (page - 1) * limit;

    // Fetch orders newest first
    const [orders, total] = await Promise.all([
      Order.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({})
    ]);

    // Gather dataset ids and fetch details in batch
    const datasetIds = [...new Set(orders.map(o => String(o.datasetId)))];
    const datasets = await DatasetCatalogue.find({ _id: { $in: datasetIds } })
      .select(DATASET_SELECT)
      .lean();
    const datasetMap = new Map(datasets.map(d => [String(d._id), d]));

    // Build ledger entries
    const entries = orders.map(o => {
      const d = datasetMap.get(String(o.datasetId));
      return {
        buyerAddress: o.buyerAddress,
        sellerAddress: d?.sellerAddress || null,
        dataset: d
          ? {
              id: String(d._id),
              name: d.title,
              cost: d.price,
              cid: d.dataCID,
              hash: d.originalContentHash
            }
          : null,
        txnSign: o.txnSign,
        createdAt: o.createdAt
      };
    });

    return res.status(200).json({
      page,
      limit,
      total,
      entries
    });
  } catch (err) {
    console.error('listPublicLedger error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
