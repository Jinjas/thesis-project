"use client";

import { useState } from "react";
import { IngredientList, AddItemForm } from "../../components";
import { useAppContext } from "../../context/AppContext";
import { redirect } from "next/navigation";
import { DoubleSectionLayout } from "../../layouts";
import { INGREDIENT_TYPES, IngredientType } from "../../types";
export default function IngredientsPage() {
  const { ingredients, addIngredient } = useAppContext();
  const [name, setName] = useState("");
  const [type, setType] = useState<IngredientType>("Tool");

  return (
    <DoubleSectionLayout title="Ingredients" typeOf2="ingredList">
      <AddItemForm
        value={name}
        onChange={(e) => setName(e.target.value)}
        onSubmit={() => {
          if (name.trim() !== "") {
            const id = addIngredient(name, type);
            setName("");
            redirect(`/ingredients/${id}`);
          }
        }}
        placeholder="Ingredient name..."
        buttonLabel="Create"
        value2="Type...(default: Tool)"
        onChange2={setType}
        elements={INGREDIENT_TYPES.map((t) => t.toString())}
      />

      <IngredientList ingredients={ingredients} />
    </DoubleSectionLayout>
  );
}
