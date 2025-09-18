const express = require('express');

const router = express.Router();
const { addPublicKeyController,getPublicKeyController } = require('../controllers/userController');

router.post('/addPublicKey', addPublicKeyController);
router.get('/publicKey', getPublicKeyController);


module.exports = router;