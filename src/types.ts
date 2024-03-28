import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
export interface Recipe {
  category: string;
  cookingTime: number;
  description: string;
  name: string;
  note: string;
  serving: number;
  ingredients: {
    quantity: number;
    name: string;
    unit: string;
  }[];
  steps: {
    stepDescription: string;
    stepPhoto: string;
  }[];
  mainPhoto: string;
  userId: string;
  time: Timestamp;
  recipeId: string;
  id: string;
  refLink: string;
}

export interface CurrentItem {
  name: string;
  mainPhoto: string;
  serving: number;
  description: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  note: string;
  refLink: string;
  category: string;
  cookingTime: number;
  id: string;
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Step {
  stepDescription: string;
  stepPhoto: string;
}

//CookingSchedule

export interface CookingScheduleProps {
  setCookingPlanId: (id: string) => void;
  cookingPlanId: string;
  activeCookingPlan?: CookingPlanData | undefined;
  setActiveCookingPlan: (cookingPlanData: CookingPlanData) => void;
}

export interface MealPlan {
  mealPlan: {
    name: string;
    serving: number;
    unit: string;
  }[];
  planDate: Timestamp;
  userId: string;
}

export interface Accumulator {
  [key: string]: { name: string; serving: number; unit: string };
}

export interface CookingPlanData {
  cookingDate: Timestamp;
  cookingItems: {
    id: string;
    name: string;
    serving: number;
    unit: string;
  }[];
  isActive: boolean;
  mealsStartDate: Timestamp;
  mealsEndDate: Timestamp;
  planId: string;
  userId: string;
}

//AddDailyMeal
export interface AddDailyMealProps {
  user: User | null;
}

export interface PurchasePlan {
  cookingDate: Timestamp;
  items: PurchaseItem[] | [];
  mealsEndDate: Timestamp;
  mealsStartDate: Timestamp;
  test: string;
  userId: string;
  planId: string;
}

export interface PurchaseItem {
  isPurchased: boolean;
  name: string;
  quantity: number;
  responsible: string;
  unit: string;
}

//MealCalendar
export interface DailyMealPlan {
  mealPlan: {
    name: string;
    serving: number;
    unit: string;
  }[];
  planDate: Timestamp;
  userId: string;
  mealId: string;
}

export interface CalerdarContent {
  name: string;
  serving: number;
}
//PurchasingPlan
export interface PurchasePlanProps {
  activeCookingPlan: CookingPlanData | undefined;
  setActiveCookingPlan: (cookingPlanData?: CookingPlanData) => void;
  purchasePlanCollection: PurchasePlan[];
  user: User | null;
}

export interface CookingPlanItem {
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  recipeId: string;
  serving: number;
}

export interface PurchaseList {
  name: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  responsible: string;
}

export interface CookingPlanData {
  cookingDate: Timestamp;
  cookingItems: {
    id: string;
    name: string;
    serving: number;
    unit: string;
  }[];
  isActive: boolean;
  mealsStartDate: Timestamp;
  mealsEndDate: Timestamp;
  planId: string;
  userId: string;
}

//
export interface MenuItem {
  label: string;
  key: string;
}
[];

//
export interface PurchaseDrawerProps {
  setActiveCookingPlan: (cookingPlanData?: CookingPlanData) => void;
  purchasePlanCollection: PurchasePlan[];
  planId: string;
}
//
export interface PurchaseItem {
  isPurchased: boolean;
  name: string;
  quantity: number;
  responsible: string;
  unit: string;
}

export interface PurchasePlan {
  cookingDate: Timestamp;
  items: PurchaseItem[] | [];
  mealsEndDate: Timestamp;
  mealsStartDate: Timestamp;
  test: string;
  userId: string;
  planId: string;
}

export interface ShoppingListProps {
  purchasePlan: PurchasePlan;
  index: number;
}

export interface PartnerType {
  partner1Name: string | null;
  partner1Email: string | null;
  partner2Name: string | null;
  partner2Email: string | null;
}

//ShoppingList
export interface PartnerList {
  label: string;
  key: string;
}
