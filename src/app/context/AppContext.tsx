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
  updateOnto: (cocktailId: string, onto: string) => Promise<void>;
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
    async function generateInitialCocktail() {
      for (const cocktail of cocktails) {
        if (!cocktail.onto) continue;

        try {
          const response = await fetch("/api/ontology/prepare", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentOnto: cocktail.onto,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            const vizValue =
              typeof data.updatedViz === "string" &&
              data.updatedViz.trim().startsWith("<")
                ? `data:image/svg+xml;utf8,${encodeURIComponent(data.updatedViz)}`
                : data.updatedViz;

            setCocktails((prev) =>
              prev.map((c) =>
                c.id === cocktail.id
                  ? {
                      ...c,
                      onto: data.updatedOnto,
                      viz: vizValue,
                    }
                  : c,
              ),
            );

            const extractedIngredients = data?.ingreds || [];
            console.log("Extracted Ingredients:", extractedIngredients);
            setIngredients((prev) => {
              const existingNames = new Set(prev.map((ing) => ing.name));
              const newIngredientsList = [...prev];
              const ingredientNameToId: { [key: string]: string } = {};

              prev.forEach((ing) => {
                ingredientNameToId[ing.name] = ing.id;
              });

              for (const extracted of extractedIngredients) {
                if (!existingNames.has(extracted.name)) {
                  const newId = `ingredient-${extracted.name}`;
                  ingredientNameToId[extracted.name] = newId;
                  newIngredientsList.push({
                    id: newId,
                    name: extracted.name,
                    type: (extracted.type as IngredientType) || "Language",
                    code: "Please insert code for this ingredient",
                  });
                }
              }

              setCocktails((prevCocktails) =>
                prevCocktails.map((c) => {
                  if (c.id !== cocktail.id) return c;

                  const ingredientMap: { [key: string]: boolean } = {
                    ...c.ingredients,
                  };
                  for (const extracted of extractedIngredients) {
                    const ingredientId = ingredientNameToId[extracted.name];
                    if (ingredientId) {
                      ingredientMap[ingredientId] = extracted.active;
                    }
                  }

                  return { ...c, ingredients: ingredientMap };
                }),
              );

              return newIngredientsList;
            });
          }
        } catch (err) {
          console.error("Error parsing the ontology", cocktail.name, err);
        }
      }
    }

    generateInitialCocktail();
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

  async function updateOnto(cocktailId: string, onto: string) {
    try {
      const response = await fetch("/api/ontology/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentOnto: onto,
        }),
      });

      if (response.ok) {
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

        const extractedIngredients = data?.ingreds || [];
        console.log("Extracted Ingredients:", extractedIngredients);
        setIngredients((prev) => {
          const existingNames = new Set(prev.map((ing) => ing.name));
          const newIngredientsList = [...prev];
          const ingredientNameToId: { [key: string]: string } = {};

          prev.forEach((ing) => {
            ingredientNameToId[ing.name] = ing.id;
          });

          for (const extracted of extractedIngredients) {
            if (!existingNames.has(extracted.name)) {
              const newId = `ingredient-${extracted.name}`;
              ingredientNameToId[extracted.name] = newId;
              newIngredientsList.push({
                id: newId,
                name: extracted.name,
                type: (extracted.type as IngredientType) || "Language",
                code: "Please insert code for this ingredient",
              });
            }
          }

          setCocktails((prevCocktails) =>
            prevCocktails.map((c) => {
              if (c.id !== cocktailId) return c;

              const ingredientMap: { [key: string]: boolean } = {};
              for (const extracted of extractedIngredients) {
                const ingredientId = ingredientNameToId[extracted.name];
                if (ingredientId) {
                  ingredientMap[ingredientId] = extracted.active;
                }
              }

              return { ...c, ingredients: ingredientMap };
            }),
          );

          return newIngredientsList;
        });
      }
    } catch (err) {
      console.error(
        "Erro ao gerar viz ao atualizar onto para",
        cocktailId,
        err,
      );
    }
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
