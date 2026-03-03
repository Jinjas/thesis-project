"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Cocktail, Ingredient, IngredientType } from "../types";

import { INGREDIENTS, COCKTAILS } from "./data";

import { enqueueCocktailUpdate } from "@/lib/updateQueue";

type ExtractedIngredient = {
  name: string;
  type?: string;
  active: boolean;
};

type AppContextType = {
  cocktails: Cocktail[];
  ingredients: Ingredient[];

  addCocktail: (name: string, firstIngred: string) => Promise<string>;
  addIngredient: (name: string, type: IngredientType) => Promise<string>;
  remIngredient(id: string): void;

  updateIngredient: (
    id: string,
    newName: string,
    newType: IngredientType,
    newCode: string,
  ) => Promise<void>;

  addIngredientToCocktail: (
    cocktailId: string,
    ingredientId: string,
  ) => Promise<void>;
  updateIngredientStatus: (
    cocktailId: string,
    ingredientId: string,
  ) => Promise<void>;
  updateOnto: (cocktailId: string, onto: string) => Promise<void>;
  updateCocktailViz: (cocktailId: string, viz: string) => void;
};

function createId(prefix: string, name: string) {
  return `${prefix}-${name}`;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // para fazer de raiz sem dados iniciais
  //const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  //const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const creatingIngredients: { [name: string]: Promise<string> } = {};

  const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS);
  const [cocktails, setCocktails] = useState<Cocktail[]>(COCKTAILS);

  useEffect(() => {
    getInicialIngredientsCode();
    generateInitialCocktail();
  }, []);

  async function getInicialIngredientsCode() {
    console.log(ingredients);
    for (const ingredient of ingredients) {
      try {
        const response = await fetch("/api/ingredientCode/getIngredientCode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredientName: ingredient.name,
            ingredientType: ingredient.type,
          }),
        });
        if (response.ok) {
          const data = await response.json();

          setIngredients((prev) =>
            prev.map((c) =>
              c.id === ingredient.id
                ? {
                    ...c,
                    code: data.updatedCode,
                    carac: data.updatedCarac,
                  }
                : c,
            ),
          );
        }
      } catch (err) {
        console.error("Erro ao gerar onto para", ingredient.id, err);
      }
    }
  }

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

        if (!response.ok) continue;

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

        const extractedIngredients: ExtractedIngredient[] = data?.ingreds || [];

        console.log("Extracted Ingredients:", extractedIngredients);

        const newIngredients = extractedIngredients.filter(
          (extracted) => !ingredients.some((i) => i.name === extracted.name),
        );

        const createdIds: { [name: string]: string } = {};

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

        setCocktails((prevCocktails) =>
          prevCocktails.map((c) => {
            if (c.id !== cocktail.id) return c;

            const ingredientMap: Record<string, boolean> = {
              ...c.ingredients,
            };

            for (const extracted of extractedIngredients) {
              const existing = ingredients.find(
                (i) => i.name === extracted.name,
              );

              const ingredientId = existing?.id || createdIds[extracted.name];

              if (ingredientId) {
                ingredientMap[ingredientId] = extracted.active;
              }
            }

            return { ...c, ingredients: ingredientMap };
          }),
        );
      } catch (err) {
        console.error("Error parsing the ontology", cocktail.name, err);
      }
    }
  }

  async function addCocktail(name: string, firstIngred: string) {
    const id = createId("cocktail", name);

    const ingredient = ingredients.find((i) => i.name === firstIngred);
    if (!ingredient) {
      console.warn(
        `Ingredient "${firstIngred}" not found. Cocktail will be created without it.`,
      );
      return "";
    }

    try {
      const response = await fetch("/api/ontology/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cocktailName: name,
          ingredientName: firstIngred,
          ingredientType: ingredient.type,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const vizValue =
          typeof data.updatedViz === "string" &&
          data.updatedViz.trim().startsWith("<")
            ? `data:image/svg+xml;utf8,${encodeURIComponent(data.updatedViz)}`
            : data.updatedViz;
        setCocktails((prev) => [
          ...prev,
          {
            id: id,
            name,
            viz: vizValue,
            ingredients: { [ingredient.id]: true },
            onto: data.updatedOnto,
          },
        ]);
      }
    } catch (err) {
      console.error("Erro ao gerar viz ou ao atualizar onto para", id, err);
    }
    return id;
  }

  async function addIngredient(name: string, type: IngredientType) {
    const id = createId("ingredient", name);

    try {
      const response = await fetch("/api/ingredientCode/getIngredientCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientName: name,
          ingredientType: type,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setIngredients((prev) => [
          ...prev,
          {
            id: id,
            name,
            type: type,
            carac: data.updatedCarac,
            code: data.updatedCode,
          },
        ]);
      }
    } catch (err) {
      console.error("Erro ao gerar onto para", id, err);
    }

    return id;
  }

  async function updateIngredient(
    id: string,
    newName: string,
    newType: IngredientType,
    newCode: string,
  ) {
    try {
      const response = await fetch("/api/ingredientCode/setIngredientCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientName: newName,
          ingredientType: newType,
          newCode: newCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.id === id
              ? {
                  ...ing,
                  name: newName,
                  type: newType,
                  carac: newCode,
                  code: data.onto,
                }
              : ing,
          ),
        );
      }
    } catch (err) {
      console.error("Erro ao gerar viz ou ao atualizar onto para", id, err);
    }
    return;
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

  async function addIngredientToCocktail(
    cocktailId: string,
    ingredientId: string,
  ) {
    const cocktail = cocktails.find((c) => c.id === cocktailId);
    if (!cocktail) return;

    const ingredient = ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) return;

    if (ingredientId in cocktail.ingredients) {
      if (!cocktail.ingredients[ingredientId]) {
        updateIngredientStatus(cocktailId, ingredientId);
      }
      return;
    }

    setCocktails((prev) =>
      prev.map((c) =>
        c.id === cocktailId
          ? {
              ...c,
              ingredients: {
                ...c.ingredients,
                [ingredientId]: true,
              },
            }
          : c,
      ),
    );
    enqueueCocktailUpdate(cocktailId, async () => {
      try {
        const response = await fetch("/api/ontology/addIngred", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredientName: ingredient.name,
            ingredientType: ingredient.type,
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

      if (!response.ok) return;

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

      const extractedIngredients: ExtractedIngredient[] = data?.ingreds || [];
      console.log("Extracted Ingredients:", extractedIngredients);

      const newIngredients = extractedIngredients.filter(
        (extracted) => !ingredients.some((i) => i.name === extracted.name),
      );

      const createdIds: { [name: string]: string } = {};

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

      setIngredients((prev) => {
        const ingredientNameToId: { [key: string]: string } = {};

        prev.forEach((ing) => {
          ingredientNameToId[ing.name] = ing.id;
        });

        Object.assign(ingredientNameToId, createdIds);

        return prev;
      });

      setCocktails((prevCocktails) =>
        prevCocktails.map((c) => {
          if (c.id !== cocktailId) return c;

          const ingredientMap: { [key: string]: boolean } = {};

          for (const extracted of extractedIngredients) {
            const existing = ingredients.find((i) => i.name === extracted.name);

            const ingredientId = existing?.id || createdIds[extracted.name];

            if (ingredientId) {
              ingredientMap[ingredientId] = extracted.active;
            }
          }

          return { ...c, ingredients: ingredientMap };
        }),
      );
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
