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

export default router;


