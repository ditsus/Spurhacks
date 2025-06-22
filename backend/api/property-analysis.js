import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const router = express.Router();

router.post('/', async (req, res) => {
  const { propertyData, userPreferences } = req.body;

  console.log('--- /api/property-analysis CALLED ---');
  console.log('Property data:', propertyData);

  const prompt = `
You are a real estate analyst specializing in student housing evaluation. Analyze the following property and provide detailed ratings and insights.

Property Information:
${JSON.stringify(propertyData, null, 2)}

User Preferences (if provided):
${JSON.stringify(userPreferences || {}, null, 2)}

Please provide a comprehensive analysis in the following JSON format:

{
  "overallScore": 85,
  "ratings": {
    "transit": {
      "score": 80,
      "description": "Excellent transit access with multiple bus routes within 5 minutes walk"
    },
    "schools": {
      "score": 90,
      "description": "Very close to university campus and multiple educational institutions"
    },
    "quietness": {
      "score": 75,
      "description": "Generally quiet residential area, some street noise during peak hours"
    },
    "safety": {
      "score": 85,
      "description": "Safe neighborhood with good lighting and low crime rates"
    },
    "amenities": {
      "score": 88,
      "description": "Close to grocery stores, restaurants, and essential services"
    },
    "value": {
      "score": 82,
      "description": "Good value for the area, competitive pricing for the amenities offered"
    }
  },
  "aiDescription": "This property is an excellent choice for students due to its proximity to campus, good transit connections, and reasonable pricing. The location offers a good balance of convenience and quietness, making it ideal for both studying and social activities.",
  "pros": [
    "Close to university campus",
    "Good transit connections",
    "Safe neighborhood",
    "Reasonable pricing"
  ],
  "cons": [
    "Some street noise during peak hours",
    "Limited parking options"
  ],
  "recommendations": [
    "Consider noise-canceling headphones for study time",
    "Look into transit pass options for cost savings"
  ]
}

Base your analysis on the property's location, amenities, price, and typical student needs. Be realistic and provide actionable insights.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Try to parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Return a fallback analysis
      analysis = {
        overallScore: 75,
        ratings: {
          transit: { score: 70, description: "Analysis unavailable" },
          schools: { score: 75, description: "Analysis unavailable" },
          quietness: { score: 70, description: "Analysis unavailable" },
          safety: { score: 75, description: "Analysis unavailable" },
          amenities: { score: 75, description: "Analysis unavailable" },
          value: { score: 75, description: "Analysis unavailable" }
        },
        aiDescription: "Property analysis is currently unavailable. Please contact us for more information.",
        pros: ["Property details available"],
        cons: ["Analysis unavailable"],
        recommendations: ["Contact property manager for more details"]
      };
    }

    res.json(analysis);
  } catch (err) {
    console.error("======== PROPERTY ANALYSIS ERROR ========");
    console.error(err);
    res.status(500).json({
      error: err?.message || "Property analysis failed",
      details: err
    });
  }
});

export default router; 