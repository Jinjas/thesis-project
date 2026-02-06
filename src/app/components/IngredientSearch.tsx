"use client";

/*usage:

  <IngredientSearch
      ingredients={ingredients}
      onSelect={(id) => addIngredientToCocktail(cocktail.id, id)}
  />
*/

import { useState, useMemo } from "react";
import { Ingredient } from "../types";

type Props = {
  ingredients: Ingredient[];
  onSelect: (id: string) => void;
};

export default function IngredientSearch({ ingredients, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => {
    if (!query) return [];
    return ingredients.filter((i) =>
      i.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, ingredients]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filtered[highlight];
      if (!selected) return;

      onSelect(selected.id);
      setQuery("");
      setHighlight(0);
    }
  }

  return (
    <div className="relative w-full pl-1 pt-1">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlight(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder="ingredient Long Name..."
        className="border p-1 pl-2 rounded w-full text-sm"
      />

      {filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded border bg-white shadow">
          {filtered.map((ing, i) => (
            <li
              key={ing.id}
              onMouseDown={() => {
                onSelect(ing.id);
                setQuery("");
                setHighlight(0);
              }}
              className={`px-2 py-1 cursor-pointer text-sm
                ${
                  i === highlight
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {ing.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
