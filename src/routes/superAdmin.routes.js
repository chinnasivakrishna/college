import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validation.js';
import { authenticate, onlySuperAdmin } from '../middlewares/auth.js';
import * as sa from '../controllers/superAdmin.controller.js';

const router = Router();

router.use(authenticate, onlySuperAdmin);

router.post(
  '/admins',
  [body('name').notEmpty(), body('email').isEmail()],
  validate,
  sa.createAdmin
);

router.get('/admins', [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })], validate, sa.listAdmins);

router.get('/admins/:id', [param('id').isMongoId()], validate, sa.getAdminById);

router.put('/admins/:id', [param('id').isMongoId()], validate, sa.updateAdmin);

router.delete('/admins/:id', [param('id').isMongoId()], validate, sa.deleteAdmin);

// Attendance Config
router.put(
  '/attendance/config',
  [
    body('lat').isFloat({ min: -90, max: 90 }),
    body('lon').isFloat({ min: -180, max: 180 }),
    body('radiusMeters').isInt({ min: 1 }),
    body('windowStartMinutes').optional().isInt({ min: 0, max: 24 * 60 - 1 }),
    body('windowEndMinutes').optional().isInt({ min: 0, max: 24 * 60 - 1 }),
    body('isEnabled').optional().isBoolean(),
  ],
  validate,
  sa.upsertAttendanceConfig
);

router.get('/attendance/config', sa.getAttendanceConfig);

export default router;


