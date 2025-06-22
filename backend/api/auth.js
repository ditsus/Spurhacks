// backend/api/auth.js
import { Router } from 'express';
import User from '../models/User.js';   // <-- plain-text password schema
                                        // (see models/User.js from the previous step)

const router = Router();

/* ----------------------------------------------------------------------
   GET /api/auth              – simple ping so you know the route is live
------------------------------------------------------------------------ */
router.get('/', (_req, res) => {
  res.json({ message: 'Auth endpoint OK' });
});

/* ----------------------------------------------------------------------
   POST /api/auth/register     – create a new user (NO password hashing)
   Body: { name, email, password }
------------------------------------------------------------------------ */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // super-minimal validation
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  // unique email check
  if (await User.findOne({ email }))
    return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password });   // stored as-is ⚠️
  res.status(201).json({
    id:    user._id,
    name:  user.name,
    email: user.email,
    message: 'User created',
  });
});


/* ----------------------------------------------------------------------
   POST /api/auth/login        – plain-text login
   Body: { email, password }
------------------------------------------------------------------------ */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // minimal validation
  if (!email || !password)
    return res.status(400).json({ message: 'Email & password required' });

  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(401).json({ message: 'Invalid credentials' });

  // No JWT in this stripped-down version – just echo success + user info
  res.json({
    id:    user._id,
    name:  user.name,
    email: user.email,
    message: 'Login success',
  });
});

export default router;
