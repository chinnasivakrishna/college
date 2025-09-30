import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const superAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registerId: { type: String, required: true, unique: true, uppercase: true, index: true },
    password: { type: String, required: true },
    isFirstLogin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

superAdminSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

superAdminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('SuperAdmin', superAdminSchema);


