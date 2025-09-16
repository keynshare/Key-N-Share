const { decryptDataset } = require('../utils/decryptUtil');

//Testing

/**
 * Controller to decrypt dataset buffer provided in request body
 * Expects JSON with encryptedData (base64 string) and symmetricKey (base64 string)
 */
async function decryptDatasetController(req, res) {
  try {
    const { encryptedData, symmetricKey } = req.body;

    if (!encryptedData || !symmetricKey) {
      return res.status(400).json({ message: 'Missing encryptedData or symmetricKey' });
    }

    // Convert inputs from base64 to buffers
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    const keyBuffer = Buffer.from(symmetricKey, 'base64');

    // Decrypt dataset
    const decryptedBuffer = decryptDataset(encryptedBuffer, keyBuffer);

    // Optionally encode decrypted data to base64 or any desired format for response
    const decryptedBase64 = decryptedBuffer.toString('base64');

    return res.status(200).json({ decryptedData: decryptedBase64 });
  } catch (error) {
    console.error('Dataset decryption failed:', error);
    return res.status(500).json({ message: 'Failed to decrypt dataset', error: error.message });
  }
}

module.exports = { decryptDatasetController };
