/**
 * Citizen input validators.
 */

/**
 * Validate mobile number (10-digit Indian format).
 */
function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Validate citizen signup fields.
 */
export function validateCitizenSignup(body) {
  const errors = [];

  if (!body.full_name || body.full_name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  if (!body.mobile || !isValidMobile(body.mobile)) {
    errors.push('Valid 10-digit Indian mobile number is required.');
  }

  if (!body.area || body.area.trim().length < 2) {
    errors.push('Area is required.');
  }

  if (!body.pincode || !/^\d{6}$/.test(body.pincode)) {
    errors.push('Valid 6-digit pincode is required.');
  }

  const validLanguages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Marathi'];
  if (body.preferred_language && !validLanguages.includes(body.preferred_language)) {
    errors.push(`Preferred language must be one of: ${validLanguages.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate send OTP request.
 */
export function validateSendOtp(body) {
  const errors = [];

  if (!body.mobile || !isValidMobile(body.mobile)) {
    errors.push('Valid 10-digit Indian mobile number is required.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate verify OTP request.
 */
export function validateVerifyOtp(body) {
  const errors = [];

  if (!body.mobile || !isValidMobile(body.mobile)) {
    errors.push('Valid 10-digit Indian mobile number is required.');
  }

  if (!body.otp || !/^\d{6}$/.test(body.otp)) {
    errors.push('Valid 6-digit OTP is required.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate citizen profile update.
 */
export function validateCitizenUpdate(body) {
  const errors = [];

  if (body.full_name !== undefined && body.full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  if (body.pincode !== undefined && !/^\d{6}$/.test(body.pincode)) {
    errors.push('Valid 6-digit pincode is required.');
  }

  const validLanguages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Marathi'];
  if (body.preferred_language && !validLanguages.includes(body.preferred_language)) {
    errors.push(`Preferred language must be one of: ${validLanguages.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
}
