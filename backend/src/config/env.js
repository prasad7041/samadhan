import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  DEFAULT_ADMIN_ID: process.env.DEFAULT_ADMIN_ID || 'admin_master',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
};

// Validate critical env vars
const required = ['JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: ${key} is not set in .env, using fallback value.`);
  }
}

export default env;
