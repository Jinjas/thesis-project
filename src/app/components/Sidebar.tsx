"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

export default function Sidebar() {
  const { cocktails, ingredients } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative
        bg-gray-900 text-white
        py-6
        flex flex-col
        transition-all duration-300
        ${collapsed ? "w-2 px-2" : "w-40 px-4"}
      `}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className=" absolute top-1/2 -right-3 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
      >
        {collapsed ? "›" : "‹"}
      </button>

      {!collapsed && (
        <div className="h-1/4 flex flex-col pb-4">
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
      )}

      {!collapsed && (
        <div className="h-3/4 flex flex-col">
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
      )}
    </aside>
  );
}
