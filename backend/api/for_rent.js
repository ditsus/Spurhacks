// backend/api/forRent.js   (ES-module syntax)
import { Router } from "express";
import { spawn }  from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const router = Router();

// --- robust, cross-platform path to for_rent.py ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const pyPath     = path.join(__dirname, "..", "py", "for_rent.py"); // backend/py/for_rent.py
// --------------------------------------------------

router.get("/", (req, res) => {
  const { location, limit = "1000" } = req.query;
  if (!location) {
    return res.status(400).json({ error: "`location` query param is required" });
  }

  const child = spawn("python", [pyPath, location, limit]);

  let out = "", err = "";
  child.stdout.on("data", c => (out += c));
  child.stderr.on("data", c => (err += c));

  child.on("close", code => {
    if (code !== 0) {
      return res.status(500).json({ error: "Scraper failed", detail: err.trim() });
    }
    try   { res.json(JSON.parse(out)); }
    catch { res.status(500).json({ error: "Bad JSON from scraper", raw: out }); }
  });
});

export default router;
