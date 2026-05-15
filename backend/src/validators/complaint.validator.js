/**
 * Complaint input validators.
 */

/**
 * Validate complaint creation.
 */
export function validateCreateComplaint(body) {
  const errors = [];

  if (!body.title || body.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters.');
  }

  if (!body.sector || body.sector.trim().length < 2) {
    errors.push('Complaint sector/category is required.');
  }

  if (!body.description || body.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }

  if (!body.location || body.location.trim().length < 2) {
    errors.push('Location is required.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate complaint status update.
 */
export function validateStatusUpdate(body) {
  const errors = [];

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!body.status || !validStatuses.includes(body.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate complaint assignment.
 */
export function validateAssignment(body) {
  const errors = [];

  if (!body.authority_id || isNaN(parseInt(body.authority_id))) {
    errors.push('Valid authority ID is required.');
  }

  return { isValid: errors.length === 0, errors };
}
