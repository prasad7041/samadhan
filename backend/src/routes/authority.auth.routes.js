import { Router } from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/authorityAuth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadProfile } from '../middleware/upload.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateAuthoritySignup, validateAuthorityLogin } from '../validators/authority.validator.js';

const router = Router();

// Public routes
router.post('/signup', authLimiter, uploadProfile.single('profile_picture'), validate(validateAuthoritySignup), signup);
router.post('/login', authLimiter, validate(validateAuthorityLogin), login);

// Protected routes
router.get('/profile', authenticate, authorize('authority'), getProfile);
router.put('/profile', authenticate, authorize('authority'), uploadProfile.single('profile_picture'), updateProfile);

export default router;
