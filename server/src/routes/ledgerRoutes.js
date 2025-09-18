// routes/ledgerRoutes.js
const express = require('express');
const router = express.Router();
const { listPublicLedger } = require('../controllers/ledgerController');

// Public ledger: newest first
router.get('/ledger', listPublicLedger);

module.exports = router;


