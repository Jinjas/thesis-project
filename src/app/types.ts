export const INGREDIENT_TYPES = [
  "Language",
  "Library",
  "Framework",
  "Tool",
] as const;

export const INGREDIENT_TYPES_AVAILABLE = [
  "Language",
  "Library",
  "Framework",
  "Tool",
  "UNDEFINED",
] as const;

export type IngredientType = (typeof INGREDIENT_TYPES_AVAILABLE)[number];

export type Ingredient = {
  id: string;
  name: string;
  type: IngredientType;
  characteristics: string;
  code: string;
};

export type ParamMap = {
  [key: string]: boolean;
};

export type Cocktail = {
  id: string;
  name: string;
  viz: string;
  ingredients: ParamMap;
  onto: string;
};
