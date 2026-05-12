import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import env from './src/config/env.js';
import { initializeDatabase } from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';

// Routes
import citizenAuthRoutes from './src/routes/citizen.auth.routes.js';
import authorityAuthRoutes from './src/routes/authority.auth.routes.js';
import adminAuthRoutes from './src/routes/admin.auth.routes.js';
import complaintRoutes from './src/routes/complaint.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Initialize Express ──────────────────────────────────────
const app = express();

// ─── Security Middleware ─────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploaded images
}));

// ─── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsers ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logging ─────────────────────────────────────────
app.use(morgan('dev'));

// ─── Rate Limiting ───────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Static Files (Uploaded images) ──────────────────────────
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth/citizen', citizenAuthRoutes);
app.use('/api/auth/authority', authorityAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Samadhan Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found.`,
  });
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

// ─── Initialize Database & Start Server ──────────────────────
try {
  initializeDatabase();

  app.listen(env.PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('  🏛️  SAMADHAN BACKEND SERVER');
    console.log('═══════════════════════════════════════════════');
    console.log(`  🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`  🌐 Frontend URL: ${env.FRONTEND_URL}`);
    console.log(`  📁 API Base: http://localhost:${env.PORT}/api`);
    console.log(`  💊 Health: http://localhost:${env.PORT}/api/health`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
  });
} catch (err) {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
}

export default app;
