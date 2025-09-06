const { Router } = require('express');
const { addDataset,getDatasets,getDatasetById,getDatasetByUser } = require('../controllers/datasetCatalgoueController');

const router = Router();

router.post('/', addDataset);

// GET /api/datasets?page=1&limit=10
router.get('/', getDatasets);

router.get('/:id', getDatasetById);

router.get('/user/:userId', getDatasetByUser);

module.exports = router;
