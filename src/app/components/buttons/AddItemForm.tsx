"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
};

export default function AddItemForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
}: Props) {
  return (
    <div className="flex gap-2 pt-4 w-full pr-2">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 rounded flex-1"
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
