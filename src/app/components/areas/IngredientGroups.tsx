"use client";

import {
  Ingredient,
  IngredientType,
  INGREDIENT_TYPES,
  Cocktail,
} from "../../types";

type Props = {
  groupedIngredients: Record<IngredientType, Ingredient[]>;
  cocktail: Cocktail;
  updateIngredientStatus: (cocktailId: string, ingredientId: string) => void;
};

export default function IngredientGroups({
  groupedIngredients,
  cocktail,
  updateIngredientStatus,
}: Props) {
  return (
    <>
      {INGREDIENT_TYPES.map((type) => {
        const list = groupedIngredients[type];

        return (
          <div key={type} className="pt-1 ">
            <h3 className="font-bold">{type}</h3>

            {list.length === 0 ? (
              <p className="text-gray-500 text-sm h-[6.5rem]">(none)</p>
            ) : (
              <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-6 pl-4 pt-0 text-sm h-[6rem] overflow-y-auto">
                {list.map((ing) => (
                  <li key={ing.id} className="text-sm pb-1">
                    <button
                      className={`block px-2 py-1 rounded cursor-pointer ${
                        cocktail.ingredients[ing.id]
                          ? "bg-green-200 hover:bg-green-300"
                          : "bg-red-200 hover:bg-red-300"
                      }`}
                      onClick={() =>
                        updateIngredientStatus(cocktail.id, ing.id)
                      }
                    >
                      {ing.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}
