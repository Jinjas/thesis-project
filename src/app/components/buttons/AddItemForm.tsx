"use client";

import { useState } from "react";
import GenericSearch from "../button/GenericSearch";
import { IngredientType } from "@/app/types";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
  value2: string;
  onChange2: (value: IngredientType) => void;
  elements: string[];
};

export default function AddItemForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  value2,
  onChange2,
  elements,
}: Props) {
  return (
    <div className="flex gap-2 pt-4 w-full pr-2">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 rounded flex-1 text-md"
      />
      <GenericSearch
        elements={elements}
        onSelect={onChange2}
        placeholder={value2}
      />
      <button
        onClick={onSubmit}
        className="block bg-gray-700 hover:bg-gray-800 text-white px-4 rounded"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
