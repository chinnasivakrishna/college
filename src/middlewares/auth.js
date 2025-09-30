import jwt from 'jsonwebtoken';
import { appConfig } from '../config/config.js';
import { Roles } from '../utils/constants.js';
import Admin from '../models/Admin.js';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated', data: {}, error: {} });
    const payload = jwt.verify(token, appConfig.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', data: {}, error: {} });
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated', data: {}, error: {} });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden', data: {}, error: {} });
    }
    next();
  };
}

export const onlySuperAdmin = authorize(Roles.SUPER_ADMIN);
export const onlyAdmin = authorize(Roles.ADMIN);
export const onlyTeacher = authorize(Roles.TEACHER);
export const onlyStudent = authorize(Roles.STUDENT);

// Admin expiry check
export function ensureAdminNotExpired(req, res, next) {
  if (req.user?.role !== Roles.ADMIN) return next();
  Admin.findById(req.user.id)
    .then((admin) => {
      if (!admin) return res.status(401).json({ success: false, message: 'Admin not found', data: {}, error: {} });
      if (admin.expiry && new Date(admin.expiry) < new Date()) {
        return res.status(403).json({ success: false, message: 'Admin account expired', data: {}, error: {} });
      }
      return next();
    })
    .catch(() => res.status(500).json({ success: false, message: 'Server error', data: {}, error: {} }));
}


