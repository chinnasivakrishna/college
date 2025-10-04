import Student from '../models/Student.js';
import { sendEmail, renderWelcomeTemplate } from '../utils/emailService.js';
import { generateId } from '../utils/id.js';

export async function createStudent(req, res, next) {
  try {
    const { email, rollNumber } = req.body;
    const studentId = await generateId('STU');
    const s = await Student.create({
      ...req.body,
      email: email.toLowerCase(),
      studentId,
      password: rollNumber,
      createdBy: req.user.id,
      createdByModel: 'Teacher',
    });
    await sendEmail({ to: s.email, subject: 'Welcome - Student Account', html: renderWelcomeTemplate({ name: s.name, registerId: s.studentId }) });
    return res.status(201).json({ success: true, message: 'Student created', data: { id: s._id }, error: {} });
  } catch (err) { next(err); }
}

export async function listStudents(req, res, next) {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, gender, branch, batch, section, year } = req.query;
    const q = {};
    if (search) q.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { studentId: { $regex: search, $options: 'i' } }, { mobile: { $regex: search, $options: 'i' } }];
    if (gender) q.gender = gender;
    if (branch) q.branch = branch;
    if (batch) q.batch = batch;
    if (section) q.section = section;
    if (year) q.year = year;
    const totalCount = await Student.countDocuments(q);
    const data = await Student.find(q).sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    return res.status(200).json({ success: true, message: 'Students fetched', data: { data, totalCount, currentPage: Number(page), totalPages: Math.ceil(totalCount / Number(limit)) }, error: {} });
  } catch (err) { next(err); }
}

export async function getStudent(req, res, next) {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Student not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Student fetched', data: s, error: {} });
  } catch (err) { next(err); }
}

export async function updateStudent(req, res, next) {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ success: false, message: 'Student not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Student updated', data: s, error: {} });
  } catch (err) { next(err); }
}


// Attendance Sessions
import AttendanceSession from '../models/AttendanceSession.js';

export async function openAttendanceSession(req, res, next) {
  try {
    const { title, lat, lon, radiusMeters, openAt, closeAt, durationMinutes, batch, section, branch } = req.body;

    // Determine open and close times
    const openDate = openAt ? new Date(openAt) : new Date();
    if (isNaN(openDate)) {
      return res.status(400).json({ success: false, message: 'Invalid openAt', data: {}, error: {} });
    }

    let closeDate;
    if (typeof durationMinutes === 'number' && durationMinutes > 0) {
      closeDate = new Date(openDate.getTime() + durationMinutes * 60 * 1000);
    } else if (closeAt) {
      closeDate = new Date(closeAt);
    } else {
      return res.status(400).json({ success: false, message: 'Provide closeAt or durationMinutes', data: {}, error: {} });
    }

    if (isNaN(closeDate) || closeDate <= openDate) {
      return res.status(400).json({ success: false, message: 'Invalid time window', data: {}, error: {} });
    }
    const session = await AttendanceSession.create({
      teacher: req.user.id,
      title,
      center: { lat, lon },
      radiusMeters,
      openAt: openDate,
      closeAt: closeDate,
      batch,
      section,
      branch,
    });
    return res.status(201).json({ success: true, message: 'Attendance session opened', data: { id: session._id }, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function closeAttendanceSession(req, res, next) {
  try {
    const { id } = req.params;
    const session = await AttendanceSession.findOne({ _id: id, teacher: req.user.id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found', data: {}, error: {} });
    if (session.isClosed) return res.status(200).json({ success: true, message: 'Session already closed', data: {}, error: {} });
    session.isClosed = true;
    session.closeAt = new Date();
    await session.save();
    return res.status(200).json({ success: true, message: 'Session closed', data: {}, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function listAttendanceSessions(req, res, next) {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const q = { teacher: req.user.id };
    if (active === 'true') {
      q.isClosed = false;
      q.openAt = { $lte: new Date() };
      q.closeAt = { $gte: new Date() };
    }
    const totalCount = await AttendanceSession.countDocuments(q);
    const data = await AttendanceSession.find(q)
      .sort({ openAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    return res.status(200).json({ success: true, message: 'Sessions fetched', data: { data, totalCount }, error: {} });
  } catch (err) {
    next(err);
  }
}
