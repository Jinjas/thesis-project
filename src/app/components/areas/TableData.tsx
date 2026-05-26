"use client";

/*
usage:

<TableData type={0 | 1 | 2} />
*/

import { useAppContext } from "../../context/AppContext";
import { useParams } from "next/navigation";
import SectionTable from "./TableArea";
import { Ingredient, TableDict } from "../../types";
import { buildCocktailTable } from "../../context/utils/cocktailTable";

type Props = {
  type: number;
  selectedId?: string;
};

const tableDict: TableDict[] = [
  {
    section: "section",
    title: "section",
    rows: [
      ["1", "1-data2", "1-data3", "1.0"],
      ["2", "2-data2", "2-data3", "1.0"],
    ],
  },
  {
    section: "section2",
    title: "section2",
    rows: [["3", "3-data2", "3-data3", "1.0"]],
  },
];

export default function TableData({ type, selectedId }: Props) {
  const { ingredients, cocktails } = useAppContext();
  const { id } = useParams();

  let data: TableDict[] | undefined = [];

  switch (type) {
    //individual detail pages
    case 0: {
      const ingredient = ingredients.find((c) => c.id === id);
      data = ingredient?.table;

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 1: {
      const cocktail = cocktails.find((c) => c.id === id);
      if (!cocktail) break;
      data = buildCocktailTable(cocktail, ingredients);

      if (data) return <SectionTable data={data} />;
      break;
    }

    //pages with lists
    case 2: {
      const ingredient = ingredients.find((c) => c.id === selectedId);
      data = ingredient?.table;

      if (data) return <SectionTable data={data} />;
      else return <></>;
      break;
    }

    case 3: {
      const cocktail = cocktails.find((c) => c.id === selectedId);
      if (!cocktail) break;
      data = buildCocktailTable(cocktail, ingredients);

      if (data) return <SectionTable data={data} />;
      break;
    }

    //individual ingredients of cocktail
    case 4: {
      const cocktail = cocktails.find((c) => c.id === id);
      if (!cocktail) break;

      const activeIngredients: Ingredient[] = Object.entries(
        cocktail.ingredients,
      )
        .filter(([_, v]) => v)
        .map(([ingId]) => ingredients.find((i) => i.id === ingId))
        .filter((i): i is (typeof ingredients)[number] => !!i);

      if (activeIngredients.length)
        return (
          <div className="overflow-auto">
            {activeIngredients.map((ing) => (
              <div key={ing.id}>
                <h2 className="py-2 text-md font-bold">{ing.name}</h2>
                <SectionTable data={ing.table} />
              </div>
            ))}
          </div>
        );
      break;
    }

    case 5: {
      const cocktail = cocktails.find((c) => c.id === selectedId);
      if (!cocktail) break;

      const activeIngredients: Ingredient[] = Object.entries(
        cocktail.ingredients,
      )
        .filter(([_, v]) => v)
        .map(([ingId]) => ingredients.find((i) => i.id === ingId))
        .filter((i): i is (typeof ingredients)[number] => !!i);

      if (activeIngredients.length)
        return (
          <div className="overflow-auto">
            {activeIngredients.map((ing) => (
              <div key={ing.id}>
                <h2 className="py-2 text-md font-bold">{ing.name}</h2>
                <SectionTable data={ing.table} />
              </div>
            ))}
          </div>
        );
      break;
    }
    default:
      data = tableDict;
      return <SectionTable data={data} />;
  }

  if (!data) return <SectionTable data={tableDict} />;
}
