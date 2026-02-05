"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function Sidebar() {
  const { cocktails, ingredients } = useAppContext();

  return (
    <aside className="w-40 bg-gray-900 text-white px-4 py-6 flex flex-col">
      <div className=" h-1/4 flex flex-col pb-4">
        <Link
          href="/cocktails"
          className="font-semibold hover:bg-gray-700 rounded"
        >
          Cocktails
        </Link>
        <ul className="pt-1 overflow-y-scroll h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-600 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
          {cocktails.map((c) => (
            <li key={c.id} className="px-1">
              <Link
                href={`/cocktails/${c.id}`}
                className="block hover:bg-gray-700 py-1 px-1 rounded border-b border-gray-500 text-sm"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className=" h-3/4 flex flex-col">
        <Link
          href="/ingredients"
          className="font-semibold hover:bg-gray-700 rounded"
        >
          Ingredients
        </Link>
        <ul className="pt-1 overflow-y-scroll h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-600 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
          {ingredients.map((i) => (
            <li key={i.id} className="px-1">
              <Link
                href={`/ingredients/${i.id}`}
                className="block hover:bg-gray-700 py-1 px-1 rounded border-b border-gray-500 text-sm"
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
