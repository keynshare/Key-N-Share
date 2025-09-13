// controllers/secretController.js
const Secret = require("../models/Secrets");
const { encryptText, decryptObject } = require("../utils/crypto");


const storeSecret = async (req, res) => {
  try {
    const { identifier, secret, meta } = req.body;
    if (!identifier || !secret) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const enc = encryptText(secret);

    const doc = await Secret.findOneAndUpdate(
      { identifier },
      { $set: { ...enc, meta: meta || null } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ ok: true, identifier: doc.identifier });
  } catch (err) {
    console.error("Error storing secret:", err);
    return res.status(500).json({ error: "failed to store" });
  }
};


const getSecret = async (req, res) => {
  try {
    const { identifier } = req.params;
    const doc = await Secret.findOne({ identifier }).lean();
    if (!doc) return res.status(404).json({ error: "not found" });

    const value = decryptObject(doc);
    return res.json({ identifier, value, meta: doc.meta });
  } catch (err) {
    console.error("Error retrieving secret:", err);
    return res.status(500).json({ error: "failed to retrieve" });
  }
};


const deleteSecret = async (req, res) => {
  try {
    const { identifier } = req.params;
    const doc = await Secret.findOneAndDelete({ identifier });
    if (!doc) return res.status(404).json({ error: "not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting secret:", err);
    return res.status(500).json({ error: "delete failed" });
  }
};

module.exports = {
  storeSecret,
  getSecret,
  deleteSecret,
};