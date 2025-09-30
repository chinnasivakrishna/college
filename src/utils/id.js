// Generates incremental IDs with prefix and zero-padded counter, e.g., SA001
// In production, consider a dedicated counters collection for atomic increments.
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.__Counter || mongoose.model('__Counter', counterSchema);

export async function generateId(prefix, pad = 3) {
  const doc = await Counter.findOneAndUpdate(
    { key: prefix },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  const number = String(doc.seq).padStart(pad, '0');
  return `${prefix}${number}`;
}


