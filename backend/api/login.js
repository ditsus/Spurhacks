import { Router } from "express";
import User from "../models/User.js";

const router = Router();

/* GET /api/login  – remind client to POST instead */
router.get("/", (_req, res) =>
  res.status(405).json({ message: "Use POST for /api/login" })
);

/* POST /api/login
   Body: { email, password }  OR { username, password }
------------------------------------------------------------------ */
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = (email || username || "").toLowerCase();

  if (!identifier || !password)
    return res.status(400).json({ message: "Email & password required" });

  const user = await User.findOne({ email: identifier });
  if (!user || user.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    id:    user._id,
    name:  user.name,
    email: user.email,
    message: "Login success",
  });
});

export default router;
