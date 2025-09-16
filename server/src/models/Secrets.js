const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true, index: true },
  ciphertext: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  meta: { type: String },
}, { timestamps: true });

const Secret = mongoose.model("Secret", secretSchema);

module.exports = Secret;