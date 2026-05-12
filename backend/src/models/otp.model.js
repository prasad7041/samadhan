import { getDb } from '../config/database.js';

/**
 * OTP records data access layer.
 */
const OtpModel = {
  /**
   * Create a new OTP record.
   */
  create({ mobile, otp_code, purpose, expires_at }) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO otp_records (mobile, otp_code, purpose, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(mobile, otp_code, purpose, expires_at);
    return { id: result.lastInsertRowid, mobile, otp_code, purpose, expires_at };
  },

  /**
   * Find the latest unverified OTP for a mobile number.
   */
  findLatestByMobile(mobile, purpose) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM otp_records
      WHERE mobile = ? AND purpose = ? AND is_verified = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).get(mobile, purpose);
  },

  /**
   * Mark an OTP as verified.
   */
  markVerified(id) {
    const db = getDb();
    db.prepare('UPDATE otp_records SET is_verified = 1 WHERE id = ?').run(id);
  },

  /**
   * Delete expired OTP records (cleanup).
   */
  deleteExpired() {
    const db = getDb();
    db.prepare("DELETE FROM otp_records WHERE expires_at < datetime('now')").run();
  },
};

export default OtpModel;
