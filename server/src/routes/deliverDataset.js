const express = require('express');
const router = express.Router();
const { deliverDatasetToBuyer,checkReencryptedExists,checkHashIntegrity } = require('../controllers/datasetDeliveryController'); 

router.post('/deliver-dataset', deliverDatasetToBuyer);

router.get('/delivery-exists', checkReencryptedExists);

router.post('/check-integrity',checkHashIntegrity);
// router.get('/getKey', getKeyController); Testing

module.exports = router;


//Below code is for testing Purpose
// const express = require('express'); 
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { decryptDataset } = require('../utils/decryptUtil');

// const upload = multer();
// const router = express.Router();

// router.post('/decrypt-dataset', upload.single('file'), async (req, res) => {
//   try {
//     const fileBuffer = req.file.buffer; // uploaded encrypted file buffer
//     const symmetricKeyBase64 = req.body.symmetricKey; // base64 encoded symmetric key

//     if (!fileBuffer || !symmetricKeyBase64) {
//       return res.status(400).json({ message: 'Missing file or symmetricKey' });
//     }

//     // Convert symmetric key to Buffer
//     const keyBuffer = Buffer.from(symmetricKeyBase64, 'base64');

//     // Decrypt file buffer
//     const decryptedBuffer = decryptDataset(fileBuffer, keyBuffer);

//     // Prepare decrypted file for sending
//     res.setHeader('Content-Disposition', 'attachment; filename=decrypted_dataset');
//     res.setHeader('Content-Type', 'application/octet-stream');
//     return res.send(decryptedBuffer);
//   } catch (error) {
//     console.error('Decryption failed:', error);
//     return res.status(500).json({ message: 'Failed to decrypt file', error: error.message });
//   }
// });

// module.exports = router;
