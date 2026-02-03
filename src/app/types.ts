export const INGREDIENT_TYPES = [
  "Language",
  "Library",
  "Tool",
  "Framework",
] as const;

export type IngredientType = (typeof INGREDIENT_TYPES)[number];

export type Ingredient = {
  id: string;
  name: string;
  type: IngredientType;
  code: string;
};

export type Cocktail = {
  id: string;
  name: string;
  activeIngredients: string[];
  inactiveIngredients: string[];
};
