const crypto = require('crypto');

/**
 * Decrypts an AES-256-GCM encrypted dataset buffer.
 * Expected buffer format: [salt(16 bytes) | iv(12 bytes) | ciphertext(rest)]
 * Derives key from the password+salth using PBKDF2 SHA-256 (100000 iterations).
 *
 * @param {Buffer} encryptedBuffer - The encrypted dataset buffer fetched from IPFS
 * @param {string} password - The symmetric key as a UTF-8 string (decrypted secret)
 * @returns {Promise<Buffer>} - Decrypted dataset buffer
 */
async function decryptDatasetBuffer(encryptedBuffer, password) {
  if (encryptedBuffer.length < 28) {
    throw new Error('Encrypted data buffer too short. Please check the input data.');
  }

  // Extract salt, iv, and ciphertext
  const salt = encryptedBuffer.slice(0, 16);
  const iv = encryptedBuffer.slice(16, 28);
  const ciphertextWithTag = encryptedBuffer.slice(28);

  if (ciphertextWithTag.length < 16) {
    throw new Error('Ciphertext too short to contain auth tag. Please check the input data.');
  }

  const authTag = ciphertextWithTag.slice(ciphertextWithTag.length - 16);
  const ciphertext = ciphertextWithTag.slice(0, ciphertextWithTag.length - 16);

  // Derive key using PBKDF2 (100000 iterations, SHA-256, 32-byte key)

  const key = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });

  // Decrypt using AES-256-GCM
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return decrypted;
}

module.exports = { decryptDatasetBuffer };
