"use client";

import {
  IngredientSearch,
  IngredientGroups,
  ImportButton,
  ExportButton,
} from "../../../components";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import { useEffect, useState } from "react";
import {
  Ingredient,
  INGREDIENT_TYPES,
  IngredientType,
  TableDict,
} from "../../../types";
import Link from "next/link";
import { DoubleSectionLayout } from "../../../layouts";
import { buildCocktailTable } from "../../../context/utils/cocktailTable";

const EXPORT_OPTIONS = [
  { value: "txt", label: "OntoDL (.txt)" },
  { value: "ontodl", label: "OntoDL (.ontodl)" },
  { value: "csv", label: "Table (.csv)" },
  { value: "xls", label: "Table (.xls)" },
  { value: "svg", label: "Visualization (.svg)" },
  { value: "jpeg", label: "Visualization (.jpeg)" },
  { value: "png", label: "Visualization (.png)" },
  { value: "pdf", label: "Visualization (.pdf)" },
] as const;

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
  const [exportTable, setExportTable] = useState<TableDict[]>([]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      if (!cocktail) {
        setExportTable([]);
        return;
      }

      const table = await buildCocktailTable(cocktail, ingredients);
      if (!cancelled) setExportTable(table);
    }

    void loadTable();

    return () => {
      cancelled = true;
    };
  }, [cocktail, ingredients]);

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

            <ExportButton
              code={cocktail.onto}
              filename={name || "cocktail"}
              options={EXPORT_OPTIONS}
              table={exportTable}
              viz={cocktail.viz}
            />
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
