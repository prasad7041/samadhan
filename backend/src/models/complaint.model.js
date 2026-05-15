import { getDb } from '../config/database.js';

/**
 * Helper function to calculate distance using Haversine formula
 */
function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Complaint data access layer.
 */
const ComplaintModel = {
  /**
   * Create a new complaint with smart routing & auto-assignment.
   */
  create({ title, sector, citizen_id, description, image_path = null, location, latitude = null, longitude = null, area = null, pincode = null, city = null, village = null, mandal = null, district = null, priority = 'Medium' }) {
    const db = getDb();

    const cleanTitle = title ? title.trim() : 'General Complaint';
    const cleanSector = sector ? sector.trim() : 'General';

    // Smart Routing Logic: 3-Level Fallback Assignment
    let assigned_authority_id = null;
    try {
      // Priority 1: Exact Match (same village)
      let authStmt = db.prepare(`
        SELECT id FROM authorities 
        WHERE LOWER(TRIM(sector)) = LOWER(TRIM(?)) AND active_status = 1 
        AND (LOWER(TRIM(village)) = LOWER(TRIM(?)) OR LOWER(TRIM(area)) = LOWER(TRIM(?)))
        LIMIT 1
      `);
      let matchedAuth = authStmt.get(cleanSector, village || '', area || '');
      
      if (matchedAuth) {
        assigned_authority_id = matchedAuth.id;
        console.log(`🎯 Smart Routing Level 1: Auto-assigned complaint to authority ID ${assigned_authority_id} (Village match)`);
      } else {
        // Priority 2: Mandal Match
        authStmt = db.prepare(`
          SELECT id FROM authorities 
          WHERE LOWER(TRIM(sector)) = LOWER(TRIM(?)) AND active_status = 1 
          AND LOWER(TRIM(mandal)) = LOWER(TRIM(?))
          LIMIT 1
        `);
        matchedAuth = authStmt.get(cleanSector, mandal || '');
        if (matchedAuth) {
          assigned_authority_id = matchedAuth.id;
          console.log(`🎯 Smart Routing Level 2: Auto-assigned complaint to authority ID ${assigned_authority_id} (Mandal match)`);
        } else {
          // Priority 3: District Match (Find nearest)
          const authoritiesInDistrict = db.prepare(`
            SELECT id, latitude, longitude FROM authorities 
            WHERE LOWER(TRIM(sector)) = LOWER(TRIM(?)) AND active_status = 1 
            AND LOWER(TRIM(district)) = LOWER(TRIM(?))
          `).all(cleanSector, district || '');

          if (authoritiesInDistrict.length > 0 && latitude && longitude) {
            let nearestId = null;
            let minDistance = Infinity;

            for (const auth of authoritiesInDistrict) {
              const dist = getDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(auth.latitude), parseFloat(auth.longitude));
              if (dist < minDistance) {
                minDistance = dist;
                nearestId = auth.id;
              }
            }

            if (nearestId) {
              assigned_authority_id = nearestId;
              console.log(`🎯 Smart Routing Level 3: Auto-assigned to nearest authority ID ${assigned_authority_id} (District match, distance: ${minDistance.toFixed(2)} km)`);
            }
          }
        }
      }
      
      // Update workload_count if assigned
      if (assigned_authority_id) {
        db.prepare('UPDATE authorities SET workload_count = workload_count + 1 WHERE id = ?').run(assigned_authority_id);
      }
    } catch (err) {
      console.error("Auto-assignment error:", err);
    }

    const stmt = db.prepare(`
      INSERT INTO complaints (citizen_id, title, sector, description, image_path, location, latitude, longitude, area, pincode, city, village, mandal, district, priority, assigned_authority_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      citizen_id,
      cleanTitle,
      cleanSector,
      description,
      image_path,
      location,
      latitude,
      longitude,
      area,
      pincode,
      city,
      village,
      mandal,
      district,
      priority,
      assigned_authority_id
    );

    // Also insert initial status history
    db.prepare(`
      INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by_role, changed_by_id, remarks)
      VALUES (?, NULL, 'Pending', 'citizen', ?, 'Complaint created successfully')
    `).run(result.lastInsertRowid, citizen_id);

    return this.findById(result.lastInsertRowid);
  },

  /**
   * Find complaint by ID (with citizen and authority details).
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
   * Get complaints specifically routed to an authority sector.
   */
  findBySector(sector, area, pincode, { page = 1, limit = 20, status, priority } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    const cleanSector = sector ? sector.trim() : '';
    let where = ['LOWER(TRIM(c.sector)) = LOWER(TRIM(?)) AND (c.pincode = ? OR c.area = ?)'];
    let params = [cleanSector, pincode, area];

    if (status) {
      where.push('c.status = ?');
      params.push(status);
    }
    if (priority) {
      where.push('c.priority = ?');
      params.push(priority);
    }

    const whereClause = `WHERE ${where.join(' AND ')}`;

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

    const total = db.prepare(`SELECT COUNT(*) as count FROM complaints c ${whereClause}`).get(...params).count;

    return { complaints, total, page, limit };
  },

  /**
   * Get complaints assigned to a specific authority.
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
   * Find complaints near a location.
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

  /**
   * Get all pre-configured complaint categories/sectors.
   */
  getCategories() {
    const db = getDb();
    return db.prepare('SELECT * FROM complaint_categories ORDER BY sector_name ASC').all();
  },
};

export default ComplaintModel;
