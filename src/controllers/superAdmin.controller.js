import Admin from '../models/Admin.js';
import { sendEmail, renderWelcomeTemplate } from '../utils/emailService.js';
import { generateId } from '../utils/id.js';

export async function createAdmin(req, res, next) {
  try {
    const { email } = req.body;
    const adminId = await generateId('AD');
    const defaultPassword = adminId;
    const adminPayload = {
      ...req.body,
      email: email?.toLowerCase(),
      adminId,
      password: defaultPassword,
    };
    const admin = await Admin.create(adminPayload);
    await sendEmail({ to: admin.email, subject: 'Welcome - Admin Account', html: renderWelcomeTemplate({ name: admin.name, registerId: admin.adminId }) });
    return res.status(201).json({ success: true, message: 'Admin created', data: { id: admin._id }, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function listAdmins(req, res, next) {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;
    const q = {};
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { adminId: { $regex: search, $options: 'i' } },
      ];
    }
    const totalCount = await Admin.countDocuments(q);
    const data = await Admin.find(q)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    return res.status(200).json({ success: true, message: 'Admins fetched', data: { data, totalCount, currentPage: Number(page), totalPages: Math.ceil(totalCount / Number(limit)) }, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function getAdminById(req, res, next) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Admin fetched', data: admin, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function updateAdmin(req, res, next) {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Admin updated', data: admin, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdmin(req, res, next) {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found', data: {}, error: {} });
    return res.status(200).json({ success: true, message: 'Admin deleted', data: {}, error: {} });
  } catch (err) {
    next(err);
  }
}


