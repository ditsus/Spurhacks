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

import { promises as fs } from 'fs';

async function cleanAndSave(
  raw,
  { as = 'object', filename = 'listings.json' } = {}
) {
  if (typeof raw !== 'string')
    throw new TypeError('raw must be a JSON-ish string');

  // 🔹 1  replace NaN / Infinity tokens OUTSIDE quotes
  let cleaned = raw.replace(
    /\b(?:NaN|Infinity|-Infinity)\b(?=(?:[^"]*"[^"]*")*[^"]*$)/g,
    'null'
  );

  // 🔹 2  strip trailing commas  …,"foo":123,}
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1').trim();

  // 🔹 3  confirm the result really is valid JSON
  const parsed = JSON.parse(cleaned); // will throw on failure

  // 🔹 4  make sure  ./cities  exists, then write the file
  const dir = path.resolve('cities');
  await fs.mkdir(dir, { recursive: true });

  const outPath = path.join(dir, filename);
  await fs.writeFile(outPath, cleaned, 'utf8');

  console.log(`✅  Wrote cleaned data to ${outPath}`);

  return as === 'string' ? cleaned : parsed;
}

router.get("/", (req, res) => {
  const { location, limit = "1000" } = req.query;
  if (!location) {
    return res.status(400).json({ error: "`location` query param is required" });
  }

  const child = spawn("python", [pyPath, location, "--limit", limit]);

  let out = "", err = "";
  child.stdout.on("data", c => (out += c));
  child.stderr.on("data", c => (err += c));

  child.on("close", code => {
    if (code !== 0) {
      return res.status(500).json({ error: "Scraper failed", detail: err.trim() });
    }
    try   { res.json(JSON.parse(out)); }
    catch { 
      
      (async () => {
        const listings = await cleanAndSave(out); 
        console.log('First address:', listings[0].address_one);
      })();
      res.status(500).json({ error: "Bad JSON from scraper", raw: out }); }
  });
});

export default router;
