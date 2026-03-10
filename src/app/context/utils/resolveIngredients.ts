import { Ingredient, IngredientType, ParamMap } from "../../types";

type ExtractedIngredient = {
  name: string;
  type?: string;
  active: boolean;
};

type CreatingIngredients = {
  [name: string]: Promise<string>;
};

export async function resolveIngredients(
  extractedIngredients: ExtractedIngredient[],
  ingredients: Ingredient[],
  creatingIngredients: CreatingIngredients,
  addIngredient: (name: string, type: IngredientType) => Promise<string>,
): Promise<ParamMap> {
  const newIngredients = extractedIngredients.filter(
    (extracted) => !ingredients.some((i) => i.name === extracted.name),
  );

  const createdIds: { [name: string]: string } = {};
  const ingredientMap: ParamMap = {};

  await Promise.all(
    newIngredients.map(async (extracted) => {
      if (!creatingIngredients[extracted.name]) {
        creatingIngredients[extracted.name] = addIngredient(
          extracted.name,
          (extracted.type as IngredientType) || "Language",
        );
      }

      const id = await creatingIngredients[extracted.name];
      createdIds[extracted.name] = id;
    }),
  );

  for (const extracted of extractedIngredients) {
    const existing = ingredients.find((i) => i.name === extracted.name);

    const ingredientId = existing?.id || createdIds[extracted.name];

    if (ingredientId) {
      ingredientMap[ingredientId] = extracted.active;
    }
  }

  return ingredientMap;
}
