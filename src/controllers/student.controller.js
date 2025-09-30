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


