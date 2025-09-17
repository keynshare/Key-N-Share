const crypto = require('crypto');

function decryptDataset(encryptedBuffer, key) {
  
  const iv = encryptedBuffer.slice(0, 12);
  const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
  const ciphertext = encryptedBuffer.slice(12, encryptedBuffer.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return decrypted;
}

module.exports = { 
  decryptDataset,
};
