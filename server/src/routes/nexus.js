const express = require("express");
const {nexusBotController} = require("../controllers/nexusBotController");
const router = express.Router();

router.post('/',nexusBotController);

module.exports = router;