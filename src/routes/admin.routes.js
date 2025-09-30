import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, onlyAdmin, ensureAdminNotExpired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import * as adminCtl from '../controllers/admin.controller.js';

const router = Router();
router.use(authenticate, onlyAdmin, ensureAdminNotExpired);

// Teachers
router.post('/teachers', [body('name').notEmpty(), body('email').isEmail()], validate, adminCtl.createTeacher);
router.get('/teachers', [query('page').optional().isInt({ min: 1 })], validate, adminCtl.listTeachers);
router.get('/teachers/:id', [param('id').isMongoId()], validate, adminCtl.getTeacher);
router.put('/teachers/:id', [param('id').isMongoId()], validate, adminCtl.updateTeacher);
router.delete('/teachers/:id', [param('id').isMongoId()], validate, adminCtl.deleteTeacher);

// Students
router.post('/students', [body('name').notEmpty(), body('email').isEmail(), body('rollNumber').notEmpty()], validate, adminCtl.createStudent);
router.get('/students', [query('page').optional().isInt({ min: 1 })], validate, adminCtl.listStudents);
router.get('/students/:id', [param('id').isMongoId()], validate, adminCtl.getStudent);
router.put('/students/:id', [param('id').isMongoId()], validate, adminCtl.updateStudent);
router.delete('/students/:id', [param('id').isMongoId()], validate, adminCtl.deleteStudent);

export default router;


