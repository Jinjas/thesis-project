"use client";

import Link from "next/link";
import { Ingredient } from "../../types";

type Props = {
  ingredients: Ingredient[];
};

export default function IngredientList({ ingredients }: Props) {
  return (
    <ul className="pt-4 overflow-y-auto">
      {ingredients.map((i) => (
        <li key={i.id}>
          <div className="grid grid-cols-[1fr_1fr_80px] items-center gap-2 py-1 px-2 border-b">
            <h3 className="font-semibold">{i.name}</h3>

            <h3 className="text-md">{i.type}</h3>

            <Link
              href={`/ingredients/${i.id}`}
              className=" bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded border text-center cursor-pointer"
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
