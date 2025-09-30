## School Management System - Backend API

### Setup
1. Copy `.env.example` to `.env` and fill values
2. Install deps: `npm install`
3. Seed Super Admin: `npm run seed` (creates SA001 / SA001)
4. Run dev server: `npm run dev`

### Base URL
`http://localhost:5000`

### Auth
- POST `/api/auth/login` body: `{ "registerId", "password", "userType": "superadmin|admin|teacher|student" }`
- POST `/api/auth/forgot-password` body: `{ "email", "userType": "admin|teacher|student" }`
- PUT `/api/auth/reset-password/:resetToken` body: `{ "password", "confirmPassword" }`
- PUT `/api/auth/change-password` Auth Bearer token, body: `{ "currentPassword", "newPassword", "confirmPassword" }`
- POST `/api/auth/logout`

### Super Admin (Bearer token of superadmin)
- POST `/api/super-admin/admins` body: `{ name, email, expiry?, position?, salary?, dateOfJoining? }`
- GET `/api/super-admin/admins?search=&page=1&limit=10&sortBy=createdAt&sortOrder=desc`
- GET `/api/super-admin/admins/:id`
- PUT `/api/super-admin/admins/:id`
- DELETE `/api/super-admin/admins/:id`

### Admin (Bearer token of admin; auto-blocked if expired)
Teachers
- POST `/api/admin/teachers` body: `{ name, email }` (teacherId auto; default password = teacherId)
- GET `/api/admin/teachers?search=&gender=&branch=&page=&limit=&sortBy=&sortOrder=`
- GET `/api/admin/teachers/:id`
- PUT `/api/admin/teachers/:id`
- DELETE `/api/admin/teachers/:id`

Students
- POST `/api/admin/students` body: `{ name, email, rollNumber }` (studentId auto; default password = rollNumber)
- GET `/api/admin/students?search=&gender=&branch=&batch=&section=&year=&page=&limit=&sortBy=&sortOrder=`
- GET `/api/admin/students/:id`
- PUT `/api/admin/students/:id`
- DELETE `/api/admin/students/:id`

### Teacher (Bearer token of teacher)
- POST `/api/teacher/students` body: `{ name, email, rollNumber }` (studentId auto)
- GET `/api/teacher/students?search=&gender=&branch=&batch=&section=&year=&page=&limit=&sortBy=&sortOrder=`
- GET `/api/teacher/students/:id`
- PUT `/api/teacher/students/:id`

### Student (Bearer token of student)
- GET `/api/student/profile`
- PUT `/api/student/profile`

### Notes
- Login uses registerId: SA001, ADxxx, TCHxxx, STUxxx
- Rate limit on `/api/auth/*` (5 per 15m)
- Reset tokens expire in 1 hour


