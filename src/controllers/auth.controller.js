import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { appConfig } from '../config/config.js';
import SuperAdmin from '../models/SuperAdmin.js';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { Roles, ResetTokenExpiryMs } from '../utils/constants.js';
import { sendEmail, renderPasswordResetTemplate, renderPasswordChangedTemplate } from '../utils/emailService.js';

function signToken(user, role) {
  return jwt.sign({ id: user._id, role, registerId: (user.registerId || user.adminId || user.teacherId || user.studentId) }, appConfig.jwtSecret, {
    expiresIn: appConfig.jwtExpire,
  });
}

function getModelByType(userType) {
  switch (userType) {
    case Roles.SUPER_ADMIN:
      return SuperAdmin;
    case Roles.ADMIN:
      return Admin;
    case Roles.TEACHER:
      return Teacher;
    case Roles.STUDENT:
      return Student;
    default:
      return null;
  }
}

export async function login(req, res, next) {
  try {
    const { registerId, password, userType } = req.body;
    const type = userType.toLowerCase();
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ success: false, message: 'Invalid userType', data: {}, error: {} });

    const idField = type === Roles.SUPER_ADMIN ? 'registerId' : type === Roles.ADMIN ? 'adminId' : type === Roles.TEACHER ? 'teacherId' : 'studentId';
    const user = await Model.findOne({ [idField]: registerId.toUpperCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials', data: {}, error: {} });

    // Extra rule: Admin expiry
    if (type === Roles.ADMIN && user.expiry && new Date(user.expiry) < new Date()) {
      return res.status(403).json({ success: false, message: 'Admin account expired', data: {}, error: {} });
    }

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials', data: {}, error: {} });

    const token = signToken(user, type);
    const userInfo = { id: user._id, name: user.name, role: type, registerId: user.registerId || user[idField] };
    return res.status(200).json({ success: true, message: 'Logged in', data: { token, user: userInfo }, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email, userType } = req.body;
    if (userType === Roles.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: 'Super Admin cannot use forgot password', data: {}, error: {} });
    }
    const Model = getModelByType(userType);
    const user = await Model.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found', data: {}, error: {} });

    // generate token (unhashed for email)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = new Date(Date.now() + ResetTokenExpiryMs);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: renderPasswordResetTemplate({ name: user.name, resetLink }),
    });
    return res.status(200).json({ success: true, message: 'Reset email sent', data: {}, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Check all 3 models
    const models = [Admin, Teacher, Student];
    let user = null;
    for (const M of models) {
      user = await M.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: new Date() } });
      if (user) break;
    }
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token', data: {}, error: {} });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.isFirstLogin = false;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Password Changed',
      html: renderPasswordChangedTemplate({ name: user.name }),
    });
    return res.status(200).json({ success: true, message: 'Password reset successful', data: {}, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const { role, id } = req.user || {};
    const Model = getModelByType(role);
    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {}, error: {} });
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(401).json({ success: false, message: 'Current password incorrect', data: {}, error: {} });
    if (await user.comparePassword(newPassword)) {
      return res.status(400).json({ success: false, message: 'New password must differ from old', data: {}, error: {} });
    }
    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password changed', data: {}, error: {} });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  return res.status(200).json({ success: true, message: 'Logged out', data: {}, error: {} });
}


