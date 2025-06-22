// backend/api/roommates.js
import express from 'express';
import User from '../models/User.js'; // or whatever your Mongoose user model is

const router = express.Router();

/**
 * GET /api/roommates
 * Query parameters:
 *   location      – student’s city/university
 *   preferences   – comma-separated tags, e.g. "quiet,study"
 */
router.get('/', async (req, res) => {
  const { location, preferences } = req.query;

  // Build a Mongo filter
  const filter = {};
  if (location) {
    filter.city = { $regex: new RegExp(`^${location}$`, 'i') };
  }
  if (preferences) {
    const prefs = preferences.split(',').map(s => s.trim());
    filter.interests = { $in: prefs };
  }

  // Find up to 10 matches
  try {
    const matches = await User.find(filter)
      .select('name major year avatarUrl interests')  // only pull what you need
      .limit(10)
      .lean();

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load roommates.' });
  }
});

export default router;
