import bcrypt from 'bcryptjs';
import AuthorityModel from '../models/authority.model.js';
import { signToken } from '../utils/jwtHelper.js';
import { success, error } from '../utils/responseHelper.js';
import env from '../config/env.js';

/**
 * Authority Authentication Controller.
 */

/**
 * POST /api/auth/authority/signup
 * Register a new authority.
 */
export async function signup(req, res, next) {
  try {
    const { email, password, job_role, sector, area, pincode, mobile } = req.body;

    // Check if authority already exists
    const existing = AuthorityModel.findByEmail(email);
    if (existing) {
      return error(res, 'An account with this email already exists.', 409);
    }

    // Hash password
    const password_hash = bcrypt.hashSync(password, env.BCRYPT_SALT_ROUNDS);

    // Get profile picture path if uploaded
    const profile_picture = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    // Create authority
    const authority = AuthorityModel.create({
      email,
      password_hash,
      job_role,
      sector,
      area,
      pincode,
      mobile,
      profile_picture,
    });

    // Generate JWT
    const token = signToken({ id: authority.id, role: 'authority' });

    return success(res, {
      token,
      user: authority,
    }, 'Authority account created successfully.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/authority/login
 * Login with email and password.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find authority
    const authority = AuthorityModel.findByEmail(email);
    if (!authority) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, authority.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Generate JWT
    const token = signToken({ id: authority.id, role: 'authority' });

    return success(res, {
      token,
      user: {
        id: authority.id,
        email: authority.email,
        job_role: authority.job_role,
        sector: authority.sector,
        area: authority.area,
        pincode: authority.pincode,
        mobile: authority.mobile,
        profile_picture: authority.profile_picture,
      },
    }, 'Login successful.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/authority/profile
 * Get logged-in authority's profile.
 */
export async function getProfile(req, res, next) {
  try {
    const authority = AuthorityModel.findById(req.user.id);

    if (!authority) {
      return error(res, 'Authority not found.', 404);
    }

    return success(res, { user: authority }, 'Profile fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/authority/profile
 * Update logged-in authority's profile.
 */
export async function updateProfile(req, res, next) {
  try {
    const fields = { ...req.body };

    // Handle profile picture upload
    if (req.file) {
      fields.profile_picture = `/uploads/profiles/${req.file.filename}`;
    }

    const updated = AuthorityModel.update(req.user.id, fields);

    if (!updated) {
      return error(res, 'No fields to update.', 400);
    }

    return success(res, { user: updated }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
}
