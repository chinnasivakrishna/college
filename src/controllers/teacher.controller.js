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


