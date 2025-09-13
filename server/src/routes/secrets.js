const express = require('express');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {storeSecret, getSecret, deleteSecret} = require('../controllers/secretController');

router.post("/addSecret", storeSecret);
router.get("/getSecret/:identifier", getSecret);
router.delete("/deleteSecret/:identifier", deleteSecret);

module.exports = router;