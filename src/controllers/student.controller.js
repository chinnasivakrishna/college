import Student from '../models/Student.js';

export async function getProfile(req, res, next) {
  try {
    const s = await Student.findById(req.user.id);
    if (!s) return res.status(404).json({ success: false, message: 'Profile not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Profile fetched', data: s, error: {} });
  } catch (err) { next(err); }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ['name', 'email', 'mobile', 'address', 'alternateAddress', 'photo'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    if (update.email) update.email = update.email.toLowerCase();
    const s = await Student.findByIdAndUpdate(req.user.id, update, { new: true });
    if (!s) return res.status(404).json({ success: false, message: 'Profile not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Profile updated', data: s, error: {} });
  } catch (err) { next(err); }
}


// Attendance
import AttendanceConfig from '../models/AttendanceConfig.js';
import AttendanceSession from '../models/AttendanceSession.js';
import StudentAttendance from '../models/StudentAttendance.js';
import { isWithinRadius } from '../utils/geo.js';

function toDateStringYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function markDailyAttendance(req, res, next) {
  try {
    const { lat, lon } = req.body;
    const config = await AttendanceConfig.findOne({ isEnabled: true }).sort({ updatedAt: -1 });
    if (!config) return res.status(400).json({ success: false, message: 'Attendance not configured', data: {}, error: {} });

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes < config.windowStartMinutes || minutes > config.windowEndMinutes) {
      return res.status(400).json({ success: false, message: 'Outside daily attendance window', data: {}, error: {} });
    }

    if (!isWithinRadius(lat, lon, config.center.lat, config.center.lon, config.radiusMeters)) {
      return res.status(400).json({ success: false, message: 'Not within campus geofence', data: {}, error: {} });
    }

    const date = toDateStringYMD(now);
    try {
      const doc = await StudentAttendance.create({
        student: req.user.id,
        date,
        location: { lat, lon },
        source: 'daily',
      });
      return res.status(201).json({ success: true, message: 'Daily attendance marked', data: { id: doc._id }, error: {} });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ success: false, message: 'Already marked for today', data: {}, error: {} });
      }
      throw e;
    }
  } catch (err) { next(err); }
}

export async function markSessionAttendance(req, res, next) {
  try {
    const { lat, lon } = req.body;
    const { sessionId } = req.params;
    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found', data: {}, error: {} });
    const now = new Date();
    if (session.isClosed || now < session.openAt || now > session.closeAt) {
      return res.status(400).json({ success: false, message: 'Session not open', data: {}, error: {} });
    }
    if (!isWithinRadius(lat, lon, session.center.lat, session.center.lon, session.radiusMeters)) {
      return res.status(400).json({ success: false, message: 'Not within session geofence', data: {}, error: {} });
    }
    try {
      const doc = await StudentAttendance.create({
        student: req.user.id,
        session: session._id,
        location: { lat, lon },
        source: 'session',
      });
      return res.status(201).json({ success: true, message: 'Session attendance marked', data: { id: doc._id }, error: {} });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ success: false, message: 'Already marked for this session', data: {}, error: {} });
      }
      throw e;
    }
  } catch (err) { next(err); }
}
