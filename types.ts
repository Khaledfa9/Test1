export enum MealCategory {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Snacks = 'Snacks',
}

export type View = 'dashboard' | 'history' | 'meals' | 'settings' | 'addMeal' | 'editMeal' | 'mealExtractor';

export interface Meal {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    defaultWeight: number;
    category: MealCategory;
    imageUrl: string;
    isMainMeal: boolean;
}

export interface TrackedMeal {
    id: string;
    mealId: string | null;
    name: string;
    weight: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    eaten: boolean;
    category: MealCategory;
    imageUrl: string;
}

export interface DailyGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

// Represents the active, ongoing log for the current session
export interface TodayLog {
    date: string; // The start date of the current session
    consumed: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    goals: DailyGoals;
    meals: TrackedMeal[];
}

// Represents a completed, saved log in the history
export interface HistoryLog {
    id: string; // Unique ID for the history entry
    date: string; // The user-chosen date for this log (e.g., "July 24")
    isoDate: string; // Full ISO date string for sorting
    consumed: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    goals: DailyGoals;
    meals: TrackedMeal[];
}


export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ExtractedMealForReview {
    id: string;
    mealName: string;
    weightGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: MealCategory;
    imageUrl: string;
}