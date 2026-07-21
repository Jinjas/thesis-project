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
import { ActionButton } from "../button";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [extraDataHidden, setExtraDataHidden] = useState<{
    [key: string]: boolean;
  }>({});
  const [cocktailTable, setCocktailTable] = useState<TableDict[] | undefined>();
  let data: TableDict[] | undefined = [];

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      if (type !== 1 && type !== 3) {
        setCocktailTable(undefined);
        return;
      }

      const cocktail =
        type === 1
          ? cocktails.find((c) => c.id === id)
          : cocktails.find((c) => c.id === selectedId);

      if (!cocktail) {
        setCocktailTable(undefined);
        return;
      }

      const table = await buildCocktailTable(cocktail, ingredients);
      if (!cancelled) setCocktailTable(table);
    }

    void loadTable();

    return () => {
      cancelled = true;
    };
  }, [type, id, selectedId, cocktails, ingredients]);

  switch (type) {
    //individual detail pages
    case 0: {
      const ingredient = ingredients.find((c) => c.id === id);
      data = ingredient?.table;

      if (data) return <SectionTable data={data} />;
      break;
    }

    case 1: {
      if (cocktailTable) return <SectionTable data={cocktailTable} />;
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
      if (cocktailTable) return <SectionTable data={cocktailTable} />;
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
          <div className="flex flex-col overflow-auto gap-2">
            {activeIngredients.map((ing, index) => (
              <div className="flex flex-col gap-2" key={ing.id}>
                <ActionButton
                  onClick={() => {
                    setExtraDataHidden((v) => ({
                      ...v,
                      [ing.id]: !v[ing.id],
                    }));
                  }}
                  label={
                    <div className="grid grid-cols-[1.5fr_3fr_auto] gap-4 items-center w-full">
                      <h2 className="text-md text-left font-bold truncate">
                        {ing.name}
                      </h2>

                      <div className=" min-w-[60px] ">
                        <h3 className="text-sm text-left text-gray-500">
                          H=
                          {
                            ing.table.findLast((row) => row.title === "Total")
                              ?.rows[0][3]
                          }
                        </h3>
                      </div>

                      <div className="justify-self-end">
                        {extraDataHidden[ing.id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  }
                  variant="expand2"
                />

                {!extraDataHidden[ing.id] && <SectionTable data={ing.table} />}

                {activeIngredients.length - 1 > index && (
                  <hr className="border-gray-300" />
                )}
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
          <div className="flex flex-col overflow-auto gap-2">
            {activeIngredients.map((ing, index) => (
              <div className="flex flex-col gap-2" key={ing.id}>
                <ActionButton
                  onClick={() => {
                    setExtraDataHidden((v) => ({
                      ...v,
                      [ing.id]: !v[ing.id],
                    }));
                  }}
                  label={
                    <div className="grid grid-cols-[1.5fr_3fr_auto] gap-4 items-center w-full">
                      <h2 className="text-md text-left font-bold truncate">
                        {ing.name}
                      </h2>

                      <div className=" min-w-[60px] ">
                        <h3 className="text-sm text-left text-gray-500">
                          H=
                          {
                            ing.table.findLast((row) => row.title === "Total")
                              ?.rows[0][3]
                          }
                        </h3>
                      </div>

                      <div className="justify-self-end">
                        {extraDataHidden[ing.id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  }
                  variant="expand2"
                />

                {!extraDataHidden[ing.id] && <SectionTable data={ing.table} />}

                {activeIngredients.length - 1 > index && (
                  <hr className="border-gray-300" />
                )}
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
