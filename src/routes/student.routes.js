import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, onlyStudent } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import * as studentCtl from '../controllers/student.controller.js';

const router = Router();
router.use(authenticate, onlyStudent);

router.get('/profile', studentCtl.getProfile);
router.put('/profile', [body('email').optional().isEmail()], validate, studentCtl.updateProfile);

export default router;


