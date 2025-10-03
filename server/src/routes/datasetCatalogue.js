const { Router } = require('express');
const { addDataset,getDatasets,getDatasetById,getDatasetByUser } = require("../controllers/datasetCatalgoueController")
const router = Router();

router.post('/', addDataset);
// GET /api/datasets?page=1&limit=10
router.get('/', getDatasets);

router.get('/user/:userId', getDatasetByUser);
// router.get('/datasetname', getDatasetName);
router.get('/user', (req, res) => {
  res.status(400).json({ message: 'Missing userId parameter' });
});

router.get('/:id', getDatasetById);

module.exports = router;
