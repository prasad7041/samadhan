import { getDb } from '../config/database.js';

/**
 * Authority data access layer.
 */
const AuthorityModel = {
  /**
   * Find authority by email.
   */
  findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM authorities WHERE email = ?').get(email);
  },

  /**
   * Find authority by ID (excluding password hash).
   */
  findById(id) {
    const db = getDb();
    return db.prepare(
      'SELECT id, email, job_role, sector, area, pincode, mobile, profile_picture, village, mandal, district, latitude, longitude, active_status, workload_count, created_at, updated_at FROM authorities WHERE id = ?'
    ).get(id);
  },

  /**
   * Find authority by ID (including password hash for auth).
   */
  findByIdFull(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM authorities WHERE id = ?').get(id);
  },

  /**
   * Create a new authority.
   */
  create({ email, password_hash, job_role, sector, area, pincode, mobile, profile_picture = null, village = null, mandal = null, district = null, latitude = null, longitude = null }) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO authorities (email, password_hash, job_role, sector, area, pincode, mobile, profile_picture, village, mandal, district, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(email, password_hash, job_role, sector, area, pincode, mobile, profile_picture, village, mandal, district, latitude, longitude);
    return {
      id: result.lastInsertRowid,
      email, job_role, sector, area, pincode, mobile, profile_picture, village, mandal, district, latitude, longitude
    };
  },

  /**
   * Update authority profile.
   */
  update(id, fields) {
    const db = getDb();
    const allowedFields = ['job_role', 'sector', 'area', 'pincode', 'mobile', 'profile_picture', 'village', 'mandal', 'district', 'latitude', 'longitude', 'active_status'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fields[field]);
      }
    }

    if (updates.length === 0) return null;

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const sql = `UPDATE authorities SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return this.findById(id);
  },

  /**
   * Get all authorities (for admin).
   */
  getAll({ page = 1, limit = 20 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    const authorities = db.prepare(
      'SELECT id, email, job_role, sector, area, pincode, mobile, profile_picture, village, mandal, district, latitude, longitude, active_status, workload_count, created_at FROM authorities ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM authorities').get().count;

    return { authorities, total, page, limit };
  },

  /**
   * Find authorities by area and sector for complaint assignment.
   */
  findByAreaAndSector(area, sector) {
    const db = getDb();
    return db.prepare(
      'SELECT id, email, job_role, sector, area FROM authorities WHERE area = ? AND sector = ?'
    ).all(area, sector);
  },
};

export default AuthorityModel;
