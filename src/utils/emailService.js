import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.js';

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: { user: emailConfig.user, pass: emailConfig.pass },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const tx = getTransporter();
  await tx.sendMail({ from: emailConfig.from, to, subject, html });
}

export function renderPasswordResetTemplate({ name, resetLink }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to proceed. This link is valid for 1 hour.</p>
      <p><a href="${resetLink}" style="display:inline-block;background:#0d6efd;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email. Do not share this link.</p>
      <p>Regards,<br/>School Management Team</p>
    </div>
  `;
}

export function renderWelcomeTemplate({ name, registerId }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
      <h2>Welcome to School Management</h2>
      <p>Hi ${name},</p>
      <p>Your account has been created. Your register ID is <strong>${registerId}</strong>.</p>
      <p>Please log in and change your password on first login.</p>
    </div>
  `;
}

export function renderPasswordChangedTemplate({ name }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
      <h2>Password Changed</h2>
      <p>Hi ${name},</p>
      <p>This is a confirmation that your password has been changed successfully.</p>
      <p>If you did not perform this action, contact support immediately.</p>
    </div>
  `;
}


