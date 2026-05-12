/**
 * Admin input validators.
 */

/**
 * Validate admin login fields.
 */
export function validateAdminLogin(body) {
  const errors = [];

  if (!body.admin_id || body.admin_id.trim().length === 0) {
    errors.push('Admin ID is required.');
  }

  if (!body.password || body.password.length === 0) {
    errors.push('Password is required.');
  }

  return { isValid: errors.length === 0, errors };
}
