const crypto = require('crypto');
const bs58 = require('bs58');

/**
 * generateSymmetricKey
 * Generates a random 256-bit (32-byte) symmetric key
 * 
 * @returns {Buffer} symmetric key buffer
 */
function generateSymmetricKey() {
  return crypto.randomBytes(32); // 256 bits
}

/**
 * symmetricEncrypt
 * Encrypts buffer data with symmetric AES-256-GCM encryption
 * 
 * @param {Buffer} dataBuffer - Data to encrypt
 * @param {Buffer} key - Symmetric key (32 bytes)
 * @returns {Object} { ciphertext: Buffer, iv: Buffer, tag: Buffer }
 */
function symmetricEncrypt(dataBuffer, key) {
  const iv = crypto.randomBytes(12); // 12 bytes IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv,
    tag,
  };
}

/**
 * asymmetricEncryptSymKey
 * Encrypt symmetric key with buyer's public key using RSA-OAEP or ECC (depending on key format)
 * Here assume RSA public key in PEM format and use RSA-OAEP with SHA-256
 * 
 * @param {Buffer} symmetricKey - Symmetric key to encrypt
 * @param {string} buyerPublicKeyPEM - Buyer's RSA Public Key PEM string
 * @returns {string} base64-encoded encrypted symmetric key
 */
function asymmetricEncryptSymKey(symmetricKey, buyerPublicKeyPEM) {
  const encryptedKey = crypto.publicEncrypt(
    {
      key: buyerPublicKeyPEM,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    symmetricKey
  );

  return encryptedKey.toString('base64');
}




//Below code is for testing Purpose and working fine
// function decryptSymmetricKey(encryptedSymKeyBase64, buyerPrivateKeyPEM) {
//   const encryptedBuffer = Buffer.from(encryptedSymKeyBase64, 'base64');

//   const decryptedKeyBuffer = crypto.privateDecrypt(
//     {
//       key: buyerPrivateKeyPEM,
//       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//       oaepHash: 'sha256',
//     },
//     encryptedBuffer
//   );

//   // Return as base64 string
//   return decryptedKeyBuffer.toString('base64');
// }


module.exports = {
  generateSymmetricKey,
  symmetricEncrypt,
  asymmetricEncryptSymKey,
};
