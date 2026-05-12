import api from './axiosInstance';

// ═══════════════════════════════════════════════════════════════
//  CITIZEN AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Send OTP for citizen login.
 * @param {string} mobile - Mobile number
 */
export const citizenSendOtp = async (mobile) => {
  const response = await api.post('/auth/citizen/send-otp', { mobile });
  return response.data;
};

/**
 * Verify OTP and login citizen.
 * @param {string} mobile - Mobile number
 * @param {string} otp - 6-digit OTP code
 */
export const citizenVerifyOtp = async (mobile, otp) => {
  const response = await api.post('/auth/citizen/verify-otp', { mobile, otp });
  return response.data;
};

/**
 * Register a new citizen (step 1 — sends verification OTP).
 * @param {Object} data - { full_name, mobile, area, pincode, preferred_language }
 */
export const citizenSignup = async (data) => {
  const response = await api.post('/auth/citizen/signup', data);
  return response.data;
};

/**
 * Verify signup OTP and create citizen account (step 2).
 * Supports profile picture upload via FormData.
 * @param {FormData} formData - Must include: mobile, otp, full_name, area, pincode, preferred_language. Optional: profile_picture (file)
 */
export const citizenVerifySignup = async (formData) => {
  const response = await api.post('/auth/citizen/verify-signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get logged-in citizen's profile.
 */
export const getCitizenProfile = async () => {
  const response = await api.get('/auth/citizen/profile');
  return response.data;
};

/**
 * Update logged-in citizen's profile.
 * @param {FormData} formData - Fields to update. Optional: profile_picture (file)
 */
export const updateCitizenProfile = async (formData) => {
  const response = await api.put('/auth/citizen/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ═══════════════════════════════════════════════════════════════
//  AUTHORITY AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Register a new authority.
 * @param {FormData} formData - Must include: email, password, job_role, sector, area, pincode, mobile. Optional: profile_picture (file)
 */
export const authoritySignup = async (formData) => {
  const response = await api.post('/auth/authority/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Authority login with email and password.
 * @param {string} email
 * @param {string} password
 */
export const authorityLogin = async (email, password) => {
  const response = await api.post('/auth/authority/login', { email, password });
  return response.data;
};

/**
 * Get logged-in authority's profile.
 */
export const getAuthorityProfile = async () => {
  const response = await api.get('/auth/authority/profile');
  return response.data;
};

/**
 * Update logged-in authority's profile.
 * @param {FormData} formData - Fields to update. Optional: profile_picture (file)
 */
export const updateAuthorityProfile = async (formData) => {
  const response = await api.put('/auth/authority/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ═══════════════════════════════════════════════════════════════
//  ADMIN AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Admin login with admin_id and password.
 * @param {string} admin_id
 * @param {string} password
 */
export const adminLogin = async (admin_id, password) => {
  const response = await api.post('/auth/admin/login', { admin_id, password });
  return response.data;
};
