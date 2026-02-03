"use client";

import Sidebar from "../components/Sidebar";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Ingredient } from "../types";
export default function CocktailsPage() {
  const { cocktails, addCocktail, ingredients, addIngredientToCocktail } =
    useAppContext();

  const [cocktailName, setCocktailName] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState("");

  function getIngredient(): Ingredient | undefined {
    return ingredients.find((i) => i.id === selectedIngredientId);
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Cocktails</h1>
          <div className="flex gap-2 mt-4">
            <input
              value={cocktailName}
              onChange={(e) => setCocktailName(e.target.value)}
              placeholder="Cocktail name..."
              className="border p-2 rounded"
            />

            <button
              onClick={() => {
                addCocktail(cocktailName);
                setCocktailName("");
              }}
              className="bg-black text-white px-4 rounded"
            >
              Add Cocktail
            </button>
          </div>

          <div className="mt-6">
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select ingredient...</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
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
