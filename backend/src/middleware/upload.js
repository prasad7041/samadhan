import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Create a multer storage engine for a specific subfolder.
 * @param {string} subfolder - 'profiles' or 'complaints'
 */
function createStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(UPLOADS_DIR, subfolder));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      cb(null, `${subfolder.slice(0, -1)}-${uniqueSuffix}${ext}`);
    },
  });
}

/**
 * File filter — only allow images.
 */
function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`), false);
  }
}

/**
 * Multer instance for profile picture uploads.
 */
export const uploadProfile = multer({
  storage: createStorage('profiles'),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Multer instance for complaint image uploads.
 */
export const uploadComplaint = multer({
  storage: createStorage('complaints'),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
