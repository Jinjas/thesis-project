"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function Sidebar() {
  const { setSelectedPage } = useAppContext();

  return (
    <aside className="w-28 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <Link
        href="/cocktails"
        className="font-semibold hover:text-gray-300"
        onClick={() => setSelectedPage("cocktails")}
      >
        Cocktails
      </Link>

      <Link
        href="/ingredients"
        className="font-semibold hover:text-gray-300"
        onClick={() => setSelectedPage("ingredients")}
      >
        Ingredients
      </Link>
    </aside>
  );
}
