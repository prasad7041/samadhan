/**
 * Global error handler middleware.
 * Must be registered last with app.use(errorHandler).
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.',
    });
  }

  // Multer file type error
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
    });
  }

  // SQLite constraint errors
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
    });
  }

  // Default server error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
}
