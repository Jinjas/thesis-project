"use client";

import { useParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { IngredientType } from "../../types";
import TypeSelector from "../../components/TypeSelector";
import CodeEdit from "../../components/CodeEdit";
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
        <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
          <h1 className="text-2xl font-bold pb-4">Edit Ingredient</h1>

          <div className="flex flex-col xl:flex-row gap-2 xl:gap-4 max-w-[493px]">
            <h3 className=" xl:p-2 xl:pr-1 xl:w-[50px] ">Name:</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-1 pl-2 rounded lg:w-[calc(100%-150px)]"
            />
          </div>

          <div className="pt-2 flex flex-col xl:flex-row gap-2 xl:gap-4 max-w-[493px]">
            <label className="xl:p-2 xl:pr-1 xl:w-[50px]">Type:</label>

            <TypeSelector value={type} onChange={setType} />
          </div>

          <div className="pt-2 pb-4 flex flex-col h-full">
            <h3 className="font-semibold pb-2"> OntoDL</h3>

            <CodeEdit code={code} setCode={setCode} />
          </div>

          <button
            onClick={() => updateIngredient(ingredient.id, name, type, code)}
            className="pt-2 bg-black text-white px-4 py-2 rounded w-min"
          >
            Save
          </button>
        </section>

        <section className="flex-1 p-10 bg-white text-black border-l border-gray-300 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold pb-4">Conteúdo</h2>

          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      </main>
    </div>
  );
}
