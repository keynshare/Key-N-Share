const DatasetCatalogue = require('../models/DatasetCatalogue');
const Secret = require('../models/Secrets');
const BuyerDatasetDelivery = require('../models/BuyerDatasetDelivery');
const { fetchDataFromIPFS, uploadToIPFS } = require('../utils/IPFSData');
const { insertInvisibleWatermark } = require('../utils/watermarkingUtil');
const { generateSymmetricKey, symmetricEncrypt, asymmetricEncryptSymKey } = require('../utils/encryptionUtil');
const { decryptObject } = require('../utils/crypto');
const { decryptDatasetBuffer } = require('../utils/decryptDatasetBuffer'); 

async function deliverDatasetToBuyer(req, res) {
  try { 
    const { datasetId, buyerAddress, buyerId, buyerPublicKey } = req.body;
    if (!datasetId || !buyerAddress || !buyerPublicKey) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // 1. Get Dataset record with CID
    const dataset = await DatasetCatalogue.findById(datasetId).lean();
    if (!dataset) return res.status(404).json({ message: 'Dataset not found.' });

    // 2. Fetch encrypted dataset buffer from IPFS (stored encrypted)
    const encryptedDataBuffer = await fetchDataFromIPFS(dataset.dataCID);

    // 3. Get encrypted dataset secret key from Secrets model and decrypt it (this is the password/key used to symmetrically decrypt dataset)
    const secretDoc = await Secret.findOne({ identifier: datasetId }).lean();
    if (!secretDoc) return res.status(404).json({ message: 'Secret key not found.' });
    const datasetSecretKey = decryptObject(secretDoc); // string password/key

    // 4. Decrypt the encrypted dataset buffer fetched from IPFS using the decrypted datasetSecretKey
    const decryptedDatasetBuffer = await decryptDatasetBuffer(encryptedDataBuffer, datasetSecretKey);

    // 5. Insert invisible watermark buyer-specific into the decrypted plaintext dataset buffer
    const watermarkedBuffer = await insertInvisibleWatermark(decryptedDatasetBuffer, buyerAddress);

    // 6. Generate a new random symmetric key for encrypting buyer-specific copy
    const symmetricKey = generateSymmetricKey();

    // 7. Encrypt the watermarked dataset symmetrically using the new symmetric key
    const { ciphertext, iv, tag } = symmetricEncrypt(watermarkedBuffer, symmetricKey);

    // Combine ciphertext, iv, tag into a single buffer for uploading (custom format: iv + ciphertext + tag)
    const encryptedBufferForUpload = Buffer.concat([iv, ciphertext, tag]);

    // 8. Upload encrypted dataset buffer to IPFS and get new CID
    const newCID = await uploadToIPFS(encryptedBufferForUpload, `buyer_${buyerAddress}_dataset`);

    // 9. Encrypt the new symmetric key with the buyer’s public key (asymmetric encryption)
    const encryptedSymKey = asymmetricEncryptSymKey(symmetricKey, buyerPublicKey);

    // 10. Store buyer dataset delivery record
    await BuyerDatasetDelivery.findOneAndUpdate(
      { datasetId, buyerAddress },
      { watermarkedEncryptedDataCID: newCID, encryptedSymmetricKey: encryptedSymKey, buyerId: buyerId || null },
      { upsert: true, new: true }
    );

    // 11. Return the new CID and encrypted symmetric key to buyer
    return res.status(200).json({ cid: newCID, encryptedSymmetricKey: encryptedSymKey });
  } catch (error) {
    console.error('Deliver dataset error:', error);
    return res.status(500).json({ message: 'Failed to deliver dataset', error: error.message });
  }
}


//Testing
// const getKeyController = async (req, res) => { 
//     try {
//         const {key,privateKey} = req.body;
//         if (!key || !privateKey) {
//             return res.status(400).json({ message: 'Missing required fields.' });
//         }
//         const decryptedKey = decryptSymmetricKey(key, privateKey);
//         return res.status(200).json({decryptedKey});
//     } catch (error) {
//         console.error('Get Key error:', error);
//         return res.status(500).json({ message: 'Failed to get key', error: error.message });
//     }
// };

const checkReencryptedExists = async (req, res) => {
  try {
    const { datasetId, buyerId } = req.query;

    if (!datasetId || !buyerId) {
      return res.status(400).json({
        message: 'datasetId and buyerId are required',
        exists: false
      });
    }

    const delivery = await BuyerDatasetDelivery.findOne({ datasetId, buyerId })
      .select('watermarkedEncryptedDataCID encryptedSymmetricKey createdAt updatedAt')
      .lean();

    if (!delivery) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({
      exists: true,
      cid: delivery.watermarkedEncryptedDataCID,
      encryptedSymmetricKey: delivery.encryptedSymmetricKey,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', exists: false });
  }
};

module.exports = { deliverDatasetToBuyer, checkReencryptedExists };
