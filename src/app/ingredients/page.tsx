"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function IngredientsPage() {
  const { ingredients, addIngredient } = useAppContext();
  const [name, setName] = useState("");

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
          <h1 className="text-2xl font-bold ">Ingredients</h1>

          <div className="flex gap-2 pt-4 w-full">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingredient name..."
              className="border p-2 rounded flex-1 "
            />

            <button
              onClick={() => {
                if (name.trim() !== "") {
                  const id = addIngredient(name);
                  setName("");
                  redirect(`/ingredients/${id}`);
                }
              }}
              className="block bg-gray-700 hover:bg-gray-800 text-white px-4 rounded"
            >
              Add Ingredient
            </button>
          </div>

          <ul className="space-y-1 pt-4">
            {ingredients.map((i) => (
              <li key={i.id}>
                <Link
                  href={`/ingredients/${i.id}`}
                  className="flex hover:bg-gray-700 px-2 py-1 rounded border text-center"
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
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
