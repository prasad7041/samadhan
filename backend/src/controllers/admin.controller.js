import AdminModel from '../models/admin.model.js';
import CitizenModel from '../models/citizen.model.js';
import AuthorityModel from '../models/authority.model.js';
import { success, error } from '../utils/responseHelper.js';

/**
 * Admin Controller.
 */

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics.
 */
export async function getDashboardStats(req, res, next) {
  try {
    const stats = AdminModel.getDashboardStats();
    return success(res, stats, 'Dashboard statistics fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users/citizens
 * List all citizens.
 */
export async function getAllCitizens(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = CitizenModel.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    return success(res, result, 'Citizens fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users/authorities
 * List all authorities.
 */
export async function getAllAuthorities(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = AuthorityModel.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    return success(res, result, 'Authorities fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/users/:role/:id
 * Delete a user by role and ID.
 */
export async function deleteUser(req, res, next) {
  try {
    const { role, id } = req.params;

    if (!['citizen', 'authority'].includes(role)) {
      return error(res, 'Invalid role. Must be "citizen" or "authority".', 400);
    }

    const deleted = AdminModel.deleteUser(role, parseInt(id));

    if (!deleted) {
      return error(res, 'User not found.', 404);
    }

    return success(res, null, `${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully.`);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/audit-logs
 * Get complaint status change history (audit trail).
 */
export async function getAuditLogs(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = AdminModel.getAuditLogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
    });
    return success(res, result, 'Audit logs fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/departments
 * Get department oversight data.
 */
export async function getDepartments(req, res, next) {
  try {
    const departments = AdminModel.getDepartments();
    return success(res, { departments }, 'Department data fetched successfully.');
  } catch (err) {
    next(err);
  }
}
