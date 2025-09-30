function recursiveSanitize(value) {
  if (Array.isArray(value)) {
    return value.map((v) => recursiveSanitize(v));
  }
  if (value && typeof value === 'object') {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      // Drop keys starting with $ or containing a dot to prevent MongoDB operator injection
      if (key.startsWith('$') || key.includes('.')) continue;
      cleaned[key] = recursiveSanitize(val);
    }
    return cleaned;
  }
  if (typeof value === 'string') {
    // Basic string sanitize: remove angle brackets to reduce XSS vectors
    return value.replace(/[<>]/g, '');
  }
  return value;
}

export default function sanitizeRequest(req, res, next) {
  // Only sanitize body and params to avoid Express 5 immutable req.query
  if (req.body && typeof req.body === 'object') {
    req.body = recursiveSanitize(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = recursiveSanitize(req.params);
  }
  // Intentionally skip req.query to avoid setting immutable getter
  next();
}


