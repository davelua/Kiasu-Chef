export interface DetectedIngredient {
  id: string;
  name: string;
  quantity_estimate: string;
  category: string;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  cook_time_minutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories_estimate: number;
  ingredients_used: string[];
  missing_ingredients: string[];
  steps: string[];
  chef_tip: string;
  shiok_rating: number; // 1 to 5
}

export interface AnalysisResponse {
  success: boolean;
  ingredients: DetectedIngredient[];
  recipes: Recipe[];
  kiasuScore: number; // percentage
  savedCount: number;
  error?: string;
  errorCode?: 'NO_FOOD_DETECTED' | 'IMAGE_BLURRY' | 'API_ERROR' | 'UNKNOWN';
}

export interface SampleFridge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
}
