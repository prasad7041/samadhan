import { verifyToken } from '../utils/jwtHelper.js';
import { error } from '../utils/responseHelper.js';

/**
 * Middleware to authenticate JWT token from Authorization header.
 * Sets req.user = { id, role } on success.
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired. Please login again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token.', 401);
    }
    return error(res, 'Authentication failed.', 401);
  }
}

/**
 * Middleware to authorize specific roles.
 * Must be used after authenticate middleware.
 * @param  {...string} roles - Allowed roles ('citizen', 'authority', 'admin')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'You do not have permission to access this resource.', 403);
    }

    next();
  };
}
