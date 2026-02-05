"use client";

import { IngredientType } from "../types";
import { Check } from "lucide-react";

type Props = {
  value: IngredientType;
  onChange: (type: IngredientType) => void;
  types: readonly IngredientType[];
};

export default function TypeSelector({ value, onChange, types }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-between lg:w-[calc(100%-150px)]">
      {types.map((t) => {
        const selected = value === t;

        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition text-sm
              ${
                selected
                  ? "bg-gray-700 hover:bg-gray-800 text-white"
                  : "text-black hover:bg-gray-300"
              }
            `}
          >
            {selected && <Check size={16} />}

            {t}
          </button>
        );
      })}
    </div>
  );
}
