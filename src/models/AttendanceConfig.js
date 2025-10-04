import mongoose from 'mongoose';

const attendanceConfigSchema = new mongoose.Schema(
  {
    // Global daily attendance geofence configured by Super Admin
    center: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lon: { type: Number, required: true, min: -180, max: 180 },
    },
    radiusMeters: { type: Number, required: true, min: 1 },
    // Optionally restrict marking window for daily attendance
    windowStartMinutes: { type: Number, default: 7 * 60, min: 0, max: 24 * 60 - 1 }, // 07:00
    windowEndMinutes: { type: Number, default: 10 * 60, min: 0, max: 24 * 60 - 1 }, // 10:00
    isEnabled: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin' },
  },
  { timestamps: true }
);

attendanceConfigSchema.index({ updatedAt: -1 });

export default mongoose.model('AttendanceConfig', attendanceConfigSchema);



