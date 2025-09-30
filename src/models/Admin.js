import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true, unique: true, uppercase: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    mobile: { type: String, unique: true, sparse: true },
    alternateMobile: String,
    address: String,
    alternateAddress: String,
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    expiry: Date,
    position: String,
    hosteler: { type: Boolean, default: false },
    salary: Number,
    dateOfJoining: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isFirstLogin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adminSchema.index({ email: 1 });
adminSchema.index({ adminId: 1 });

adminSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Admin', adminSchema);


