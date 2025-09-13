const crypto = require("crypto");
const { MASTER_KEY } = require("../../constants");

const ALGO = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;
const TAG_LEN = 16;


function getMasterKeyFromEnv() {
  const mk = process.env.MASTER_KEY;
  if (!mk) throw new Error("MASTER_KEY not set");
  const buf = Buffer.from(mk, "base64");
  if (buf.length !== KEY_LEN) throw new Error("MASTER_KEY must be 32 bytes (base64)");
  return buf;
}

function encryptText(plainText) {
  const key = getMasterKeyFromEnv();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv, { authTagLength: TAG_LEN });

  const ct = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: ct.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

function decryptObject({ ciphertext, iv, tag }) {
  const key = getMasterKeyFromEnv();
  const ivBuf = Buffer.from(iv, "base64");
  const tagBuf = Buffer.from(tag, "base64");
  const ctBuf = Buffer.from(ciphertext, "base64");

  const decipher = crypto.createDecipheriv(ALGO, key, ivBuf, { authTagLength: TAG_LEN });
  decipher.setAuthTag(tagBuf);

  const plain = Buffer.concat([decipher.update(ctBuf), decipher.final()]);
  return plain.toString("utf8");
}

module.exports = { encryptText, decryptObject };