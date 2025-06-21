import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = 3000;

// Allow requests from your frontend
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => res.send('Hello, World!'));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Gemini endpoint
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  const { location, budget, preferences } = req.body;

  // Now you control the prompt format!
  const prompt = `
    You are an expert rental assistant.
    Recommend student rental options or tips.
    Location: ${location}
    Budget: $${budget.min} to $${budget.max} per month.
    Preferences: ${preferences}
    Provide a finished, friendly, and helpful answer.
    Do not end your answer with ellipses (...).
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ text });
  } catch (err) {
    // Super verbose error logging
    console.error("======== GEMINI ERROR START ========");
    console.error(err); // This will print everything
    console.error("err.message:", err?.message);
    console.error("err.response:", err?.response);
    console.error("err.response?.data:", err?.response?.data);
    console.error("err.stack:", err?.stack);
    console.error("======== GEMINI ERROR END ========");

    // Send everything as a string to frontend for debugging
    res.status(500).json({
      error: err?.message || JSON.stringify(err) || "Unknown Gemini error",
      details: {
        response: err?.response,
        responseData: err?.response?.data,
        stack: err?.stack,
      }
    });
  }
});



app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
