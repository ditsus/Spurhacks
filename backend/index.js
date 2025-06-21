import express from 'express';
import fs      from 'fs';
import path    from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import cors from 'cors';

dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:8080' }));

const apiDir = path.join(__dirname, 'api');
for (const file of fs.readdirSync(apiDir).filter(f => f.endsWith('.js'))) {
  const { default: router } = await import(`./api/${file}`);
  const name = path.basename(file, '.js');
  app.use(`/api/${name}`, router);
}

app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
app.use((_req, res)   => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));