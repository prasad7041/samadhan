import { Router } from 'express';
import {
  getDashboardStats,
  getAllCitizens,
  getAllAuthorities,
  deleteUser,
  getAuditLogs,
  getDepartments,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require admin authentication
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users/citizens', getAllCitizens);
router.get('/users/authorities', getAllAuthorities);
router.delete('/users/:role/:id', deleteUser);

// Audit & Oversight
router.get('/audit-logs', getAuditLogs);
router.get('/departments', getDepartments);

export default router;
