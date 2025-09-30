export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM || 'noreply@schoolmanagement.com',
};


