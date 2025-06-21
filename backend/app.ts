import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Create an Express application
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Export for Vite-plugin-node
export const viteNodeApp = app;