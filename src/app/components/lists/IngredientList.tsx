"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Ingredient } from "../../types";
import { ActionButton } from "../button";

type Props = {
  ingredients: Ingredient[];
  selectedId: string;
  setId: (value: string) => void;
  remIngredient: (id: string) => void;
};

export default function IngredientList({
  ingredients,
  selectedId,
  setId,
  remIngredient,
}: Props) {
  useEffect(() => {
    if (!selectedId && ingredients.length > 0) {
      setId(ingredients[0].id);
    }
  }, [ingredients, selectedId, setId]);

  return (
    <ul className="overflow-y-auto">
      {ingredients.map((i) => (
        <li key={i.id}>
          <div
            onClick={() => setId(i.id)}
            className={`grid grid-cols-[1fr_1fr_80px] items-center gap-2 py-1 px-2 border-b cursor-pointer
              ${selectedId === i.id ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            <h3 className="font-semibold">{i.name}</h3>

            <h3 className="text-md">{i.type}</h3>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:justify-end">
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  label="Rem"
                  variant="remove2"
                  onClick={() => remIngredient(i.id)}
                />
              </div>

              <Link
                href={`/ingredients/${i.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded border text-center"
              >
                Edit
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
