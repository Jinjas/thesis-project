"use client";

import { useParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { INGREDIENT_TYPES, IngredientType } from "../../types";
import Sidebar from "../../components/Sidebar";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, updateIngredient } = useAppContext();

  const ingredient = ingredients.find((i) => i.id === id);

  if (!ingredient) return <p>Ingredient not found</p>;

  const [name, setName] = useState(ingredient.name);
  const [type, setType] = useState<IngredientType>(ingredient.type);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Edit Ingredient</h1>

          <div className="mt-4 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as IngredientType)}
              className="border p-2 rounded w-full"
            >
              {INGREDIENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => updateIngredient(ingredient.id, name, type)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Save
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
