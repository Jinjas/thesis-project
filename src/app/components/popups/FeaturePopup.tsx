"use client";

import { useEffect, useRef, useState } from "react";
import ActionButton from "../button/ActionButton";
import GenericSearch from "../button/GenericSearch";
import { IngredientType } from "../../types";

export type FeatureOption = {
  value: string;
  label: string;
  // condition: if omitted or 'all' means available for all types; otherwise an array of IngredientType values
  cond?: IngredientType[] | "all";
  // optional async function to process content (if undefined, content is used as-is)
  process?: (content: string) => Promise<string> | string;
};

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  description2?: string;
  options: readonly FeatureOption[];
  ingredientType?: IngredientType | null;
  onClose: () => void;
  onImport: (content: string, feature: string) => void;
};

export default function FeaturePopup({
  isOpen,
  title = "Feature",
  description = "Choose a feature mode and select a file for it.",
  description2 = undefined,
  options,
  ingredientType,
  onClose,
  onImport,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const visibleOptions = options.filter((opt) => {
    if (!opt.cond || opt.cond === "all") return true;
    const condArr = Array.isArray(opt.cond) ? opt.cond : [opt.cond];
    if (!condArr || condArr.length === 0) return true;
    if (!ingredientType) return false;
    return condArr.includes(ingredientType as IngredientType);
  });

  const selectedOption =
    options.find((o) => o.value === selectedFeature) ?? null;
  const isFeatureAllowed = (() => {
    if (!selectedOption) return false;
    if (!selectedOption.cond || selectedOption.cond === "all") return true;
    if (!ingredientType) return false;
    const condArr = Array.isArray(selectedOption.cond)
      ? selectedOption.cond
      : [selectedOption.cond];
    return condArr.includes(ingredientType as IngredientType);
  })();

  useEffect(() => {
    if (!isOpen) return;

    // start with no selection and empty input placeholder
    setSelectedFeature("");
    setSearchInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isOpen, options]);

  useEffect(() => {
    // sync searchInput when selectedFeature changes
    const label = visibleOptions.find(
      (o) => o.value === selectedFeature,
    )?.label;
    if (label) setSearchInput(label);
  }, [selectedFeature, visibleOptions]);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      onImport(text, selectedFeature);
      onClose();
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-popup-title"
    >
      <div
        className="w-full max-w-md rounded border bg-gray-200 p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between gap-2">
          <h3
            id="feature-popup-title"
            className="text-lg font-semibold text-black"
          >
            {title}
          </h3>
          <ActionButton onClick={onClose} label="Close" variant="close" />
        </div>

        <p className="pt-2 text-sm text-gray-600">{description}</p>
        {description2 && (
          <p className="pt-2 text-xs text-gray-600">{description2}</p>
        )}

        <div className="pt-4 flex gap-3 items-start">
          <div className="flex-1">
            <GenericSearch
              elementsKV={visibleOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              placeholder="Select mode..."
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                const match = visibleOptions.find(
                  (o) =>
                    o.label.trim().toLowerCase() === v.trim().toLowerCase(),
                );
                if (match) setSelectedFeature(match.value);
                else setSelectedFeature("");
              }}
              onSelect={(v) => {
                setSelectedFeature(v);
                const label =
                  visibleOptions.find((o) => o.value === v)?.label ?? v;
                setSearchInput(label);
              }}
              showOnFocus={true}
            />
          </div>

          <div className="flex-shrink-0">
            <ActionButton
              onClick={handleImportClick}
              label="Import File"
              variant="save"
              disabled={!selectedFeature || !isFeatureAllowed}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.ontodl"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
