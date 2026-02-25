"use client";

import GenericSearch from "../button/GenericSearch";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
  placeholder2: string;
  value2: string;
  onChange2: (value: string) => void;
  onSelect: (value: string) => void;
  elements: string[];
};

export default function AddItemForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  placeholder2,
  value2,
  onChange2,
  onSelect,
  elements,
}: Props) {
  return (
    <div className="flex gap-2 pt-4 w-full pr-2">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 rounded w-full text-md"
      />
      <GenericSearch
        elements={elements}
        onChange={onChange2}
        onSelect={onSelect}
        placeholder={placeholder2}
        value={value2}
      />
      <button
        onClick={onSubmit}
        className="block bg-gray-700 hover:bg-gray-800 text-white px-4 rounded cursor-pointer"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
