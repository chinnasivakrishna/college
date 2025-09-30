import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/config.js';

export const authRateLimiter = rateLimit({
  windowMs: appConfig.rateLimitWindowMs,
  max: appConfig.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, try again later', data: {}, error: {} },
});


