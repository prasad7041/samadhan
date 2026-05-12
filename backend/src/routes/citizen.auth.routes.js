import { Router } from 'express';
import { sendOtp, verifyOtp, signup, verifySignup, getProfile, updateProfile } from '../controllers/citizenAuth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadProfile } from '../middleware/upload.js';
import { otpLimiter } from '../middleware/rateLimiter.js';
import { validateSendOtp, validateVerifyOtp, validateCitizenSignup } from '../validators/citizen.validator.js';

const router = Router();

// Public routes
router.post('/send-otp', otpLimiter, validate(validateSendOtp), sendOtp);
router.post('/verify-otp', otpLimiter, validate(validateVerifyOtp), verifyOtp);
router.post('/signup', otpLimiter, validate(validateCitizenSignup), signup);
router.post('/verify-signup', otpLimiter, uploadProfile.single('profile_picture'), verifySignup);

// Protected routes
router.get('/profile', authenticate, authorize('citizen'), getProfile);
router.put('/profile', authenticate, authorize('citizen'), uploadProfile.single('profile_picture'), updateProfile);

export default router;
