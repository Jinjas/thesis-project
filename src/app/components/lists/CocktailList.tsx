"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Cocktail } from "../../types";

type Props = {
  cocktails: Cocktail[];
  selectedId: string;
  setId: (value: string) => void;
};

export default function CocktailList({ cocktails, selectedId, setId }: Props) {
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
            className={`grid grid-cols-[2fr_80px] items-center gap-2 py-1 px-2 border-b cursor-pointer
              ${selectedId === i.id ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            <h3 className="font-semibold">{i.name}</h3>
            <Link
              href={`/cocktails/${i.id}`}
              onClick={(e) => e.stopPropagation()}
              className=" bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded border text-center"
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
