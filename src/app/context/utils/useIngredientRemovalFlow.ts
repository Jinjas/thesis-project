import { useState } from "react";
import { Cocktail, Ingredient } from "../../types";
import {
  buildIngredientRemovalBlockedMessage,
  getActiveCocktailsUsingIngredient,
  type RemoveIngredientResult,
} from "./ingredientRemoval";

type Remover = (id: string) => Promise<RemoveIngredientResult>;

type UseIngredientRemovalFlowParams = {
  cocktails: Cocktail[];
  remIngredient: Remover;
  onRemoveSuccess?: (ingredient: Ingredient) => void;
};

export function useIngredientRemovalFlow({
  cocktails,
  remIngredient,
  onRemoveSuccess,
}: UseIngredientRemovalFlowParams) {
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
  const [isRemoveInfoPopupOpen, setIsRemoveInfoPopupOpen] = useState(false);
  const [pendingIngredient, setPendingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [removeInfoTitle, setRemoveInfoTitle] = useState(
    "Cannot remove ingredient",
  );
  const [removeInfoDescription, setRemoveInfoDescription] = useState("");
  const [removeInfoDetails, setRemoveInfoDetails] = useState<string[]>([]);

  function closeRemovePopup() {
    setIsRemovePopupOpen(false);
  }

  function closeRemoveInfoPopup() {
    setIsRemoveInfoPopupOpen(false);
  }

  function openBlockedInfoPopup(
    ingredientName: string,
    cocktailsUsing: string[],
  ) {
    setRemoveInfoTitle(`Cannot remove ingredient \"${ingredientName}\"`);
    setRemoveInfoDescription(buildIngredientRemovalBlockedMessage());
    setRemoveInfoDetails(cocktailsUsing);
    setIsRemoveInfoPopupOpen(true);
  }

  function requestRemove(ingredient: Ingredient) {
    const activeCocktails = getActiveCocktailsUsingIngredient(
      cocktails,
      ingredient.id,
    );

    if (activeCocktails.length > 0) {
      openBlockedInfoPopup(ingredient.name, activeCocktails);
      return;
    }

    setPendingIngredient(ingredient);
    setIsRemovePopupOpen(true);
  }

  async function confirmRemove() {
    if (!pendingIngredient) return;

    setIsRemovePopupOpen(false);

    const result = await remIngredient(pendingIngredient.id);
    if (result.success) {
      onRemoveSuccess?.(pendingIngredient);
      setPendingIngredient(null);
      return;
    }

    if (result.reason === "ACTIVE_IN_COCKTAILS") {
      openBlockedInfoPopup(pendingIngredient.name, result.cocktails);
      return;
    }

    setRemoveInfoTitle(
      `Cannot remove ingredient \"${pendingIngredient.name}\"`,
    );
    setRemoveInfoDescription(result.message);
    setRemoveInfoDetails([]);
    setIsRemoveInfoPopupOpen(true);
  }

  return {
    pendingIngredient,
    isRemovePopupOpen,
    isRemoveInfoPopupOpen,
    removeInfoTitle,
    removeInfoDescription,
    removeInfoDetails,
    requestRemove,
    confirmRemove,
    closeRemovePopup,
    closeRemoveInfoPopup,
  };
}
