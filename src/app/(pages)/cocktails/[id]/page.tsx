"use client";

import {
  Sidebar,
  IngredientSearch,
  IngredientGroups,
  VizBar,
  ImportButton,
  ExportButton,
} from "../../../components";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect } from "react";
import { Ingredient, INGREDIENT_TYPES, IngredientType } from "../../../types";
import Link from "next/link";
import { DoubleSectionLayout } from "../../../layouts";

export default function CocktailDetailPage() {
  const { id } = useParams();
  const {
    cocktails,
    ingredients,
    addIngredientToCocktail,
    updateIngredientStatus,
    updateOnto,
  } = useAppContext();

  const cocktail = cocktails.find((c) => c.id === id);
  const router = useRouter();

  const [name, setName] = useState("");

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
    <DoubleSectionLayout
      title={`Edit Cocktail: ${name}`}
      typeOf2="cocktailDetail"
      withViz={true}
    >
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
        <div className="pt-1 flex justify-between">
          <h2 className="font-semibold text-lg">Active Ingredients</h2>

          <div className="flex gap-2">
            <ImportButton func={(onto) => updateOnto(cocktail.id, onto)} />

            <ExportButton code={cocktail.onto} filename={name || "cocktail"} />
          </div>
        </div>

        <IngredientGroups
          groupedIngredients={groupedIngredients}
          cocktail={cocktail}
          updateIngredientStatus={updateIngredientStatus}
        />
      </div>
    </DoubleSectionLayout>
  );
}
