import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, onlyTeacher } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import * as teacherCtl from '../controllers/teacher.controller.js';

const router = Router();
router.use(authenticate, onlyTeacher);

router.post('/students', [body('name').notEmpty(), body('email').isEmail(), body('rollNumber').notEmpty()], validate, teacherCtl.createStudent);
router.get('/students', [query('page').optional().isInt({ min: 1 })], validate, teacherCtl.listStudents);
router.get('/students/:id', [param('id').isMongoId()], validate, teacherCtl.getStudent);
router.put('/students/:id', [param('id').isMongoId()], validate, teacherCtl.updateStudent);

// Attendance sessions
router.post(
  '/attendance/sessions',
  [
    body('title').notEmpty(),
    body('lat').isFloat({ min: -90, max: 90 }),
    body('lon').isFloat({ min: -180, max: 180 }),
    body('radiusMeters').isInt({ min: 1 }),
    body('openAt').optional(),
    body('closeAt').optional(),
    body('durationMinutes').optional().isInt({ min: 1, max: 240 }),
    body('batch').optional().isString(),
    body('section').optional().isString(),
    body('branch').optional().isMongoId(),
  ],
  validate,
  teacherCtl.openAttendanceSession
);

router.post('/attendance/sessions/:id/close', [param('id').isMongoId()], validate, teacherCtl.closeAttendanceSession);

router.get('/attendance/sessions', [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 }), query('active').optional().isIn(['true', 'false'])], validate, teacherCtl.listAttendanceSessions);

export default router;


