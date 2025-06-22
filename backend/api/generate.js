import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

const kingstonRentals = loadJson('../cities/kingston.json');
const londonRentals   = loadJson('../cities/london.json');
const torontoRentals  = loadJson('../cities/toronto.json');
const waterlooRentals = loadJson('../cities/waterloo.json');

const cityRentals = {
  Kingston: kingstonRentals,
  London: londonRentals,
  Toronto: torontoRentals,
  Waterloo: waterlooRentals,
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const router = express.Router();

router.post('/', async (req, res) => {
  const { location, budget, preferences } = req.body;

  console.log('--- /api/generate CALLED ---');
  console.log('Request body:', req.body);

  // Try to find city (case-insensitive)
  const cityKey = Object.keys(cityRentals).find(
    c => c.toLowerCase() === String(location || '').toLowerCase()
  );
  console.log('City key found:', cityKey);

  if (!cityKey) {
    console.log('City not found. Returning 400.');
    return res.status(400).json({ error: `No rentals available for "${location}".` });
  }
  const rentalsForCity = cityRentals[cityKey];
  console.log(`Loaded rentals for ${cityKey}:`, rentalsForCity.length);

  // DEBUG: Print the first rental for structure
  if (rentalsForCity.length > 0) {
    console.log('Sample rental:', rentalsForCity[0]);
  }

  // Filter rentals by budget
  const filteredRentals = rentalsForCity.filter(r =>
  (!budget?.max || Number(r.price_min) <= budget.max) &&
  (!budget?.min || Number(r.price_max) >= budget.min)
);
console.log('Rentals after filtering by budget:', filteredRentals.length);
if (filteredRentals.length > 0) {
  console.log('Sample filtered rental:', filteredRentals[0]);
} else {
  console.log('No rentals found after filtering.');
}


  const prefs = (preferences && preferences.trim()) ? preferences.trim() : "No specific preferences provided.";

  const prompt = `
You are a real estate agent specializing in meeting consumer demands for student housing.
You have access to a database of available rentals in various cities, including Kingston, London, Toronto, and Waterloo. 
Your task is to recommend suitable rental options based on the user's location, budget, and preferences.
Here are available rentals as a JSON array:
${JSON.stringify(filteredRentals.slice(0, 50), null, 2)}
Location: ${cityKey}
Budget: $${budget?.min ?? "?"} to $${budget?.max ?? "?"} per month.
Preferences: ${prefs}
Please recommend the top 5-10 rentals for a student, justifying your picks, and include the title and link. Be concise and helpful.
Format it in a JSON array like this without the "\`\`\` part":
[
  {
    "title": "Address (shortned pls)",
    "link": "https://example.com/rental-link",
    "Description of house": "Description",
    "Price": $xxxx.xx,
    "Min price": $xxxx.xx,
    "Max price": $xxxx.xx,
    "Location": [longitude, latitude],
    "Beds": x beds",
    "Baths: x baths"
    "Available from": "YYYY-MM-DD",
    "Amenities": ["amenity1", "wifi", ...]
    "Reason for recommendation": "Concise reason why this rental is a good fit for the user",
    "Images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  },
  `;
  console.log('Prompt length:', prompt.length);
  console.log('Prompt sent to Gemini:', prompt.substring(0, 1000), filteredRentals.length > 20 ? '...[truncated]' : '');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('Gemini response (start):', text.substring(0, 200));
    res.json({ text });
  } catch (err) {
    console.error("======== GEMINI ERROR START ========");
    console.error(err);
    res.status(500).json({
      error: err?.message || "Gemini API call failed",
      details: err
    });
  }
});

export default router;
