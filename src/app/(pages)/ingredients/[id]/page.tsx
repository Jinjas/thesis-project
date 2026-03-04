"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import { useState, useEffect, useRef } from "react";
import { IngredientType, INGREDIENT_TYPES } from "../../../types";
import {
  TypeSelector,
  CodeEdit,
  ImportButton,
  ExportButton,
  TextCampEdit,
  ActionButton,
} from "../../../components";
import { DoubleSectionLayout } from "../../../layouts";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, updateIngredient, remIngredient } = useAppContext();
  const router = useRouter();
  const ingredient = ingredients.find((i) => i.id === id);

  const [name, setName] = useState("");
  const [type, setType] = useState<IngredientType>("UNDEFINED");
  const [code, setCode] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [extraDataHidden, setExtraDataHidden] = useState(true);
  const [extraData, setExtraData] = useState("");

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setType(ingredient.type);
      setCode(ingredient.code);
      setCharacteristics(ingredient.characteristics);
      setExtraData(ingredient.extraData);
    }
  }, [ingredient]);

  useEffect(() => {
    if (!ingredient) {
      router.replace("/ingredients");
    }
  }, [ingredient, router]);

  if (!ingredient) return <p className="p-6">Redirecting…</p>;

  return (
    <DoubleSectionLayout
      title="Edit Ingredient"
      typeOf2="ingredientDetail"
      extraFlag="min-h-screen overflow-auto"
    >
      <TextCampEdit label="Name" value={name} onChange={setName} />

      <div className="pt-2 flex flex-col lg:flex-row gap-2 lg:gap-4 max-w-[493px]">
        <label className="lg:p-2 lg:pr-1 lg:w-[50px]">Type:</label>

        <TypeSelector
          value={type}
          onChange={setType}
          types={INGREDIENT_TYPES}
        />
      </div>

      <div className="pt-4 px-2 flex flex-col">
        <div className="pt-4 flex justify-between">
          <div className="flex gap-2 pb-2">
            <h3 className="font-semibold"> OntoDL</h3>
            <ActionButton
              onClick={() => {
                setExtraDataHidden(!extraDataHidden);
              }}
              label={extraDataHidden ? "More" : "Less"}
              disabled={extraData == ""}
              variant="expand"
            />
          </div>

          <div className="flex gap-2">
            <ImportButton func={setCharacteristics} />

            <ExportButton code={code} filename={name || "ingredient"} />
          </div>
        </div>
        {!extraDataHidden && (
          <div className="flex text-gray-500 whitespace-pre text-sm px-2">
            {extraData}
          </div>
        )}
        <CodeEdit code={characteristics} setCode={setCharacteristics} />
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
          onClick={() =>
            updateIngredient(ingredient.id, name, type, characteristics)
          }
          label="Save"
          variant="save"
        />
      </div>
    </DoubleSectionLayout>
  );
}
