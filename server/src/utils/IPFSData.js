const stream = require('stream');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const { PINATA_API_KEY, PINATA_SECRET_KEY, PINATA_GATEWAY } = require('../../constants');

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

/**
 * Fetch raw data buffer from IPFS via Pinata Gateway
 * @param {string} cid - IPFS content identifier
 * @returns {Promise<Buffer>} - Raw dataset buffer
 */
async function fetchDataFromIPFS(cid) {
  if (!cid || (!cid.startsWith('Qm') && !cid.startsWith('baf'))) {
    throw new Error('Invalid CID format');
  }

  const url = `https://${PINATA_GATEWAY}/ipfs/${cid}`;
  // Fetch raw binary data from gateway
  const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });

  return Buffer.from(response.data);
}

/**
 * Upload buffer data to IPFS via Pinata, optionally with filename metadata
 * @param {Buffer} buffer - Raw data buffer to upload
 * @param {string} [filename='file'] - Filename metadata for Pinata
 * @returns {Promise<string>} - IPFS CID of uploaded content
 */
async function uploadToIPFS(buffer, filename = 'file') {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer data');
  }

  // Convert buffer to stream for Pinata upload
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  const options = {
    pinataMetadata: { name: filename },
    pinataOptions: { cidVersion: 1 }
  };

  const result = await pinata.pinFileToIPFS(bufferStream, options);
  return result.IpfsHash;
}

module.exports = {
  fetchDataFromIPFS,
  uploadToIPFS
};
