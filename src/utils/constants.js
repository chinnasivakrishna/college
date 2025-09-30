export const Roles = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

export const Genders = ['Male', 'Female', 'Other'];

export const StudentYears = ['1st', '2nd', '3rd', '4th'];

export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const ResetTokenExpiryMs = 60 * 60 * 1000; // 1 hour


