import { Router } from 'express';
const router = Router();

// GET /api/test
router.get('/', (req, res) => {
  res.json({ message: 'Test endpoint OK' });
});

export default router; 