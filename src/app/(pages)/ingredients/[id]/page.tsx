"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import {
  buildIngredientRemovalBlockedMessage,
  getActiveCocktailsUsingIngredient,
} from "../../../context/utils/ingredientRemoval";
import { useState, useEffect } from "react";
import { IngredientType, INGREDIENT_TYPES } from "../../../types";
import {
  TypeSelector,
  CodeEdit,
  ImportButton,
  ExportButton,
  TextCampEdit,
  ActionButton,
  ConfirmationBox,
} from "../../../components";
import { DoubleSectionLayout } from "../../../layouts";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, cocktails, updateIngredient, remIngredient } =
    useAppContext();
  const router = useRouter();
  const ingredient = ingredients.find((i) => i.id === id);

  const [name, setName] = useState("");
  const [type, setType] = useState<IngredientType>("UNDEFINED");
  const [code, setCode] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [extraDataHidden, setExtraDataHidden] = useState(true);
  const [extraData, setExtraData] = useState("");
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [isRemoveInfoPopupOpen, setIsRemoveInfoPopupOpen] = useState(false);
  const [removeInfoTitle, setRemoveInfoTitle] = useState(
    "Cannot remove ingredient",
  );
  const [removeInfoDescription, setRemoveInfoDescription] = useState("");
  const [removeInfoDetails, setRemoveInfoDetails] = useState<string[]>([]);

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

  async function handleRemoveIngredient() {
    if (!ingredient) return;
    setIsRemovePopupOpen(false);

    const result = await remIngredient(ingredient.id);

    if (result.success) {
      router.push("/ingredients");
      return;
    }

    setRemoveInfoTitle(`Cannot remove ingredient \"${ingredient.name}\"`);
    setRemoveInfoDescription(result.message);

    if (result.reason === "ACTIVE_IN_COCKTAILS") {
      setRemoveInfoDetails(result.cocktails);
    } else {
      setRemoveInfoDetails([]);
    }

    setIsRemoveInfoPopupOpen(true);
  }

  function handleRemoveClick() {
    if (!ingredient) return;

    const activeCocktails = getActiveCocktailsUsingIngredient(
      cocktails,
      ingredient.id,
    );

    if (activeCocktails.length > 0) {
      setRemoveInfoTitle(`Cannot remove ingredient \"${ingredient.name}\"`);
      setRemoveInfoDescription(buildIngredientRemovalBlockedMessage());
      setRemoveInfoDetails(activeCocktails);
      setIsRemoveInfoPopupOpen(true);
      return;
    }

    setIsRemovePopupOpen(true);
  }

  async function handleSaveIngredient() {
    if (!ingredient) return;
    await updateIngredient(ingredient.id, name, type, characteristics);
    setIsSavePopupOpen(false);
    router.push("/ingredients");
  }

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

      <div className="pt-2 px-2 flex gap-2 justify-between">
        <ActionButton
          onClick={handleRemoveClick}
          label="Remove"
          variant="remove"
        />

        <ActionButton
          onClick={() => setIsSavePopupOpen(true)}
          label="Save"
          variant="save"
        />
      </div>

      <ConfirmationBox
        isOpen={isRemovePopupOpen}
        title={`Remove ingredient \"${ingredient.name}\"?`}
        description="You are about to delete this ingredient and all its associated data. Wish to proceed?"
        boldDescription="This action cannot be undone."
        confirmLabel="Remove"
        showCancel={false}
        onCancel={() => setIsRemovePopupOpen(false)}
        onConfirm={handleRemoveIngredient}
      />
      <ConfirmationBox
        isOpen={isSavePopupOpen}
        title={`Save ingredient \"${ingredient.name}\"?`}
        description="You are about to save this ingredient and all its associated data. Wish to proceed?"
        boldDescription="Changes will be applied immediately."
        confirmLabel="Save Changes"
        confirmVariant="save"
        showCancel={false}
        onCancel={() => setIsSavePopupOpen(false)}
        onConfirm={handleSaveIngredient}
      />

      <ConfirmationBox
        isOpen={isRemoveInfoPopupOpen}
        title={removeInfoTitle}
        description={removeInfoDescription}
        detailsTitle={
          removeInfoDetails.length
            ? "Deactivate this ingredient in these cocktails first:"
            : ""
        }
        details={removeInfoDetails}
        confirmLabel="OK"
        confirmVariant="save"
        showCancel={false}
        onCancel={() => setIsRemoveInfoPopupOpen(false)}
        onConfirm={() => setIsRemoveInfoPopupOpen(false)}
      />
    </DoubleSectionLayout>
  );
}
