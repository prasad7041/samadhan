import { getDb } from '../config/database.js';

/**
 * Citizen data access layer.
 */
const CitizenModel = {
  /**
   * Find citizen by mobile number.
   */
  findByMobile(mobile) {
    const db = getDb();
    return db.prepare('SELECT * FROM citizens WHERE mobile = ?').get(mobile);
  },

  /**
   * Find citizen by ID.
   */
  findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, full_name, mobile, area, pincode, preferred_language, profile_picture, created_at, updated_at FROM citizens WHERE id = ?').get(id);
  },

  /**
   * Create a new citizen.
   */
  create({ full_name, mobile, area, pincode, preferred_language = 'English', profile_picture = null }) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO citizens (full_name, mobile, area, pincode, preferred_language, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(full_name, mobile, area, pincode, preferred_language, profile_picture);
    return { id: result.lastInsertRowid, full_name, mobile, area, pincode, preferred_language, profile_picture };
  },

  /**
   * Update citizen profile.
   */
  update(id, fields) {
    const db = getDb();
    const allowedFields = ['full_name', 'area', 'pincode', 'preferred_language', 'profile_picture'];
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

    const sql = `UPDATE citizens SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return this.findById(id);
  },

  /**
   * Get all citizens (for admin).
   */
  getAll({ page = 1, limit = 20 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    const citizens = db.prepare(
      'SELECT id, full_name, mobile, area, pincode, preferred_language, profile_picture, created_at FROM citizens ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM citizens').get().count;

    return { citizens, total, page, limit };
  },
};

export default CitizenModel;
