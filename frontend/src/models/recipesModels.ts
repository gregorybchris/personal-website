export interface Recipe {
  name: string;
  slug: string;
  bigoven_link: string;
  recipe_type: RecipeType;
  food_type: FoodType;
  origin: string;
  prep_time: string;
  serves: number;
  archived: boolean;
  ingredients: Ingredient[];
  instructions?: string;
  notes?: string;
}

export type RecipeType = "dessert" | "main" | "side" | "snack" | "drink";
export type FoodType =
  | "shrimp"
  | "cookie"
  | "fork-knife"
  | "knife"
  | "baked"
  | "bowl"
  | "fish";

export interface Ingredient {
  name: string;
  amount?: number;
  units?: Unit;
  notes?: string;
}

export type Unit = "cup" | "tbsp" | "tsp" | "oz" | "lb" | "g" | "kg" | "ml";
