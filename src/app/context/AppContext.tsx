"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Cocktail, Ingredient, IngredientType } from "../types";

import { INGREDIENTS, COCKTAILS } from "./data";

import { enqueueCocktailUpdate } from "@/lib/updateQueue";

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
  updateOnto: (cocktailId: string, onto: string) => void;
  updateCocktailViz: (cocktailId: string, viz: string) => void;
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

  useEffect(() => {
    async function generateInitialViz() {
      for (const cocktail of cocktails) {
        if (!cocktail.onto) continue;

        try {
          const response = await fetch("/api/ontology/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ onto: cocktail.onto }),
          });

          if (!response.ok) continue;

          const data = await response.json();
          const svg = data?.svg;
          if (typeof svg === "string" && svg.trim().startsWith("<")) {
            const vizValue = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
            setCocktails((prev) =>
              prev.map((c) =>
                c.id === cocktail.id ? { ...c, viz: vizValue } : c,
              ),
            );
          }
        } catch (err) {
          console.error("Erro ao gerar viz inicial para", cocktail.name, err);
        }
      }
    }

    generateInitialViz();
  }, []);

  function addCocktail(name: string) {
    const id = createId("cocktail");
    setCocktails((prev) => [
      ...prev,
      {
        id: id,
        name,
        viz: "OJS.pdf",
        ingredients: {},
        onto: "",
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

  async function updateIngredientStatus(
    cocktailId: string,
    ingredientId: string,
  ) {
    const cocktail = cocktails.find((c) => c.id === cocktailId);
    if (!cocktail) return;

    const ingredient = ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) return;

    const isActive = cocktail.ingredients[ingredientId];
    const newStatus = !isActive;

    setCocktails((prev) =>
      prev.map((c) =>
        c.id === cocktailId
          ? {
              ...c,
              ingredients: {
                ...c.ingredients,
                [ingredientId]: newStatus,
              },
            }
          : c,
      ),
    );

    enqueueCocktailUpdate(cocktailId, async () => {
      try {
        const response = await fetch("/api/ontology/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredientName: ingredient.name,
            ingredientType: ingredient.type,
            active: newStatus,
            currentOnto: cocktail.onto,
          }),
        });

        if (!response.ok) {
          throw new Error("Ontology update failed");
        }

        const data = await response.json();

        const vizValue =
          typeof data.updatedViz === "string" &&
          data.updatedViz.trim().startsWith("<")
            ? `data:image/svg+xml;utf8,${encodeURIComponent(data.updatedViz)}`
            : data.updatedViz;

        setCocktails((prev) =>
          prev.map((c) =>
            c.id === cocktailId
              ? {
                  ...c,
                  onto: data.updatedOnto,
                  viz: vizValue,
                }
              : c,
          ),
        );
      } catch (err) {
        console.error("Erro ao atualizar ontologia", err);
      }
    });
  }

  function updateOnto(cocktailId: string, onto: string) {
    setCocktails((prev) =>
      prev.map((cocktail) => {
        if (cocktail.id !== cocktailId) return cocktail;

        return {
          ...cocktail,
          onto,
        };
      }),
    );
  }

  function updateCocktailViz(cocktailId: string, viz: string) {
    setCocktails((prev) =>
      prev.map((cocktail) => {
        if (cocktail.id !== cocktailId) return cocktail;
        return { ...cocktail, viz };
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
        updateCocktailViz,
        addIngredientToCocktail,
        updateIngredientStatus,
        updateOnto,
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
