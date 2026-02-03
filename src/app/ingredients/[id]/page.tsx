"use client";

import { useParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { IngredientType } from "../../types";
import TypeSelector from "../../components/TypeSelector";
import CodePreview from "../../components/CodeEdit";
import Sidebar from "../../components/Sidebar";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, updateIngredient } = useAppContext();
  const ingredient = ingredients.find((i) => i.id === id);
  if (!ingredient) return <p>Ingredient not found</p>;

  const [name, setName] = useState(ingredient.name);
  const [type, setType] = useState<IngredientType>(ingredient.type);
  const [code, setCode] = useState(ingredient.code);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-between ">
          <h1 className="text-2xl font-bold">Edit Ingredient</h1>

          <div className="mt-2 space-y-2">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
              <h3 className="pl-2 md:p-2 md:pr-1 md:w-[134px]">
                Ingredient Name
              </h3>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-1 pl-2 rounded w-full md:w-[calc(100%-150px)]"
              />
            </div>

            <div className="mt-6">
              <label className="font-semibold">Ingredient Type</label>
              <TypeSelector value={type} onChange={setType} />
            </div>

            <CodePreview code={code} setCode={setCode} />
            <button
              onClick={() => updateIngredient(ingredient.id, name, type, code)}
              className="mt-6 bg-black text-white px-4 py-2 rounded"
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
