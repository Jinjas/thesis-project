"use client";

import { createContext, useContext, useState } from "react";
import { Cocktail, Ingredient, IngredientType } from "../types";

type AppContextType = {
  cocktails: Cocktail[];
  ingredients: Ingredient[];

  addCocktail: (name: string) => void;
  addIngredient: (name: string) => void;

  updateIngredient: (
    id: string,
    newName: string,
    newType: IngredientType,
  ) => void;

  addIngredientToCocktail: (cocktailId: string, ingredientId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  function addCocktail(name: string) {
    setCocktails((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        activeIngredients: [],
        inactiveIngredients: [],
      },
    ]);
  }

  function addIngredient(name: string) {
    setIngredients((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        type: "Language",
      },
    ]);
  }

  function updateIngredient(
    id: string,
    newName: string,
    newType: IngredientType,
  ) {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id ? { ...ing, name: newName, type: newType } : ing,
      ),
    );
  }

  function addIngredientToCocktail(cocktailId: string, ingredientId: string) {
    setCocktails((prev) =>
      prev.map((cocktail) => {
        if (cocktail.id !== cocktailId) return cocktail;

        if (cocktail.activeIngredients.includes(ingredientId)) return cocktail;

        return {
          ...cocktail,
          activeIngredients: [...cocktail.activeIngredients, ingredientId],
        };
      }),
    );
  }

  return (
    <AppContext.Provider
      value={{
        cocktails,
        ingredients,
        addCocktail,
        addIngredient,
        updateIngredient,
        addIngredientToCocktail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
