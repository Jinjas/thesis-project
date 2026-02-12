"use client";

import { useState } from "react";
import { Sidebar, IngredientList, AddItemForm } from "../../components";
import { useAppContext } from "../../context/AppContext";
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

          <AddItemForm
            value={name}
            onChange={(e) => setName(e.target.value)}
            onSubmit={() => {
              if (name.trim() !== "") {
                const id = addIngredient(name);
                setName("");
                redirect(`/ingredients/${id}`);
              }
            }}
            placeholder="Ingredient name..."
            buttonLabel="Add Ingredient"
          />

          <IngredientList ingredients={ingredients} />
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
