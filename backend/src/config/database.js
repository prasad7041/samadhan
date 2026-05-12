import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import env from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', '..', 'database', 'samadhan.db');

let db;

/**
 * Initialize the SQLite database connection and create all tables.
 */
export function initializeDatabase() {
  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create all tables
  db.exec(`
    -- Citizens table
    CREATE TABLE IF NOT EXISTS citizens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL UNIQUE,
      area TEXT NOT NULL,
      pincode TEXT NOT NULL,
      preferred_language TEXT DEFAULT 'English',
      profile_picture TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Authorities table
    CREATE TABLE IF NOT EXISTS authorities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      job_role TEXT NOT NULL,
      sector TEXT NOT NULL,
      area TEXT NOT NULL,
      pincode TEXT NOT NULL,
      mobile TEXT NOT NULL,
      profile_picture TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Admins table
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- OTP records table
    CREATE TABLE IF NOT EXISTS otp_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK(purpose IN ('signup', 'login')),
      is_verified INTEGER DEFAULT 0,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Complaints table
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      citizen_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      image_path TEXT,
      location TEXT NOT NULL,
      latitude TEXT,
      longitude TEXT,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','In Progress','Resolved','Rejected')),
      priority TEXT DEFAULT 'Medium' CHECK(priority IN ('Low','Medium','High','Critical')),
      assigned_authority_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (citizen_id) REFERENCES citizens(id),
      FOREIGN KEY (assigned_authority_id) REFERENCES authorities(id)
    );

    -- Complaint status history table
    CREATE TABLE IF NOT EXISTS complaint_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by_role TEXT NOT NULL CHECK(changed_by_role IN ('citizen','authority','admin')),
      changed_by_id INTEGER NOT NULL,
      remarks TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (complaint_id) REFERENCES complaints(id)
    );
  `);

  // Seed default admin if not exists
  seedDefaultAdmin();

  console.log('✅ Database initialized successfully');
  return db;
}

/**
 * Seed a default admin account on first run.
 */
function seedDefaultAdmin() {
  const existing = db.prepare('SELECT id FROM admins WHERE admin_id = ?').get(env.DEFAULT_ADMIN_ID);

  if (!existing) {
    const hash = bcrypt.hashSync(env.DEFAULT_ADMIN_PASSWORD, env.BCRYPT_SALT_ROUNDS);
    db.prepare('INSERT INTO admins (admin_id, password_hash) VALUES (?, ?)').run(env.DEFAULT_ADMIN_ID, hash);
    console.log(`🔐 Default admin seeded: ${env.DEFAULT_ADMIN_ID}`);
  }
}

/**
 * Get the database instance.
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export default { initializeDatabase, getDb };
