import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();

// Allow large image uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_CHAIN = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

// Try each model in turn; a 503/overload on one falls through to the next.
async function generateWithFallback(params: { contents: any; config: any }) {
  let lastErr: any;
  for (const model of MODEL_CHAIN) {
    try {
      return await ai.models.generateContent({ model, ...params });
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} failed:`, err?.message?.slice(0, 200));
    }
  }
  throw lastErr;
}

const SINGAPORE_SYSTEM_PROMPT = `You are Kiasu Chef, a Singaporean home-cook auntie. Suggest recipes that suit Singapore home kitchens: zi char style stir-fries, kopitiam breakfasts, steamed dishes, soups, sambal-based dishes, rice and noodle dishes, plus simple Western or fusion options. Prefer ingredients easily found in NTUC or wet markets. Recognise local ingredients such as kangkong, taugeh, tau kwa, tau pok, belacan, ikan bilis, sambal, kecap manis, chye sim, bak choy, luncheon meat and canned sardines.`;

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    has_food: {
      type: Type.BOOLEAN,
      description: 'True if any edible items, produce, pantry staples, drinks, or ingredients are visible in the image.',
    },
    is_blurry: {
      type: Type.BOOLEAN,
      description: 'True if the image is too dark, blurry or unidentifiable to read food items.',
    },
    ingredients: {
      type: Type.ARRAY,
      description: 'List of detected food ingredients, vegetables, proteins, pantry items, sauces.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Common name of ingredient (e.g. Tau Kwa, Chye Sim, Eggs, Luncheon Meat, Garlic).' },
          quantity_estimate: { type: Type.STRING, description: 'Estimate of quantity (e.g. 1 block, 1 bunch, 2-3 pcs, 1 bottle).' },
          category: {
            type: Type.STRING,
            description: 'One of: Fresh Produce & Greens, Proteins & Tofu, Dairy & Eggs, Pantry & Condiments, Carbs & Noodles, Other',
          },
        },
        required: ['name', 'quantity_estimate', 'category'],
      },
    },
    recipes: {
      type: Type.ARRAY,
      description: 'Exactly 3 recipes that make the best use of the detected ingredients.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Recipe title in plain English with local Singapore name where relevant.' },
          emoji: { type: Type.STRING, description: 'Single food emoji matching the dish.' },
          cook_time_minutes: { type: Type.INTEGER, description: 'Cooking time in minutes (e.g. 15).' },
          difficulty: { type: Type.STRING, description: 'Easy, Medium, or Hard.' },
          calories_estimate: { type: Type.INTEGER, description: 'Estimated calories per serving in kcal.' },
          ingredients_used: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Names of detected ingredients used in this recipe.',
          },
          missing_ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Minimal common pantry items needed (e.g. 1 tbsp soy sauce, oil).',
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Step-by-step clear cooking instructions.',
          },
          chef_tip: {
            type: Type.STRING,
            description: 'Friendly tip from auntie.',
          },
          shiok_rating: {
            type: Type.INTEGER,
            description: 'Shiok rating from 1 to 5.',
          },
        },
        required: [
          'title',
          'emoji',
          'cook_time_minutes',
          'difficulty',
          'calories_estimate',
          'ingredients_used',
          'missing_ingredients',
          'steps',
          'chef_tip',
          'shiok_rating',
        ],
      },
    },
  },
  required: ['has_food', 'ingredients', 'recipes'],
};

// Helper to calculate Kiasu Score
function calculateKiasuScore(ingredients: Array<{ name: string }>, recipes: Array<{ ingredients_used: string[] }>) {
  if (!ingredients.length) return { score: 0, savedCount: 0 };
  
  const allDetected = ingredients.map((i) => i.name.toLowerCase().trim());
  const usedSet = new Set<string>();

  recipes.forEach((r) => {
    (r.ingredients_used || []).forEach((u) => {
      const uLower = u.toLowerCase().trim();
      const matched = allDetected.find((det) => det.includes(uLower) || uLower.includes(det));
      if (matched) {
        usedSet.add(matched);
      } else {
        usedSet.add(uLower);
      }
    });
  });

  const savedCount = Math.min(usedSet.size, allDetected.length);
  const score = Math.min(100, Math.max(10, Math.round((savedCount / allDetected.length) * 100)));
  return { score, savedCount };
}

// POST /api/analyze-fridge
app.post('/api/analyze-fridge', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, mimeType = 'image/jpeg', singlish = true } = req.body;

    if (!image) {
      res.status(400).json({
        success: false,
        error: singlish ? 'Aiyo, no photo sent leh!' : 'No image provided.',
        errorCode: 'NO_FOOD_DETECTED',
      });
      return;
    }

    // Strip base64 prefix if present
    const cleanBase64 = image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const singlishGuidance = singlish
      ? 'The chef_tip MUST be written in light, friendly Singlish, like an auntie giving advice (e.g. "Don\'t overcook the veg, later become soggy lah", "Fry garlic till fragrant first, confirm power!"). Keep it readable, not exaggerated.'
      : 'The chef_tip should be friendly, clear standard English home-cooking advice.';

    const promptText = `Analyze this fridge/pantry/groceries photo.
1. Check if there are any edible food items, vegetables, meat, condiments, beverages, or pantry staples.
2. If there are NO food items at all, set has_food = false.
3. If the image is extremely blurry or unreadable, set is_blurry = true.
4. Extract all detected ingredients with realistic quantity estimates and appropriate categories.
5. Create EXACTLY 3 recipes suited for Singapore home cooking.
${singlishGuidance}
Provide exactly 3 recipes with realistic cooking times, easy steps, and shiok_rating from 1 to 5.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const response = await generateWithFallback({
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        systemInstruction: SINGAPORE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
        temperature: 0.4,
      },
    });

    const textOutput = response.text?.trim() || '{}';
    const parsedData = JSON.parse(textOutput);

    if (parsedData.is_blurry) {
      res.json({
        success: false,
        error: singlish
          ? 'Wah lau eh, so blur auntie cannot see! Try snapping again with more light lah.'
          : 'The image is too blurry. Please try again with better lighting.',
        errorCode: 'IMAGE_BLURRY',
      });
      return;
    }

    if (!parsedData.has_food || !parsedData.ingredients || parsedData.ingredients.length === 0) {
      res.json({
        success: false,
        error: singlish ? 'Aiyo, no food leh. Try another photo?' : 'No food ingredients detected. Please try another photo.',
        errorCode: 'NO_FOOD_DETECTED',
      });
      return;
    }

    // Add unique IDs
    const ingredientsWithIds = parsedData.ingredients.map((ing: any, idx: number) => ({
      id: `ing-${Date.now()}-${idx}`,
      name: ing.name || 'Ingredient',
      quantity_estimate: ing.quantity_estimate || '1 portion',
      category: ing.category || 'Other',
    }));

    const recipesWithIds = (parsedData.recipes || []).slice(0, 3).map((rec: any, idx: number) => ({
      id: `rec-${Date.now()}-${idx}`,
      title: rec.title || 'Singapore Home Dish',
      emoji: rec.emoji || '🍲',
      cook_time_minutes: Number(rec.cook_time_minutes) || 15,
      difficulty: rec.difficulty || 'Easy',
      calories_estimate: Number(rec.calories_estimate) || 350,
      ingredients_used: Array.isArray(rec.ingredients_used) ? rec.ingredients_used : [],
      missing_ingredients: Array.isArray(rec.missing_ingredients) ? rec.missing_ingredients : [],
      steps: Array.isArray(rec.steps) && rec.steps.length > 0 ? rec.steps : ['Prepare ingredients.', 'Stir fry and serve hot.'],
      chef_tip: rec.chef_tip || (singlish ? 'Eat while hot, shiok!' : 'Best served immediately.'),
      shiok_rating: Math.min(5, Math.max(1, Number(rec.shiok_rating) || 4)),
    }));

    const { score, savedCount } = calculateKiasuScore(ingredientsWithIds, recipesWithIds);

    res.json({
      success: true,
      ingredients: ingredientsWithIds,
      recipes: recipesWithIds,
      kiasuScore: score,
      savedCount: savedCount,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-fridge:', error);
    const isSinglish = req.body?.singlish !== false;
    res.status(500).json({
      success: false,
      error: isSinglish ? 'Wah lau, server sleeping. Try again lah.' : 'Server connection failed. Please try again.',
      errorCode: 'API_ERROR',
      details: error?.message,
    });
  }
});

// POST /api/regenerate-recipes
// Generates 3 new recipes using current ingredient list
app.post('/api/regenerate-recipes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ingredients = [], singlish = true } = req.body;

    if (!ingredients || ingredients.length === 0) {
      res.status(400).json({
        success: false,
        error: singlish ? 'Aiyo, no ingredients left to cook! Add some items first lah.' : 'No ingredients provided.',
      });
      return;
    }

    const ingredientNames = ingredients.map((i: any) => (typeof i === 'string' ? i : i.name)).join(', ');

    const singlishGuidance = singlish
      ? 'The chef_tip MUST be written in light, friendly Singlish, like an auntie giving advice (e.g. "Don\'t overcook the veg, later become soggy lah", "Add a dash of white pepper to lift the aroma!"). Keep it readable, not exaggerated.'
      : 'The chef_tip should be friendly, clear standard English home-cooking advice.';

    const promptText = `The user has the following ingredients available in their Singapore kitchen:
${ingredientNames}

Generate EXACTLY 3 delicious, practical Singapore home recipes utilizing these ingredients as much as possible.
Recipes should suit local zi char, kopitiam, soup, or stir-fry cooking.
${singlishGuidance}
Return formatted JSON conforming to the recipe schema.`;

    const recipesSchemaOnly = {
      type: Type.OBJECT,
      properties: {
        recipes: analysisResponseSchema.properties.recipes,
      },
      required: ['recipes'],
    };

    const response = await generateWithFallback({
      contents: promptText,
      config: {
        systemInstruction: SINGAPORE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: recipesSchemaOnly,
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const recipesWithIds = (parsed.recipes || []).slice(0, 3).map((rec: any, idx: number) => ({
      id: `rec-regen-${Date.now()}-${idx}`,
      title: rec.title || 'Singapore Home Dish',
      emoji: rec.emoji || '🍲',
      cook_time_minutes: Number(rec.cook_time_minutes) || 15,
      difficulty: rec.difficulty || 'Easy',
      calories_estimate: Number(rec.calories_estimate) || 350,
      ingredients_used: Array.isArray(rec.ingredients_used) ? rec.ingredients_used : [],
      missing_ingredients: Array.isArray(rec.missing_ingredients) ? rec.missing_ingredients : [],
      steps: Array.isArray(rec.steps) && rec.steps.length > 0 ? rec.steps : ['Prepare ingredients.', 'Stir fry and serve hot.'],
      chef_tip: rec.chef_tip || (singlish ? 'Serve hot with fragrant white rice!' : 'Best served hot.'),
      shiok_rating: Math.min(5, Math.max(1, Number(rec.shiok_rating) || 4)),
    }));

    const formattedIngredients = ingredients.map((i: any) => (typeof i === 'string' ? { name: i } : i));
    const { score, savedCount } = calculateKiasuScore(formattedIngredients, recipesWithIds);

    res.json({
      success: true,
      recipes: recipesWithIds,
      kiasuScore: score,
      savedCount: savedCount,
    });
  } catch (error: any) {
    console.error('Error in /api/regenerate-recipes:', error);
    const isSinglish = req.body?.singlish !== false;
    res.status(500).json({
      success: false,
      error: isSinglish ? 'Wah lau, server sleeping. Try again lah.' : 'Failed to regenerate recipes. Please try again.',
      details: error?.message,
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Kiasu Chef' });
});

export default app;
