import bcrypt from 'bcryptjs';
import AdminModel from '../models/admin.model.js';
import { signToken } from '../utils/jwtHelper.js';
import { success, error } from '../utils/responseHelper.js';

/**
 * Admin Authentication Controller.
 */

/**
 * POST /api/auth/admin/login
 * Admin login with admin_id and password.
 */
export async function login(req, res, next) {
  try {
    const { admin_id, password } = req.body;

    // Find admin
    const admin = AdminModel.findByAdminId(admin_id);
    if (!admin) {
      return error(res, 'Invalid admin ID or password.', 401);
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid admin ID or password.', 401);
    }

    // Generate JWT
    const token = signToken({ id: admin.id, role: 'admin' });

    return success(res, {
      token,
      user: {
        id: admin.id,
        admin_id: admin.admin_id,
      },
    }, 'Admin login successful.');
  } catch (err) {
    next(err);
  }
}
