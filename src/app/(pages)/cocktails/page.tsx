"use client";

import { CocktailList, AddItemForm } from "../../components";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { DoubleSectionLayout } from "../../layouts";

export default function CocktailsPage() {
  const { cocktails, addCocktail, remCocktail } = useAppContext();

  const [cocktailName, setCocktailName] = useState("");
  const { ingredients } = useAppContext();

  const ingredientsNames = ingredients.map((i) => i.name);

  const [ingredient, setIngredient] = useState("");

  const [selectedID, setSelectedID] = useState("");
  return (
    <DoubleSectionLayout
      title="Cocktails"
      typeOf2="cocktailList"
      id={selectedID}
    >
      <AddItemForm
        value={cocktailName}
        onChange={(e) => setCocktailName(e.target.value)}
        onSubmit={() => {
          if (cocktailName.trim() !== "" && ingredient.trim() !== "") {
            const id = addCocktail(cocktailName, ingredient);
            setCocktailName("");
            setIngredient("");
          }
        }}
        placeholder="Cocktail name..."
        buttonLabel="Create"
        placeholder2="Ingredient name..."
        value2={ingredient}
        onChange2={setIngredient}
        onSelect={setIngredient}
        elements={ingredientsNames}
      />

      <CocktailList
        cocktails={cocktails}
        selectedId={selectedID}
        setId={setSelectedID}
        remCocktail={remCocktail}
      />
    </DoubleSectionLayout>
  );
}
