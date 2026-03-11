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

  let data: TableDict[] | undefined;

  switch (type) {
    case 0: {
      const ingredient = ingredients.find((c) => c.id === id);
      data = ingredient?.table;
      break;
    }

    case 1: {
      const cocktail = cocktails.find((c) => c.id === id);

      if (cocktail) {
        data = [
          {
            section: cocktail.name,
            rows: [
              ["1", "1-data2", "1-data3", "1.0"],
              ["2", "2-data2", "2-data3", "1.0"],
            ],
          },
          {
            section: "section2222",
            rows: [["3", "3-data2", "3-data3", "1.0"]],
          },
        ];
      }

      break;
    }

    default:
      data = tableDict;
  }

  if (!data) data = tableDict;

  return <SectionTable data={data} />;
}
