import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, uppercase: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    rollNumber: { type: String, unique: true, index: true },
    age: Number,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    mobile: String,
    dateOfRegistration: Date,
    dateOfBirth: Date,
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    batch: String,
    section: String,
    cast: String,
    religion: String,
    year: { type: String, enum: ['1st', '2nd', '3rd', '4th'] },
    photo: String,
    address: String,
    alternateAddress: String,
    parentName: String,
    parentMobile: String,
    parentAlternateMobile: String,
    parentOccupation: String,
    hosteler: Boolean,
    regular: Boolean,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'createdByModel' },
    createdByModel: { type: String, enum: ['Teacher', 'Admin'] },
    isFirstLogin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

studentSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Student', studentSchema);


