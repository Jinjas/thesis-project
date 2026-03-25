"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Ingredient } from "../../types";

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
            className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 py-1 px-2 border-b cursor-pointer
              ${selectedId === i.id ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            <h3 className="font-semibold min-w-0 truncate">{i.name}</h3>

            <h3 className="text-md min-w-0 truncate">{i.type}</h3>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/ingredients/${i.id}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Edit ${i.name}`}
                title={`Edit ${i.name}`}
                className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded border text-center inline-flex items-center justify-center"
              >
                <Pencil size={16} />
              </Link>
              <button
                onClick={() => remIngredient(i.id)}
                aria-label={`Remove ${i.name}`}
                title={`Remove ${i.name}`}
                className="bg-red-800 hover:bg-red-950 text-white p-2 rounded border cursor-pointer inline-flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
