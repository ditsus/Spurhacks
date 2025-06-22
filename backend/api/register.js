import { Router } from "express";
import User from "../models/User.js";     // plain-text password schema

const router = Router();

/* GET /api/register  – remind client to POST instead */
router.get("/", (_req, res) =>
  res.status(405).json({ message: "Use POST for /api/register" })
);

/* POST /api/register
   Body: { name, email, password }
------------------------------------------------------------------ */
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // minimal validation
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  // block duplicate emails
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password });   // stored as-is ⚠️
  res.status(201).json({
    id:    user._id,
    name:  user.name,
    email: user.email,
    message: "User created",
  });
});

export default router;
