import api from './axiosInstance';

// ═══════════════════════════════════════════════════════════════
//  ADMIN API SERVICES
// ═══════════════════════════════════════════════════════════════

/**
 * Get dashboard statistics.
 */
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

/**
 * Get all citizens (paginated).
 * @param {number} page
 * @param {number} limit
 */
export const getAllCitizens = async (page = 1, limit = 20) => {
  const response = await api.get('/admin/users/citizens', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get all authorities (paginated).
 * @param {number} page
 * @param {number} limit
 */
export const getAllAuthorities = async (page = 1, limit = 20) => {
  const response = await api.get('/admin/users/authorities', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Delete a user by role and ID.
 * @param {string} role - 'citizen' or 'authority'
 * @param {number} id - User ID
 */
export const deleteUser = async (role, id) => {
  const response = await api.delete(`/admin/users/${role}/${id}`);
  return response.data;
};

/**
 * Get audit logs (complaint status change history).
 * @param {number} page
 * @param {number} limit
 */
export const getAuditLogs = async (page = 1, limit = 50) => {
  const response = await api.get('/admin/audit-logs', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get department oversight data.
 */
export const getDepartments = async () => {
  const response = await api.get('/admin/departments');
  return response.data;
};
