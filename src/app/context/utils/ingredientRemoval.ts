import { Cocktail } from "../../types";

export type RemoveIngredientResult =
  | {
      success: true;
      ingredientName: string;
    }
  | {
      success: false;
      reason: "ACTIVE_IN_COCKTAILS";
      message: string;
      cocktails: string[];
    }
  | {
      success: false;
      reason: "NOT_FOUND" | "REMOVE_FAILED";
      message: string;
    };

export function getActiveCocktailsUsingIngredient(
  cocktails: Cocktail[],
  ingredientId: string,
): string[] {
  return cocktails
    .filter((cocktail) => cocktail.ingredients[ingredientId])
    .map((cocktail) => cocktail.name);
}

export function buildIngredientRemovalBlockedMessage(): string {
  return "This ingredient is active in one or more cocktails and cannot be removed.";
}
