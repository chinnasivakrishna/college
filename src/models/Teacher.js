import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true, unique: true, uppercase: true, index: true },
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
    subject: [String],
    qualification: String,
    dateOfJoining: Date,
    salary: Number,
    experience: Number,
    hosteler: { type: Boolean, default: false },
    class: { type: String, enum: ['teaching', 'non-teaching'] },
    cast: String,
    religion: String,
    married: Boolean,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isFirstLogin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teacherSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

teacherSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Teacher', teacherSchema);


