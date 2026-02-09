"use client";

/*usage:

  <Sidebar />
*/

import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import VisSidebar from "./VizImgSideBar";
import { useParams, useRouter } from "next/navigation";

export default function VizBar() {
  const { cocktails } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const cocktail = cocktails.find((c) => c.id === id);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!cocktail) {
      router.replace("/cocktails");
    }
  }, [cocktail, router]);

  if (!cocktail) return <p className="p-6">Redirecting…</p>;

  return (
    <aside
      className={` relative bg-gray-100 text-black py-6 flex flex-col transition-all duration-300 ${collapsed ? "w-2 px-2" : "w-80 px-4"}`}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className=" absolute top-1/2 -left-3 -translate-y-1/2 bg-gray-100 border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300"
      >
        {collapsed ? "‹" : "›"}
      </button>

      {!collapsed && (
        <VisSidebar
          key={cocktail.id + cocktail.viz + cocktail.onto}
          pdfUrl={cocktail.viz}
          scale={scale}
          onScaleChange={setScale}
        />
      )}
    </aside>
  );
}
