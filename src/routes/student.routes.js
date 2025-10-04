import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, onlyStudent } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import * as studentCtl from '../controllers/student.controller.js';

const router = Router();
router.use(authenticate, onlyStudent);

router.get('/profile', studentCtl.getProfile);
router.put('/profile', [body('email').optional().isEmail()], validate, studentCtl.updateProfile);

// Attendance
router.post('/attendance/daily', [body('lat').isFloat({ min: -90, max: 90 }), body('lon').isFloat({ min: -180, max: 180 })], validate, studentCtl.markDailyAttendance);
router.post('/attendance/session/:sessionId', [body('lat').isFloat({ min: -90, max: 90 }), body('lon').isFloat({ min: -180, max: 180 })], validate, studentCtl.markSessionAttendance);

export default router;


