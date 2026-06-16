import React, { createContext, useContext, useState } from 'react';
import { FoodAnalysis } from '../services/apiClient';



export interface WaterLog {
  id: string;
  amountMl: number;
  time: string;
}

interface NutritionContextType {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  historyLogs: FoodAnalysis[];
  waterLogs: WaterLog[];
  waterTotalMl: number;
  isPremium: boolean;
  streakCount: number;
  snapScoreTotal: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFats: number;
  username: string;
  isDarkMode: boolean;
  addMealDirect: (meal: FoodAnalysis) => void;
  addMealMock: (name: string, cal: number, p: number, c: number, f: number) => void;
  addWater: (amountMl: number) => void;
  setSubscriptionState: (premium: boolean) => void;
  updateDailyGoals: (cal: number, p: number, c: number, f: number) => void;
  updateUsername: (name: string) => void;
  toggleDarkMode: () => void;
  clearAllLogs: () => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("User");
  const [streakCount, setStreakCount] = useState<number>(5);
  const [snapScoreTotal, setSnapScoreTotal] = useState<number>(315);
  
  const [goalCalories, setGoalCalories] = useState<number>(2000);
  const [goalProtein, setGoalProtein] = useState<number>(130);
  const [goalCarbs, setGoalCarbs] = useState<number>(220);
  const [goalFats, setGoalFats] = useState<number>(70);

  const [calories, setCalories] = useState<number>(1160);
  const [protein, setProtein] = useState<number>(75);
  const [carbs, setCarbs] = useState<number>(110);
  const [fats, setFats] = useState<number>(38);

  const [waterTotalMl, setWaterTotalMl] = useState<number>(750);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([
    { id: 'w-1', amountMl: 250, time: '09:00 AM' },
    { id: 'w-2', amountMl: 500, time: '01:30 PM' }
  ]);

  const [historyLogs, setHistoryLogs] = useState<FoodAnalysis[]>([
    {
      id: 'meal_1',
      name: 'Blueberry Greek Yogurt Parfait',
      calories: 280,
      protein: 21,
      carbs: 30,
      fats: 5,
      confidence: 95.1,
      matchedIngredients: ["Greek Yogurt", "Wild Blueberries", "Almond Granola", "Organic honey"],
      healthScore: 8,
      servingSize: "1 Cup (220g)",
      snapScore: 95,
      timestamp: '09:00 AM',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
    },
    {
      id: 'meal_2',
      name: 'Glazed Wild Salmon Bowl',
      calories: 540,
      protein: 38,
      carbs: 32,
      fats: 14,
      confidence: 96.8,
      matchedIngredients: ["Atlantic Salmon", "Black Quinoa", "Steamed Edamame", "Sesame glaze"],
      healthScore: 10,
      servingSize: "1 Bowl (400g)",
      snapScore: 120,
      timestamp: '01:30 PM',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'
    }
  ]);

  const addMealDirect = (meal: FoodAnalysis) => {
    setCalories(prev => Math.min(prev + meal.calories, 6000));
    setProtein(prev => prev + meal.protein);
    setCarbs(prev => prev + meal.carbs);
    setFats(prev => prev + meal.fats);
    setSnapScoreTotal(prev => prev + meal.snapScore);
    setHistoryLogs(prev => [meal, ...prev]);
    
    // Smart incremental streak booster
    if (historyLogs.length === 0) {
      setStreakCount(prev => prev + 1);
    }
  };

  const addMealMock = (name: string, cal: number, p: number, c: number, f: number) => {
    const generated: FoodAnalysis = {
      id: `meal_manual_${Date.now()}`,
      name,
      calories: cal,
      protein: p,
      carbs: c,
      fats: f,
      confidence: 99.0,
      matchedIngredients: ["Custom ingredients entered by athlete"],
      healthScore: 8,
      servingSize: "1 Custom Portion",
      snapScore: 50,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'
    };
    addMealDirect(generated);
  };

  const addWater = (amountMl: number) => {
    setWaterTotalMl(prev => Math.min(prev + amountMl, 8000));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaterLogs(prev => [
      { id: `water_${Date.now()}`, amountMl, time: timeStr },
      ...prev
    ]);
    setSnapScoreTotal(prev => prev + 5);
  };

  const setSubscriptionState = (premium: boolean) => {
    setIsPremium(premium);
  };

  const updateDailyGoals = (cal: number, p: number, c: number, f: number) => {
    setGoalCalories(cal);
    setGoalProtein(p);
    setGoalCarbs(c);
    setGoalFats(f);
  };

  const updateUsername = (name: string) => {
    setUsername(name);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const clearAllLogs = () => {
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFats(0);
    setWaterTotalMl(0);
    setWaterLogs([]);
    setHistoryLogs([]);
    setStreakCount(0);
    setSnapScoreTotal(0);
  };

  return (
    <NutritionContext.Provider value={{
      calories,
      protein,
      carbs,
      fats,
      historyLogs,
      waterLogs,
      waterTotalMl,
      isPremium,
      streakCount,
      snapScoreTotal,
      goalCalories,
      goalProtein,
      goalCarbs,
      goalFats,
      username,
      isDarkMode,
      addMealDirect,
      addMealMock,
      addWater,
      setSubscriptionState,
      updateDailyGoals,
      updateUsername,
      toggleDarkMode,
      clearAllLogs
    }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}