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

export type TableDict = {
  section: string;
  title?: string;
  rows: string[][];
};

export type Ingredient = {
  id: string;
  name: string;
  type: IngredientType;
  characteristics: string;
  extraData: string;
  code: string;
  table: TableDict[];
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
