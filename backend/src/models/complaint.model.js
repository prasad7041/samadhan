import { getDb } from '../config/database.js';

/**
 * Complaint data access layer.
 */
const ComplaintModel = {
  /**
   * Create a new complaint.
   */
  create({ citizen_id, description, image_path = null, location, latitude = null, longitude = null, priority = 'Medium' }) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO complaints (citizen_id, description, image_path, location, latitude, longitude, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(citizen_id, description, image_path, location, latitude, longitude, priority);

    // Also insert initial status history
    db.prepare(`
      INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by_role, changed_by_id, remarks)
      VALUES (?, NULL, 'Pending', 'citizen', ?, 'Complaint created')
    `).run(result.lastInsertRowid, citizen_id);

    return this.findById(result.lastInsertRowid);
  },

  /**
   * Find complaint by ID (with citizen and authority names).
   */
  findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT
        c.*,
        ci.full_name as citizen_name,
        ci.mobile as citizen_mobile,
        a.email as authority_email,
        a.job_role as authority_role,
        a.sector as authority_sector
      FROM complaints c
      LEFT JOIN citizens ci ON c.citizen_id = ci.id
      LEFT JOIN authorities a ON c.assigned_authority_id = a.id
      WHERE c.id = ?
    `).get(id);
  },

  /**
   * Get complaints by citizen ID.
   */
  findByCitizenId(citizenId, { page = 1, limit = 20 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;

    const complaints = db.prepare(`
      SELECT c.*, a.email as authority_email, a.job_role as authority_role
      FROM complaints c
      LEFT JOIN authorities a ON c.assigned_authority_id = a.id
      WHERE c.citizen_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(citizenId, limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM complaints WHERE citizen_id = ?').get(citizenId).count;

    return { complaints, total, page, limit };
  },

  /**
   * Get complaints assigned to an authority.
   */
  findByAuthorityId(authorityId, { page = 1, limit = 20 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;

    const complaints = db.prepare(`
      SELECT c.*, ci.full_name as citizen_name, ci.mobile as citizen_mobile
      FROM complaints c
      LEFT JOIN citizens ci ON c.citizen_id = ci.id
      WHERE c.assigned_authority_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(authorityId, limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM complaints WHERE assigned_authority_id = ?').get(authorityId).count;

    return { complaints, total, page, limit };
  },

  /**
   * Get all complaints with filters.
   */
  findAll({ status, priority, page = 1, limit = 20 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    let where = [];
    let params = [];

    if (status) {
      where.push('c.status = ?');
      params.push(status);
    }
    if (priority) {
      where.push('c.priority = ?');
      params.push(priority);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const complaints = db.prepare(`
      SELECT
        c.*,
        ci.full_name as citizen_name,
        a.email as authority_email,
        a.job_role as authority_role
      FROM complaints c
      LEFT JOIN citizens ci ON c.citizen_id = ci.id
      LEFT JOIN authorities a ON c.assigned_authority_id = a.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    const total = db.prepare(`SELECT COUNT(*) as count FROM complaints c ${whereClause}`).all(...params)[0].count;

    return { complaints, total, page, limit };
  },

  /**
   * Update complaint status and record in history.
   */
  updateStatus(id, { status, changed_by_role, changed_by_id, remarks = null }) {
    const db = getDb();

    const current = db.prepare('SELECT status FROM complaints WHERE id = ?').get(id);
    if (!current) return null;

    // Update complaint
    db.prepare(`
      UPDATE complaints SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, id);

    // Record in history
    db.prepare(`
      INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by_role, changed_by_id, remarks)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, current.status, status, changed_by_role, changed_by_id, remarks);

    return this.findById(id);
  },

  /**
   * Assign an authority to a complaint.
   */
  assignAuthority(complaintId, authorityId) {
    const db = getDb();
    db.prepare(`
      UPDATE complaints SET assigned_authority_id = ?, updated_at = datetime('now') WHERE id = ?
    `).run(authorityId, complaintId);

    return this.findById(complaintId);
  },

  /**
   * Find complaints near a location (simple distance-based).
   * Uses a bounding box approach since SQLite doesn't have geo functions.
   */
  findNearby({ latitude, longitude, radiusKm = 5, page = 1, limit = 20 }) {
    const db = getDb();
    const offset = (page - 1) * limit;

    // Rough degree approximation: 1 degree ≈ 111km
    const delta = radiusKm / 111;
    const minLat = parseFloat(latitude) - delta;
    const maxLat = parseFloat(latitude) + delta;
    const minLng = parseFloat(longitude) - delta;
    const maxLng = parseFloat(longitude) + delta;

    const complaints = db.prepare(`
      SELECT c.*, ci.full_name as citizen_name
      FROM complaints c
      LEFT JOIN citizens ci ON c.citizen_id = ci.id
      WHERE CAST(c.latitude AS REAL) BETWEEN ? AND ?
        AND CAST(c.longitude AS REAL) BETWEEN ? AND ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(minLat, maxLat, minLng, maxLng, limit, offset);

    return { complaints, page, limit };
  },

  /**
   * Get status history for a complaint.
   */
  getStatusHistory(complaintId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM complaint_status_history
      WHERE complaint_id = ?
      ORDER BY created_at ASC
    `).all(complaintId);
  },
};

export default ComplaintModel;
