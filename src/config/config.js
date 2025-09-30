export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5),
};


