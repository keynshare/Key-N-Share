// models/Secret.js
import mongoose from "mongoose";

const secretSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true, index: true },
  ciphertext: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  meta: { type: String },
}, { timestamps: true });

export default mongoose.models.Secret || mongoose.model("Secret", secretSchema);
