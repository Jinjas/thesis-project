"use client";

import { Sidebar, CocktailList, AddItemForm } from "../../components";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { redirect } from "next/navigation";

export default function CocktailsPage() {
  const { cocktails, addCocktail } = useAppContext();

  const [cocktailName, setCocktailName] = useState("");

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex flex-1">
        <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
          <h1 className="text-2xl font-bold">Cocktails</h1>

          <AddItemForm
            value={cocktailName}
            onChange={(e) => setCocktailName(e.target.value)}
            onSubmit={() => {
              if (cocktailName.trim() !== "") {
                const id = addCocktail(cocktailName);
                setCocktailName("");
                redirect(`/cocktails/${id}`);
              }
            }}
            placeholder="Cocktail name..."
            buttonLabel="Add Cocktail"
          />

          <CocktailList cocktails={cocktails} />
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
