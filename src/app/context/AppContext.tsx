"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";
import {
  Cocktail,
  Ingredient,
  IngredientType,
  ParamMap,
  TableDict,
} from "../types";
import { INGREDIENTS } from "./data";
import { enqueueCocktailUpdate } from "@/lib/updateQueue";

import { createId } from "./utils/createId";
import { normalizeSvg } from "./utils/svgUtils";
import { resolveIngredients } from "./utils/resolveIngredients";

import { setIngredientCode, getIngredientCode } from "./services/ingredientApi";
import {
  addIngredientToOntology,
  generate,
  getCocktails,
  update,
  prepare,
  remove,
} from "./services/cocktailApi";

type ExtractedIngredient = {
  name: string;
  type?: string;
  active: boolean;
};

type AppContextType = {
  cocktails: Cocktail[];
  ingredients: Ingredient[];

  addIngredient: (name: string, type: IngredientType) => Promise<string>;
  remIngredient(id: string): void;
  updateIngredient: (
    id: string,
    newName: string,
    newType: IngredientType,
    newCode: string,
  ) => Promise<void>;

  addCocktail: (name: string, firstIngredient: string) => Promise<string>;
  addIngredientToCocktail: (
    cocktailId: string,
    ingredientId: string,
  ) => Promise<void>;
  updateIngredientStatus: (
    cocktailId: string,
    ingredientId: string,
  ) => Promise<void>;
  updateOnto: (cocktailId: string, onto: string) => Promise<void>;
  remCocktail(id: string): Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const creatingIngredients = useRef<{ [name: string]: Promise<string> }>({});

  //const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);

  useEffect(() => {
    //getInitialIngredientsCode();
    generateInitialCocktail();
  }, []);

  /* --------------------  INGREDIENT BASED FUNCTIONS  ----------------------*/

  async function getInitialIngredientsCode() {
    for (const ingredient of ingredients) {
      try {
        const data = await getIngredientCode(ingredient.name, ingredient.type);

        setIngredients((prev) =>
          prev.map((c) =>
            c.id === ingredient.id
              ? {
                  ...c,
                  code: data.updatedCode,
                  characteristics: data.updatedCharacteristics,
                  extraData: data.updatedExtraData,
                  table: data.table,
                }
              : c,
          ),
        );
      } catch (err) {
        console.error("error generating onto to", ingredient.id, err);
      }
    }
  }

  async function addIngredient(name: string, type: IngredientType) {
    const id = createId("ingredient", name);

    const ingredient = ingredients.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (ingredient) {
      console.warn(
        `ingredient "${name}" already exists by the name ${ingredient.name}.`,
      );
      return "";
    }

    try {
      const data = await getIngredientCode(name, type);
      setIngredients((prev) => [
        ...prev,
        {
          id: id,
          name,
          type: type,
          characteristics: data.updatedCharacteristics,
          extraData: data.updatedExtraData,
          code: data.updatedCode,
          table: data.table,
        },
      ]);
    } catch (err) {
      console.error("error generating ontology to ", id, err);
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
      const data = await setIngredientCode(newName, newType, newCode);

      setIngredients((prev) =>
        prev.map((ing) =>
          ing.id === id
            ? {
                ...ing,
                name: newName,
                type: newType,
                characteristics: newCode,
                extraData: data.extraData,
                code: data.onto,
                table: data.table,
              }
            : ing,
        ),
      );
    } catch (err) {
      console.error("Error updating ingredient with id: ", id, err);
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

  /* --------------------  COCKTAIL BASED FUNCTIONS  ----------------------*/

  async function generateInitialCocktail() {
    try {
      const data = await getCocktails();

      for (const cocktail of data) {
        const vizValue = normalizeSvg(cocktail.updatedSvg);
        const extractedIngredients: ExtractedIngredient[] =
          cocktail?.ingredients || [];

        const ingredientMap = await resolveIngredients(
          extractedIngredients,
          ingredients,
          creatingIngredients.current,
          addIngredient,
        );

        setCocktails((prev) => [
          ...prev,
          {
            id: createId("cocktail", cocktail.name),
            name: cocktail.name,
            viz: vizValue,
            onto: cocktail.updatedOnto,
            ingredients: ingredientMap,
          },
        ]);
      }
    } catch (err) {
      console.error("Error loading cocktails", err);
    }
  }

  async function addCocktail(name: string, firstIngredient: string) {
    const id = createId("cocktail", name);

    const cocktail = cocktails.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (cocktail) {
      console.warn(`cocktail "${name}" already exists.`);
      return "";
    }

    const ingredient = ingredients.find((i) => i.name === firstIngredient);
    if (!ingredient) {
      console.warn(`Ingredient "${firstIngredient}" not found.`);
      return "";
    }

    try {
      const data = await generate({
        cocktailName: name,
        ingredientName: firstIngredient,
        ingredientType: ingredient.type,
      });

      const vizValue = normalizeSvg(data.updatedViz);

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
    } catch (err) {
      console.error("Error generating viz or onto to: ", id, err);
    }
    return id;
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
        const data = await addIngredientToOntology({
          ingredientName: ingredient.name,
          ingredientType: ingredient.type,
          currentOnto: cocktail.onto,
        });

        const vizValue = normalizeSvg(data.updatedViz);

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
        console.error("error updating ontology", err);
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
    const possible =
      !isActive ||
      Object.values(cocktail.ingredients).filter((v) => v).length > 1;

    if (possible) {
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
          const data = await update({
            ingredientName: ingredient.name,
            ingredientType: ingredient.type,
            active: newStatus,
            currentOnto: cocktail.onto,
          });

          const vizValue = normalizeSvg(data.updatedViz);

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
          console.error("error updating ontology", err);
        }
      });
    }
  }

  async function updateOnto(cocktailId: string, onto: string) {
    const cocktail = cocktails.find((c) => c.id === cocktailId);
    if (!cocktail) return;

    try {
      const data = await prepare({
        currentOnto: onto,
        cocktailName: cocktail.name,
      });

      const vizValue = normalizeSvg(data.updatedViz);

      const extractedIngredients: ExtractedIngredient[] =
        data?.ingredients || [];

      const ingredientMap = await resolveIngredients(
        extractedIngredients,
        ingredients,
        creatingIngredients.current,
        addIngredient,
      );

      setCocktails((prev) =>
        prev.map((c) =>
          c.id === cocktailId
            ? {
                ...c,
                onto: data.updatedOnto,
                viz: vizValue,
                ingredients: ingredientMap,
              }
            : c,
        ),
      );
    } catch (err) {
      console.error("error generating viz or ontology to ", cocktailId, err);
    }
  }

  async function remCocktail(id: string) {
    const cocktailToRemove = cocktails.find((c) => c.id === id);
    if (!cocktailToRemove) return;

    setCocktails((prev) => prev.filter((c) => c.id !== id));

    try {
      await remove({ cocktailName: cocktailToRemove.name });
    } catch (err) {
      console.error("Error removing cocktail with id: ", id, err);
    }
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
        updateOnto,
        remCocktail,
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
