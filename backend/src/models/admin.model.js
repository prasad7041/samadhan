import { getDb } from '../config/database.js';

/**
 * Admin data access layer.
 */
const AdminModel = {
  /**
   * Find admin by admin_id.
   */
  findByAdminId(adminId) {
    const db = getDb();
    return db.prepare('SELECT * FROM admins WHERE admin_id = ?').get(adminId);
  },

  /**
   * Find admin by primary key ID.
   */
  findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, admin_id, created_at FROM admins WHERE id = ?').get(id);
  },

  /**
   * Get dashboard statistics.
   */
  getDashboardStats() {
    const db = getDb();

    const totalCitizens = db.prepare('SELECT COUNT(*) as count FROM citizens').get().count;
    const totalAuthorities = db.prepare('SELECT COUNT(*) as count FROM authorities').get().count;
    const totalComplaints = db.prepare('SELECT COUNT(*) as count FROM complaints').get().count;

    const pendingComplaints = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'").get().count;
    const inProgressComplaints = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'In Progress'").get().count;
    const resolvedComplaints = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'").get().count;
    const rejectedComplaints = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'Rejected'").get().count;

    const recentComplaints = db.prepare(`
      SELECT c.id, c.description, c.status, c.priority, c.created_at, ci.full_name as citizen_name
      FROM complaints c
      LEFT JOIN citizens ci ON c.citizen_id = ci.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `).all();

    // Department-wise breakdown
    const departmentStats = db.prepare(`
      SELECT
        a.sector as department,
        COUNT(c.id) as total_complaints,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) as resolved
      FROM complaints c
      LEFT JOIN authorities a ON c.assigned_authority_id = a.id
      WHERE a.sector IS NOT NULL
      GROUP BY a.sector
      ORDER BY total_complaints DESC
    `).all();

    return {
      totalCitizens,
      totalAuthorities,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      recentComplaints,
      departmentStats,
    };
  },

  /**
   * Get audit logs (complaint status changes).
   */
  getAuditLogs({ page = 1, limit = 50 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;

    const logs = db.prepare(`
      SELECT
        csh.*,
        c.description as complaint_description,
        c.location as complaint_location
      FROM complaint_status_history csh
      LEFT JOIN complaints c ON csh.complaint_id = c.id
      ORDER BY csh.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM complaint_status_history').get().count;

    return { logs, total, page, limit };
  },

  /**
   * Get department oversight data.
   */
  getDepartments() {
    const db = getDb();

    return db.prepare(`
      SELECT
        a.sector as department,
        COUNT(DISTINCT a.id) as authority_count,
        COUNT(c.id) as total_complaints,
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) as resolved
      FROM authorities a
      LEFT JOIN complaints c ON c.assigned_authority_id = a.id
      GROUP BY a.sector
      ORDER BY total_complaints DESC
    `).all();
  },

  /**
   * Delete a user by role and ID.
   */
  deleteUser(role, id) {
    const db = getDb();
    const table = role === 'citizen' ? 'citizens' : 'authorities';
    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return result.changes > 0;
  },
};

export default AdminModel;
