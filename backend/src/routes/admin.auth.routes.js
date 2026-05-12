import { Router } from 'express';
import { login } from '../controllers/adminAuth.controller.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateAdminLogin } from '../validators/admin.validator.js';

const router = Router();

// Admin login
router.post('/login', authLimiter, validate(validateAdminLogin), login);

export default router;
