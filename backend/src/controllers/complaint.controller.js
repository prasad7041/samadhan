import ComplaintModel from '../models/complaint.model.js';
import { success, error } from '../utils/responseHelper.js';

/**
 * Complaint Controller.
 */

/**
 * POST /api/complaints
 * Create a new complaint (citizen only).
 */
export async function createComplaint(req, res, next) {
  try {
    const { description, location, latitude, longitude, priority } = req.body;

    // Get image path if uploaded
    const image_path = req.file ? `/uploads/complaints/${req.file.filename}` : null;

    const complaint = ComplaintModel.create({
      citizen_id: req.user.id,
      description,
      image_path,
      location,
      latitude,
      longitude,
      priority,
    });

    return success(res, { complaint }, 'Complaint submitted successfully.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/complaints
 * Get all complaints with optional filters (authority/admin).
 */
export async function getComplaints(req, res, next) {
  try {
    const { status, priority, page, limit } = req.query;

    const result = ComplaintModel.findAll({
      status,
      priority,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return success(res, result, 'Complaints fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/complaints/my-reports
 * Get complaints raised by the logged-in citizen.
 */
export async function getMyReports(req, res, next) {
  try {
    const { page, limit } = req.query;

    const result = ComplaintModel.findByCitizenId(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return success(res, result, 'Your reports fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/complaints/assigned
 * Get complaints assigned to the logged-in authority.
 */
export async function getAssignedComplaints(req, res, next) {
  try {
    const { page, limit } = req.query;

    const result = ComplaintModel.findByAuthorityId(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return success(res, result, 'Assigned complaints fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/complaints/nearby
 * Get complaints near a location.
 */
export async function getNearbyComplaints(req, res, next) {
  try {
    const { latitude, longitude, radius, page, limit } = req.query;

    if (!latitude || !longitude) {
      return error(res, 'Latitude and longitude are required.', 400);
    }

    const result = ComplaintModel.findNearby({
      latitude,
      longitude,
      radiusKm: parseFloat(radius) || 5,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return success(res, result, 'Nearby complaints fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/complaints/:id
 * Get a single complaint by ID.
 */
export async function getComplaintById(req, res, next) {
  try {
    const complaint = ComplaintModel.findById(parseInt(req.params.id));

    if (!complaint) {
      return error(res, 'Complaint not found.', 404);
    }

    // Also get status history
    const history = ComplaintModel.getStatusHistory(complaint.id);

    return success(res, { complaint, history }, 'Complaint fetched successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/complaints/:id/status
 * Update complaint status (authority/admin).
 */
export async function updateStatus(req, res, next) {
  try {
    const { status, remarks } = req.body;
    const complaintId = parseInt(req.params.id);

    // Check if complaint exists
    const existing = ComplaintModel.findById(complaintId);
    if (!existing) {
      return error(res, 'Complaint not found.', 404);
    }

    const updated = ComplaintModel.updateStatus(complaintId, {
      status,
      changed_by_role: req.user.role,
      changed_by_id: req.user.id,
      remarks,
    });

    return success(res, { complaint: updated }, 'Complaint status updated successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/complaints/:id/assign
 * Assign an authority to a complaint (admin only).
 */
export async function assignAuthority(req, res, next) {
  try {
    const { authority_id } = req.body;
    const complaintId = parseInt(req.params.id);

    // Check if complaint exists
    const existing = ComplaintModel.findById(complaintId);
    if (!existing) {
      return error(res, 'Complaint not found.', 404);
    }

    const updated = ComplaintModel.assignAuthority(complaintId, parseInt(authority_id));

    return success(res, { complaint: updated }, 'Authority assigned successfully.');
  } catch (err) {
    next(err);
  }
}
