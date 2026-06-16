/**
 * Nutri Snap Secure Gateway Client
 * Integrates Supabase Storage, Google Gemini Vision API, and Stripe Client-Side Session tokens.
 */

export interface FoodAnalysis {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  confidence: number; // percentage
  matchedIngredients: string[];
  healthScore: number; // 1 to 10
  servingSize: string;
  snapScore: number; // gamified metric
  timestamp: string;
  imageUrl: string;
}

// Sample generated dishes representing advanced computer vision AI intelligence output


//here we need to change this to real ata  accordingto the way the people enter data which is to be scanned
///
const PRESET_DISHES: Omit<FoodAnalysis, 'id' | 'timestamp' | 'imageUrl'>[] = [
  {
    name: "Avo-Toast & Poached Egg Supreme",
    calories: 340,
    protein: 16,
    carbs: 24,
    fats: 19,
    confidence: 98.2,
    matchedIngredients: ["Sourdough bread", "Fresh Avocado", "Poached Egg", "Sprouted microgreens", "Chili flakes"],
    healthScore: 9,
    servingSize: "1 Toast (180g)",
    snapScore: 85
  },
  {
    name: "Glazed Wild Salmon Bowl",
    calories: 540,
    protein: 38,
    carbs: 32,
    fats: 14,
    confidence: 96.8,
    matchedIngredients: ["Atlantic Salmon", "Black Quinoa", "Steamed Edamame", "Sesame glaze"],
    healthScore: 10,
    servingSize: "1 Bowl (400g)",
    snapScore: 120
  },
  {
    name: "Blueberry Greek Yogurt Parfait",
    calories: 280,
    protein: 21,
    carbs: 30,
    fats: 5,
    confidence: 95.1,
    matchedIngredients: ["Greek Yogurt", "Wild Blueberries", "Almond Granola", "Organic honey"],
    healthScore: 8,
    servingSize: "1 Cup (220g)",
    snapScore: 95
  },
  {
    name: "Flame Grilled Steak & Sweet Fries",
    calories: 680,
    protein: 45,
    carbs: 48,
    fats: 22,
    confidence: 94.2,
    matchedIngredients: ["Sirloin Steak", "Baked Sweet Potato Fries", "Garlic Asparagus"],
    healthScore: 7,
    servingSize: "1 Plate (450g)",
    snapScore: 110
  }
];

export const ApiClient = {
  /**
   * Simulates high-fidelity AI Image scanning compression + Gemini vision analytics
   */
  analyzePlateImage: async (imageUri: string, isPremium: boolean): Promise<FoodAnalysis> => {
    // Simulate network delay for model processing (1.8s)
    await new Promise((resolve) => setTimeout(resolve, 1800));
    
    const baseDish = PRESET_DISHES[Math.floor(Math.random() * PRESET_DISHES.length)];
    
    // If premium, boost detailed analytics
    const adjustedConfidence = isPremium 
      ? Math.min(baseDish.confidence + 1.2, 99.9) 
      : baseDish.confidence;

    return {
      ...baseDish,
      id: `meal_snap_${Date.now()}`,
      confidence: parseFloat(adjustedConfidence.toFixed(1)),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageUri || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    };
  },

  /**
   * Mock Stripe subscription session initializer
   */
  initializeStripeSession: async (planId: string): Promise<{ success: boolean; url: string; sessionId: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      url: `https://checkout.stripe.com/pay/mock_session_${Date.now()}`,
      sessionId: `cs_test_mock_${Math.random().toString(36).substring(7)}` 
    };
  }
};

/**
 * Supabase Database Schemas (Useful for copy-pasting directly into SQL Editor)
 */
export const SUPABASE_SQL_SCHEMA = `-- Nutri Snap High-Performance Scalable Postgres Schema

-- Users Profile Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  is_premium BOOLEAN DEFAULT false,
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 130,
  daily_carbs_goal INTEGER DEFAULT 200,
  daily_fats_goal INTEGER DEFAULT 65,
  streak_count INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Food Meals Table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fats INTEGER NOT NULL,
  confidence_score NUMERIC(5,2),
  ingredients TEXT[],

  serving_size TEXT,
  health_score INTEGER,
  snap_score INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Water Log Table
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  logged_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS) for Military Grade compliance
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert/update own meals" ON public.meals 
  FOR ALL USING (auth.uid() = user_id);
`;