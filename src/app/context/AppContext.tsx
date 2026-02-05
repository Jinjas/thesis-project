"use client";

import { createContext, useContext, useState } from "react";
import { Cocktail, Ingredient, IngredientType } from "../types";

import { INGREDIENTS, COCKTAILS } from "./data";

type AppContextType = {
  cocktails: Cocktail[];
  ingredients: Ingredient[];

  addCocktail: (name: string) => string;
  addIngredient: (name: string) => string;
  remIngredient(id: string): void;

  updateIngredient: (
    id: string,
    newName: string,
    newType: IngredientType,
    newCode: string,
  ) => void;

  addIngredientToCocktail: (cocktailId: string, ingredientId: string) => void;
  updateIngredientStatus: (cocktailId: string, ingredientId: string) => void;
};

function createId(prefix: string) {
  return `${prefix}-${performance.now().toFixed(0)}`;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // para fazer de raiz sem dados iniciais
  //const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  //const [cocktails, setCocktails] = useState<Cocktail[]>([]);

  const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS);
  const [cocktails, setCocktails] = useState<Cocktail[]>(COCKTAILS);

  function addCocktail(name: string) {
    const id = createId("cocktail");
    setCocktails((prev) => [
      ...prev,
      {
        id: id,
        name,
        ingredients: {},
      },
    ]);
    return id;
  }

  function addIngredient(name: string) {
    const id = createId("ingredient");
    setIngredients((prev) => [
      ...prev,
      {
        id: id,
        name,
        type: "Language",
        code: "",
      },
    ]);
    return id;
  }

  function updateIngredient(
    id: string,
    newName: string,
    newType: IngredientType,
    newCode: string,
  ) {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? { ...ing, name: newName, type: newType, code: newCode }
          : ing,
      ),
    );
  }

  function remIngredient(id: string) {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));

    setCocktails((prev) =>
      prev.map((c) => ({
        ...c,
        ingredients: Object.fromEntries(
          Object.entries(c.ingredients).filter(([ingId]) => ingId !== id),
        ),
      })),
    );
  }

  function addIngredientToCocktail(cocktailId: string, ingredientId: string) {
    setCocktails((prev) =>
      prev.map((cocktail) => {
        if (cocktail.id !== cocktailId) return cocktail;

        if (cocktail.ingredients[ingredientId]) return cocktail;

        return {
          ...cocktail,
          ingredients: {
            ...cocktail.ingredients,
            [ingredientId]: true,
          },
        };
      }),
    );
  }

  function updateIngredientStatus(cocktailId: string, ingredientId: string) {
    setCocktails((prev) =>
      prev.map((cocktail) => {
        if (cocktail.id !== cocktailId) return cocktail;

        if (cocktail.ingredients[ingredientId])
          return {
            ...cocktail,
            ingredients: {
              ...cocktail.ingredients,
              [ingredientId]: false,
            },
          };

        return {
          ...cocktail,
          ingredients: {
            ...cocktail.ingredients,
            [ingredientId]: true,
          },
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
        remIngredient,
        updateIngredient,
        addIngredientToCocktail,
        updateIngredientStatus,
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
