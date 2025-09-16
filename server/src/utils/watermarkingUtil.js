/**
 * insertInvisibleWatermark
 * 
 * @param {Buffer} dataBuffer - Original dataset buffer
 * @param {string} buyerAddress - Buyer-specific identifier
 * @returns {Promise<Buffer>} - Watermarked dataset buffer
 */
async function insertInvisibleWatermark(dataBuffer, buyerAddress) {
  const watermarkBuffer = Buffer.from(`\n--watermark:${buyerAddress}--\n`, 'utf8');

  return Buffer.concat([dataBuffer, watermarkBuffer]);
}

module.exports = {
  insertInvisibleWatermark,
};
