"use client";

/*
usage:

<TableData type={0 | 1 | 2} />
*/

import { useAppContext } from "../../context/AppContext";
import { useParams } from "next/navigation";
import SectionTable from "./TableArea";
import { TableDict } from "../../types";

type Props = {
  type: number;
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

export default function TableData({ type }: Props) {
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

    default:
      data = tableDict;
      return <SectionTable data={data} />;
  }

  if (!data) return <SectionTable data={tableDict} />;
}
