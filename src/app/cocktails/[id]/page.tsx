"use client";

import Sidebar from "../../components/Sidebar";

import { useParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";

import { Ingredient, INGREDIENT_TYPES, IngredientType } from "../../types";

export default function CocktailDetailPage() {
  const { id } = useParams();
  const { cocktails, ingredients, addIngredientToCocktail } = useAppContext();
  const cocktail = cocktails.find((c) => c.id === id);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  if (!cocktail) return <p>Cocktail not found</p>;
  function isIngredient(ing: Ingredient | undefined): ing is Ingredient {
    return ing !== undefined;
  }

  const activeIngredientsFull = cocktail.activeIngredients
    .map((id) => ingredients.find((i) => i.id === id))
    .filter(isIngredient);

  const groupedIngredients = INGREDIENT_TYPES.reduce(
    (acc, type) => {
      acc[type] = activeIngredientsFull.filter((ing) => ing.type === type);
      return acc;
    },
    {} as Record<IngredientType, Ingredient[]>,
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-center">
          <h1 className="text-2xl font-bold">{cocktail.name}</h1>
          <div className="mt-4 flex gap-2">
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select ingredient...</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                addIngredientToCocktail(cocktail.id, selectedIngredient)
              }
              className="bg-black text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-lg">Active Ingredients</h2>

            {INGREDIENT_TYPES.map((type) => {
              const list = groupedIngredients[type];

              return (
                <div key={type} className="mt-4">
                  <h3 className="font-bold">{type}</h3>

                  {list.length === 0 ? (
                    <p className="text-gray-500 text-sm">(none)</p>
                  ) : (
                    <ul className="list-disc ml-6">
                      {list.map((ing) => (
                        <li key={ing.id}>{ing.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex-1 p-10 bg-white text-black border-l border-gray-300 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Conteúdo</h2>
          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      </main>
    </div>
  );
}
