"use client";

import { IngredientType } from "@/app/types";
/*usage:

  <genericSearch
      elements={elements}
      onSelect={(value) => newValue = value}
  />
*/

import { useState, useMemo } from "react";

type Props = {
  elements: string[];
  placeholder: string;
  onSelect: (value: string) => void;
  onChange: (value: string) => void;
  value: string;
};

export default function GenericSearch({
  elements,
  onSelect,
  placeholder,
  onChange,
  value,
}: Props) {
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => {
    if (!value) return [];
    return elements.filter((i) =>
      i.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, elements]);

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

      onSelect(selected);
      onChange(selected);
      setHighlight(-1);
    }
  }

  return (
    <div className="relative w-full xl:w-auto">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlight(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border p-2 rounded w-full xl:w-auto text-md"
      />

      {filtered.length > 0 && highlight >= 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded border bg-white shadow">
          {filtered.map((ing, i) => (
            <li
              key={ing}
              onMouseDown={() => {
                onSelect(ing);
                onChange(ing);
                setHighlight(-1);
              }}
              className={`px-2 py-1 cursor-pointer text-sm 
                ${
                  i === highlight
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {ing}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
