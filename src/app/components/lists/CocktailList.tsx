"use client";

import Link from "next/link";
import { Cocktail } from "../../types";

type Props = {
  cocktails: Cocktail[];
};

export default function CocktailList({ cocktails }: Props) {
  return (
    <ul className="pt-4 overflow-y-auto">
      {cocktails.map((i) => (
        <li key={i.id}>
          <div className="grid grid-cols-[2fr_80px] items-center gap-2 py-1 px-2 border-b">
            <h3 className="font-semibold">{i.name}</h3>
            <Link
              href={`/cocktails/${i.id}`}
              className=" bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded border text-center cursor-pointer"
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
