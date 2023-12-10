import { Timestamp } from "firebase/firestore";
export interface Recipe {
  category: string;
  cookingTime: number;
  description: string;
  name: string;
  note: string;
  searving: number;
  ingredients: {
    qty: number;
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
  searving: number;
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
  qty: number;
  unit: string;
}

interface Step {
  stepDescription: string;
  stepPhoto: string;
}
