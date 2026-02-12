"use client";

import { Sidebar, CocktailList, AddItemForm } from "../../components";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { redirect } from "next/navigation";
import { DoubleSectionLayout } from "../../layouts";

export default function CocktailsPage() {
  const { cocktails, addCocktail } = useAppContext();

  const [cocktailName, setCocktailName] = useState("");

  return (
    <DoubleSectionLayout title="Cocktails" typeOf2="cocktailList">
      <AddItemForm
        value={cocktailName}
        onChange={(e) => setCocktailName(e.target.value)}
        onSubmit={() => {
          if (cocktailName.trim() !== "") {
            const id = addCocktail(cocktailName);
            setCocktailName("");
            redirect(`/cocktails/${id}`);
          }
        }}
        placeholder="Cocktail name..."
        buttonLabel="Add Cocktail"
      />

      <CocktailList cocktails={cocktails} />
    </DoubleSectionLayout>
  );
}
