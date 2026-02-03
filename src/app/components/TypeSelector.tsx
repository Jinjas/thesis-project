"use client";

import { IngredientType, INGREDIENT_TYPES } from "../types";
import { Check } from "lucide-react";

type Props = {
  value: IngredientType;
  onChange: (type: IngredientType) => void;
};

export default function TypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-between lg:w-[calc(100%-150px)]">
      {INGREDIENT_TYPES.map((t) => {
        const selected = value === t;

        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition text-sm
              ${
                selected
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
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
