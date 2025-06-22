// backend/index.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js';

dotenv.config();
await connectDB();  // connect to MongoDB

// ── Setup Express ───────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// 1) Enable CORS for your front-end dev origin (and allow curl, etc.)
app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === 'http://localhost:8080') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// 2) JSON body parsing
app.use(express.json());

// ── Mount all routers in /api ────────────────────────────────────
const apiDir = path.join(__dirname, 'api');
for (const file of fs.readdirSync(apiDir).filter(f => f.endsWith('.js'))) {
  console.log('📦 mounting router:', file);
  const { default: router } = await import(`./api/${file}`);
  const routeName = path.basename(file, '.js');
  app.use(`/api/${routeName}`, router);
}

// ── Health check, 404, and error handler ────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));

// If no route matched:
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler:
app.use((err, _req, res, _next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

// ── Start server ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});

export default app;
