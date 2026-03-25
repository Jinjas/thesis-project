"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Cocktail } from "../../types";
import { ActionButton } from "../button";

type Props = {
  cocktails: Cocktail[];
  selectedId: string;
  setId: (value: string) => void;
  remCocktail: (id: string) => void;
};

export default function CocktailList({
  cocktails,
  selectedId,
  setId,
  remCocktail,
}: Props) {
  useEffect(() => {
    if (!selectedId && cocktails.length > 0) {
      setId(cocktails[0].id);
    }
  }, [cocktails, selectedId, setId]);

  return (
    <ul className="overflow-y-auto">
      {cocktails.map((i) => (
        <li key={i.id}>
          <div
            onClick={() => setId(i.id)}
            className={`grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start sm:items-center gap-2 py-1 px-2 border-b cursor-pointer
              ${selectedId === i.id ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            <h3 className="font-semibold min-w-0 truncate">{i.name}</h3>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:justify-end">
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  label="Remove"
                  variant="remove2"
                  onClick={() => remCocktail(i.id)}
                />
              </div>

              <Link
                href={`/cocktails/${i.id}`}
                onClick={(e) => e.stopPropagation()}
                className=" bg-gray-700 hover:bg-gray-800 text-white px-6 py-1 rounded border text-center"
              >
                Edit
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
