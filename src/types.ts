import type { UploadFile } from "antd/es/upload";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
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
  activeCookingPlan: CookingPlanData | undefined;
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

export interface NewPlan {
  cookingDate: Date | undefined;
  cookingItems?: {
    name: string;
    serving: number;
    unit: string;
  }[];
  userId: string | undefined;
  mealsStartDate: Date | null | undefined;
  mealsEndDate: Date | null | undefined;
  isActive: boolean;
  items?: PurchaseList[];
  planId?: string | undefined;
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
  purchasePlanCollection: PurchasePlan[];
  activeCookingPlan: CookingPlanData | undefined;
  setPurchasePlanCollection: Dispatch<SetStateAction<PurchasePlan[]>>;
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

export interface activePlanIngredients {
  name: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  responsible: string;
}

//
export interface MenuItem {
  label: string;
  key: string;
}
[];

export interface SelectedMenu {
  selectedDish: string;
  selectedTime: Timestamp | null;
  selectedQty: string;
  items: MenuItem[];
  newMealId: string;
}

interface Meal {
  name: string;
  serving: number;
  unit: string;
  id: string;
}

export interface MealPlanData {
  mealPlan: Meal[];
  planDate: Timestamp | null;
  userId: string | undefined;
}

export interface SetMenuStateFunction {
  (updateFn: (prevState: SelectedMenu) => SelectedMenu): void;
}

//
export interface PurchaseDrawerProps {
  purchasePlanCollection: PurchasePlan[];
  planId: string;
  setPurchasePlanCollection: Dispatch<SetStateAction<PurchasePlan[]>>;
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

//RecipeDawer

export interface RecipeDawerPrps {
  currentItem: CurrentItem | undefined;
  setOpen: (arg0: boolean) => void;
  open: boolean;
}

export interface RecipeModalPrps {
  currentItem?: CurrentItem;
  setMainPhoto: (arg0: string) => void;
}

export interface FileListObject {
  fileList: UploadFile[];
}

export interface PartnersType {
  name: string;
  partners: string[];
  uid: string;
}
