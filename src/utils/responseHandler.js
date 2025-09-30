export function successResponse(res, message, data = {}, status = 200) {
  return res.status(status).json({ success: true, message, data, error: {} });
}

export function errorResponse(res, message, error = {}, status = 500) {
  return res.status(status).json({ success: false, message, data: {}, error });
}


