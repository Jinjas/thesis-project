"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";

export default function IngredientsPage() {
  const { ingredients, addIngredient } = useAppContext();
  const [name, setName] = useState("");

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Ingredients</h1>

          <ul className="mt-6 space-y-2">
            {ingredients.map((ing) => (
              <li key={ing.id} className="border p-2 rounded">
                {ing.name}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingredient name..."
              className="border p-2 rounded"
            />

            <button
              onClick={() => {
                addIngredient(name);
                setName("");
              }}
              className="bg-black text-white px-4 rounded"
            >
              Add Ingredient
            </button>
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
