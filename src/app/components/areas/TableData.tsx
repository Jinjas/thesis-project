"use client";

/*
usage:

<TableData type={0 | 1 | 2} />
*/

import { useAppContext } from "../../context/AppContext";
import { useParams } from "next/navigation";
import SectionTable from "./TableArea";
import { TableDict, Ingredient } from "../../types";

type Props = {
  type: number;
  selectedId?: string;
};

const tableDict: TableDict[] = [
  {
    section: "section",
    rows: [
      ["1", "1-data2", "1-data3", "1.0"],
      ["2", "2-data2", "2-data3", "1.0"],
    ],
  },
  {
    section: "section2",
    rows: [["3", "3-data2", "3-data3", "1.0"]],
  },
];

export default function TableData({ type, selectedId }: Props) {
  const { ingredients, cocktails } = useAppContext();
  const { id } = useParams();

  let data: TableDict[] | undefined = [];

  switch (type) {
    case 0: {
      const ingredient = ingredients.find((c) => c.id === id);
      data = ingredient?.table;

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 1: {
      const cocktail = cocktails.find((c) => c.id === id);
      if (!cocktail) break;

      let counter = 1;

      const data: TableDict[] = Object.entries(cocktail.ingredients)
        .filter(([_, v]) => v)
        .map(([ingId]) => ingredients.find((i) => i.id === ingId))
        .filter((i): i is (typeof ingredients)[number] => !!i)
        .flatMap((ingredient) =>
          ingredient.table.map((section) => ({
            section: section.section,
            rows: section.rows.map((row) => {
              const newRow = [...row];
              newRow[0] = String(counter++);
              return newRow;
            }),
          })),
        );

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 2: {
      const ingredient = ingredients.find((c) => c.id === selectedId);
      data = ingredient?.table;

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 3: {
      const cocktail = cocktails.find((c) => c.id === selectedId);
      if (!cocktail) break;

      let counter = 1;

      const data: TableDict[] = Object.entries(cocktail.ingredients)
        .filter(([_, v]) => v)
        .map(([ingId]) => ingredients.find((i) => i.id === ingId))
        .filter((i): i is (typeof ingredients)[number] => !!i)
        .flatMap((ingredient) =>
          ingredient.table.map((section) => ({
            section: section.section,
            rows: section.rows.map((row) => {
              const newRow = [...row];
              newRow[0] = String(counter++);
              return newRow;
            }),
          })),
        );

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 4: {
      const cocktail = cocktails.find((c) => c.id === id);
      if (!cocktail) break;

      let counter = 1;

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

      let counter = 1;

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
