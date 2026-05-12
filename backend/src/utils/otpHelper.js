import env from '../config/env.js';

/**
 * Generate a random 6-digit OTP.
 * @returns {string} 6-digit OTP code
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry timestamp.
 * @returns {string} ISO datetime string for expiry
 */
export function getOtpExpiry() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + env.OTP_EXPIRY_MINUTES);
  return now.toISOString();
}

/**
 * Check if an OTP has expired.
 * @param {string} expiresAt - ISO datetime string
 * @returns {boolean}
 */
export function isOtpExpired(expiresAt) {
  return new Date() > new Date(expiresAt);
}

/**
 * Simulate sending OTP via SMS.
 * In production, replace this with an actual SMS gateway (Twilio, etc.)
 * @param {string} mobile
 * @param {string} otp
 */
export function sendOtpSms(mobile, otp) {
  console.log('═══════════════════════════════════════');
  console.log(`📱 OTP for ${mobile}: ${otp}`);
  console.log(`⏰ Expires in ${env.OTP_EXPIRY_MINUTES} minutes`);
  console.log('═══════════════════════════════════════');
}
