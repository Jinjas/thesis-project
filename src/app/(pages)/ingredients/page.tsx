"use client";

import { useState } from "react";
import { IngredientList, AddItemForm } from "../../components";
import { useAppContext } from "../../context/AppContext";
import { redirect } from "next/navigation";
import { DoubleSectionLayout } from "../../layouts";

export default function IngredientsPage() {
  const { ingredients, addIngredient } = useAppContext();
  const [name, setName] = useState("");

  return (
    <DoubleSectionLayout title="Ingredients" typeOf2="ingredList">
      <AddItemForm
        value={name}
        onChange={(e) => setName(e.target.value)}
        onSubmit={() => {
          if (name.trim() !== "") {
            const id = addIngredient(name);
            setName("");
            redirect(`/ingredients/${id}`);
          }
        }}
        placeholder="Ingredient name..."
        buttonLabel="Add Ingredient"
      />

      <IngredientList ingredients={ingredients} />
    </DoubleSectionLayout>
  );
}
