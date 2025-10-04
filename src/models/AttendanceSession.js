import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema(
  {
    // A session created by a Teacher for a class/section
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    title: { type: String, required: true, trim: true },
    // Optional linkage to class identifiers if available in system
    batch: String,
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    section: String,

    center: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lon: { type: Number, required: true, min: -180, max: 180 },
    },
    radiusMeters: { type: Number, required: true, min: 1 },

    // Time window
    openAt: { type: Date, required: true },
    closeAt: { type: Date, required: true },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

attendanceSessionSchema.index({ teacher: 1, openAt: -1 });
attendanceSessionSchema.index({ openAt: -1, closeAt: -1 });

export default mongoose.model('AttendanceSession', attendanceSessionSchema);



