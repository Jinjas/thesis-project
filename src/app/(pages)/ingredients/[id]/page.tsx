"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect, useRef } from "react";
import { IngredientType, INGREDIENT_TYPES } from "../../../types";
import {
  TypeSelector,
  CodeEdit,
  Sidebar,
  ImportButton,
  ExportButton,
  TextCampEdit,
  ActionButton,
} from "../../../components";
import { BaseLayout } from "../../../layouts";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, updateIngredient, remIngredient } = useAppContext();
  const router = useRouter();
  const ingredient = ingredients.find((i) => i.id === id);

  const [name, setName] = useState("");
  const [type, setType] = useState<IngredientType>("Language");
  const [code, setCode] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setType(ingredient.type);
      setCode(ingredient.code);
    }
  }, [ingredient]);

  useEffect(() => {
    if (!ingredient) {
      router.replace("/ingredients");
    }
  }, [ingredient, router]);

  if (!ingredient) return <p className="p-6">Redirecting…</p>;

  return (
    <BaseLayout title="Edit Ingredient" typeOf2="ingredDetail">
      <TextCampEdit label="Name" value={name} onChange={setName} />

      <div className="pt-2 flex flex-col lg:flex-row gap-2 lg:gap-4 max-w-[493px]">
        <label className="lg:p-2 lg:pr-1 lg:w-[50px]">Type:</label>

        <TypeSelector
          value={type}
          onChange={setType}
          types={INGREDIENT_TYPES}
        />
      </div>

      <div className="pt-4 px-2 flex flex-col h-full">
        <div className="pt-4 flex justify-between">
          <h3 className="font-semibold pb-2"> OntoDL</h3>

          <div className="flex gap-2">
            <ImportButton func={setCode} />

            <ExportButton code={code} filename={name || "ingredient"} />
          </div>
        </div>

        <CodeEdit code={code} setCode={setCode} />
      </div>

      <div className="pt-2 px-2 flex gap-2 justify-end">
        <ActionButton
          onClick={() => {
            remIngredient(ingredient.id);
            router.push("/ingredients");
          }}
          label="Remove"
          variant="remove"
        />

        <ActionButton
          onClick={() => updateIngredient(ingredient.id, name, type, code)}
          label="Save"
          variant="save"
        />
      </div>
    </BaseLayout>
  );
}
