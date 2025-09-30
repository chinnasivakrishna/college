// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status = err.status || err.code || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500 ? 'Internal Server Error' : err.message || 'Error';
  const error = process.env.NODE_ENV === 'production' && status === 500 ? {} : { stack: err.stack, ...(err.details ? { details: err.details } : {}) };
  res.status(status).json({ success: false, message, data: {}, error });
}


