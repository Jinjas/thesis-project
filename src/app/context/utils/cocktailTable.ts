import type { Cocktail, Ingredient, TableDict } from "../../types";
import { getCocktailTable } from "../services/ingredientApi";

export async function buildCocktailTable(
  cocktail: Pick<Cocktail, "ingredients">,
  ingredients: Ingredient[],
): Promise<TableDict[]> {
  const activeIngredientNames = ingredients
    .filter((ingredient) => cocktail.ingredients[ingredient.id])
    .map((ingredient) => ingredient.name);

  if (activeIngredientNames.length === 0) return [];

  const result = await getCocktailTable({
    ingredientNames: activeIngredientNames,
  });
  return result.table;
}
