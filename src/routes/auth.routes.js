import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.js';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/login',
  [
    body('registerId').trim().notEmpty().withMessage('registerId is required'),
    body('password').notEmpty().withMessage('password is required'),
    body('userType').isIn(['superadmin', 'admin', 'teacher', 'student']).withMessage('Invalid userType'),
  ],
  validate,
  authController.login
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('userType').isIn(['admin', 'teacher', 'student']).withMessage('Invalid userType'),
  ],
  validate,
  authController.forgotPassword
);

router.put(
  '/reset-password/:resetToken',
  [
    body('password').isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 0 }),
    body('confirmPassword').custom((v, { req }) => v === req.body.password).withMessage('Passwords do not match'),
  ],
  validate,
  authController.resetPassword
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 0 }),
    body('confirmPassword').custom((v, { req }) => v === req.body.newPassword).withMessage('Passwords do not match'),
  ],
  validate,
  authenticate,
  authController.changePassword
);

router.post('/logout', authController.logout);

export default router;


