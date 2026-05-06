"use client";

/*usage:

  <genericSearch
      elements={elements}
      onSelect={(value) => newValue = value}
  />
*/

import { useState, useMemo } from "react";

type KV = { value: string; label: string };

type Props = {
  // either a simple array of strings or a key/value array via `elementsKV`
  elements?: string[];
  elementsKV?: KV[];
  placeholder: string;
  onSelect: (value: string) => void;
  onChange: (value: string) => void;
  value: string;
  showOnEmpty?: boolean;
  showOnFocus?: boolean;
};

export default function GenericSearch({
  elements = [],
  elementsKV,
  onSelect,
  placeholder,
  onChange,
  value,
  showOnEmpty = false,
  showOnFocus = false,
}: Props) {
  const [highlight, setHighlight] = useState(0);
  const [focused, setFocused] = useState(false);

  const sourceLabels = elementsKV ? elementsKV.map((e) => e.label) : elements;

  const filtered = useMemo(() => {
    if (!value) {
      if (showOnFocus && focused) return sourceLabels;
      return showOnEmpty ? sourceLabels : [];
    }

    return sourceLabels.filter((i) =>
      i.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, sourceLabels, showOnEmpty, showOnFocus, focused]);

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
      const selectedLabel = filtered[highlight];
      if (!selectedLabel) return;

      const idx = sourceLabels.indexOf(selectedLabel);
      const valueToReturn = elementsKV
        ? (elementsKV[idx]?.value ?? selectedLabel)
        : selectedLabel;

      onSelect(valueToReturn);
      onChange(selectedLabel);
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
          setFocused(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        className="border p-2 rounded w-full xl:w-auto text-md"
      />

      {filtered.length > 0 && highlight >= 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded border bg-white shadow">
          {filtered.map((label, i) => {
            const idx = sourceLabels.indexOf(label);
            const valueToReturn = elementsKV
              ? (elementsKV[idx]?.value ?? label)
              : label;

            return (
              <li
                key={`${label}-${i}`}
                onMouseDown={() => {
                  onSelect(valueToReturn);
                  onChange(label);
                  setHighlight(-1);
                }}
                className={`px-2 py-1 cursor-pointer text-sm ${
                  i === highlight
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
