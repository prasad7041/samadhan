/**
 * Authority input validators.
 */

/**
 * Validate email format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate authority signup fields.
 */
export function validateAuthoritySignup(body) {
  const errors = [];

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('Valid email address is required.');
  }

  if (!body.password || body.password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (!body.job_role || body.job_role.trim().length < 2) {
    errors.push('Job role is required.');
  }

  if (!body.sector || body.sector.trim().length < 2) {
    errors.push('Sector/Department is required.');
  }

  if (!body.area || body.area.trim().length < 2) {
    errors.push('Area is required.');
  }

  if (!body.pincode || !/^\d{6}$/.test(body.pincode)) {
    errors.push('Valid 6-digit pincode is required.');
  }

  if (!body.mobile || !/^[6-9]\d{9}$/.test(body.mobile)) {
    errors.push('Valid 10-digit mobile number is required.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate authority login fields.
 */
export function validateAuthorityLogin(body) {
  const errors = [];

  if (!body.email || !isValidEmail(body.email)) {
    errors.push('Valid email address is required.');
  }

  if (!body.password || body.password.length === 0) {
    errors.push('Password is required.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate authority profile update.
 */
export function validateAuthorityUpdate(body) {
  const errors = [];

  if (body.pincode !== undefined && !/^\d{6}$/.test(body.pincode)) {
    errors.push('Valid 6-digit pincode is required.');
  }

  if (body.mobile !== undefined && !/^[6-9]\d{9}$/.test(body.mobile)) {
    errors.push('Valid 10-digit mobile number is required.');
  }

  return { isValid: errors.length === 0, errors };
}
