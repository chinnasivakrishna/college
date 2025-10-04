import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    // Daily attendance (global) — unique per student per date
    date: { type: String, index: true }, // YYYY-MM-DD string for easy unique compound index
    // Optional link to session attendance when marked in a teacher-opened session
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession' },

    // Capture where the student was when marking
    location: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lon: { type: Number, required: true, min: -180, max: 180 },
    },

    markedAt: { type: Date, default: Date.now },
    source: { type: String, enum: ['daily', 'session'], required: true },
  },
  { timestamps: true }
);

// Unique guard for daily attendance
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true, partialFilterExpression: { date: { $type: 'string' } } });

// Unique guard for session attendance (one per session per student)
studentAttendanceSchema.index(
  { student: 1, session: 1 },
  { unique: true, partialFilterExpression: { session: { $type: 'objectId' } } }
);

export default mongoose.model('StudentAttendance', studentAttendanceSchema);



