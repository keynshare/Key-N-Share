const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadDataset, getDatasetByCID, deleteDataset } = require('../controllers/datasetController');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/upload', upload.single('dataset'), uploadDataset);
router.get('/:cid', getDatasetByCID);
router.delete('/:cid', deleteDataset);

module.exports = router;