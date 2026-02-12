export const INGREDIENT_TYPES = [
  "Language",
  "Library",
  "Framework",
  "Tool",
  "Resource",
] as const;

export type IngredientType = (typeof INGREDIENT_TYPES)[number];

export type Ingredient = {
  id: string;
  name: string;
  type: IngredientType;
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
