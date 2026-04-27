import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  console.warn('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey || 'missing-key');

export async function analyzeFoodImage(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze this food image and provide:
    1. The name of the food item(s).
    2. Estimated portion size.
    3. Nutritional breakdown (Calories, Protein, Carbs, Fat in grams).
    4. Healthiness score (1-10) and a brief tip.
    
    Return the response ONLY as a JSON object with the following structure:
    {
      "food_name": "string",
      "portion": "string",
      "macros": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "score": number,
      "tip": "string"
    }
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64,
        mimeType: 'image/jpeg',
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();
  
  try {
    // Clean potential markdown code blocks from the response
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch {
    console.error('Failed to parse AI response:', text);
    throw new Error('AI failed to return structured data');
  }
}

export async function getChatResponse(message: string, history: { role: 'user' | 'model'; parts: string }[]) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: `
      You are NutriAI, an empathetic and expert nutritional coach for the NutriSense AI app.
      Your goal is to help users make healthier food choices and build sustainable habits.
      Always be supportive, evidence-based, and practical.
      If a user asks for a meal suggestion, provide a name, description, and estimated macros.
      If a user asks about their progress, remind them you can see their logged meals (even if you can't see the DB directly, act as if you're part of the system).
      Keep responses concise and friendly.
    `
  });

  const chat = model.startChat({
    history: history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

export async function generateWeeklyMealPlan(userProfile: {
  health_goal?: string;
  dietary_restrictions?: string[];
  cuisine_preference?: string;
  daily_calorie_target?: number;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Generate a 7-day personalized meal plan for a user with the following profile:
    - Goal: ${userProfile.health_goal}
    - Dietary Restrictions: ${userProfile.dietary_restrictions?.join(', ') || 'None'}
    - Cuisine Preference: ${userProfile.cuisine_preference}
    - Daily Calorie Target: ${userProfile.daily_calorie_target} kcal
    
    Provide 2 main meals per day: Breakfast and Lunch (for simplicity in this UI).
    For each meal, include:
    - Name
    - Description
    - Macros (Calories, Protein, Carbs, Fat)
    - Preparation Time (minutes)
    - Ingredients list
    - Step-by-step instructions
    - A "Health Benefit" specific to their goal.

    Return the response ONLY as a JSON object with this structure:
    {
      "days": [
        {
          "day": "Mon",
          "meals": [
            {
              "type": "Breakfast",
              "name": "string",
              "description": "string",
              "macros": { "calories": number, "protein": number, "carbs": number, "fat": number },
              "prep_time": number,
              "ingredients": ["string"],
              "instructions": ["string"],
              "benefit": "string"
            },
            {
              "type": "Lunch",
              "name": "string",
              "description": "string",
              "macros": { "calories": number, "protein": number, "carbs": number, "fat": number },
              "prep_time": number,
              "ingredients": ["string"],
              "instructions": ["string"],
              "benefit": "string"
            }
          ]
        }
      ]
    }
    Generate for all 7 days (Mon, Tue, Wed, Thu, Fri, Sat, Sun).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch {
    console.error('Failed to parse AI response:', text);
    throw new Error('AI failed to return structured meal plan');
  }
}
