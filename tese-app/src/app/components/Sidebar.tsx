"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function Sidebar() {
  const { cocktails, ingredients } = useAppContext();

  return (
    <aside className="w-28 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <div>
        <Link href="/cocktails" className="font-semibold hover:text-gray-300">
          Cocktails
        </Link>

        <ul className="space-y-1">
          {cocktails.map((c) => (
            <li key={c.id}>
              <Link
                href={`/cocktails/${c.id}`}
                className="block hover:bg-gray-700 px-2 py-1 rounded"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Link href="/ingredients" className="font-semibold hover:text-gray-300">
          Ingredients
        </Link>
        <ul className="space-y-1">
          {ingredients.map((i) => (
            <li key={i.id}>
              <Link
                href={`/ingredients/${i.id}`}
                className="block hover:bg-gray-700 px-2 py-1 rounded"
              >
                {i.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
