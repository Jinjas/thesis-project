"use client";

import Sidebar from "../../components/Sidebar";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState, useEffect, useRef } from "react";
import IngredientSearch from "../../components/IngredientSearch";
import { Ingredient, INGREDIENT_TYPES, IngredientType } from "../../types";
import Link from "next/link";

export default function CocktailDetailPage() {
  const { id } = useParams();
  const {
    cocktails,
    ingredients,
    addIngredientToCocktail,
    updateIngredientStatus,
  } = useAppContext();

  const cocktail = cocktails.find((c) => c.id === id);
  const router = useRouter();

  const [name, setName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cocktail) {
      setName(cocktail.name);
    }
  }, [cocktail]);

  useEffect(() => {
    if (!cocktail) {
      router.replace("/cocktails");
    }
  }, [cocktail, router]);

  if (!cocktail) return <p className="p-6">Redirecting…</p>;

  function isIngredient(ing: Ingredient | undefined): ing is Ingredient {
    return ing !== undefined;
  }

  const ingredientsFull = Object.entries(cocktail.ingredients)
    //.filter(([_, active]) => active)
    .map(([id]) => ingredients.find((i) => i.id === id))
    .filter(isIngredient);

  const groupedIngredients = INGREDIENT_TYPES.reduce(
    (acc, type) => {
      acc[type] = ingredientsFull.filter((ing) => ing.type === type);
      return acc;
    },
    {} as Record<IngredientType, Ingredient[]>,
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <main className="flex flex-1">
        <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
          <h1 className="text-2xl font-bold pb-1.5">Edit Cocktail: {name}</h1>

          <div>
            <div className="flex flex-row justify-between">
              <h3 className=" p-1 pb-0">Add Ingredient </h3>
              <Link
                href={`/ingredients`}
                className=" bg-gray-700 hover:bg-gray-800 text-white px-2 pt-1 rounded border text-center text-sm"
              >
                New...
              </Link>
            </div>
            <IngredientSearch
              ingredients={ingredients}
              onSelect={(id) => addIngredientToCocktail(cocktail.id, id)}
            />
          </div>

          <div className="pt-2.5">
            <h2 className="font-semibold text-lg">Active Ingredients</h2>

            {INGREDIENT_TYPES.map((type) => {
              const list = groupedIngredients[type];

              return (
                <div key={type} className="pt-1">
                  <h3 className="font-bold">{type}</h3>

                  {list.length === 0 ? (
                    <p className="text-gray-500 text-sm h-[6.5rem]">(none)</p>
                  ) : (
                    <ul
                      className="
                        grid
                        xl:grid-cols-6
                        lg:grid-cols-5
                        md:grid-cols-4
                        sm:grid-cols-2
                        gap-x-6
                        pl-4 pt-1 text-sm
                        h-[6.5rem]
                        overflow-y-auto
                      "
                    >
                      {list.map((ing) => (
                        <li key={ing.id} className="text-sm pb-1">
                          <button
                            className={`block px-2 py-1 rounded ${cocktail.ingredients[ing.id] ? "bg-green-200 hover:bg-green-300" : "bg-red-200 hover:bg-red-300"}`}
                            onClick={() =>
                              updateIngredientStatus(cocktail.id, ing.id)
                            }
                          >
                            {ing.name}
                          </button>
                        </li>
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
