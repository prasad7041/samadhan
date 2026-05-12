import api from './axiosInstance';

// ═══════════════════════════════════════════════════════════════
//  COMPLAINT API SERVICES
// ═══════════════════════════════════════════════════════════════

/**
 * Create a new complaint (citizen only).
 * @param {FormData} formData - Must include: description, location. Optional: image (file), latitude, longitude, priority
 */
export const createComplaint = async (formData) => {
  const response = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get complaints raised by the logged-in citizen.
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 */
export const getMyReports = async (page = 1, limit = 20) => {
  const response = await api.get('/complaints/my-reports', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get complaints assigned to the logged-in authority.
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 */
export const getAssignedComplaints = async (page = 1, limit = 20) => {
  const response = await api.get('/complaints/assigned', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get complaints near a location.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius - Radius in km (default: 5)
 * @param {number} page
 * @param {number} limit
 */
export const getNearbyComplaints = async (latitude, longitude, radius = 5, page = 1, limit = 20) => {
  const response = await api.get('/complaints/nearby', {
    params: { latitude, longitude, radius, page, limit },
  });
  return response.data;
};

/**
 * Get all complaints with optional filters (authority/admin).
 * @param {Object} filters - { status, priority, page, limit }
 */
export const getAllComplaints = async (filters = {}) => {
  const response = await api.get('/complaints', {
    params: {
      status: filters.status,
      priority: filters.priority,
      page: filters.page || 1,
      limit: filters.limit || 20,
    },
  });
  return response.data;
};

/**
 * Get a single complaint by ID.
 * @param {number} id - Complaint ID
 */
export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

/**
 * Update complaint status (authority/admin).
 * @param {number} id - Complaint ID
 * @param {string} status - New status
 * @param {string} remarks - Optional remarks
 */
export const updateComplaintStatus = async (id, status, remarks = '') => {
  const response = await api.put(`/complaints/${id}/status`, { status, remarks });
  return response.data;
};

/**
 * Assign an authority to a complaint (admin only).
 * @param {number} id - Complaint ID
 * @param {number} authority_id - Authority user ID
 */
export const assignAuthority = async (id, authority_id) => {
  const response = await api.put(`/complaints/${id}/assign`, { authority_id });
  return response.data;
};
