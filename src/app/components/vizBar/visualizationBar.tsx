"use client";

/*usage:

  <VizBar />
*/

import { useAppContext } from "../../context/AppContext";
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
      className={`bg-gray-100 duration-300 flex flex-col py-6 relative text-black transition-all ${collapsed ? "px-2 w-2" : "px-4 w-80"}`}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className=" absolute top-1/2 -left-3 -translate-y-1/2 bg-gray-100 border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
      >
        {collapsed ? "‹" : "›"}
      </button>

      <div className="overflow-hidden">
        <div className="w-72">
          {!collapsed && (
            <VisSidebar
              key={cocktail.id + cocktail.viz + cocktail.onto}
              pdfUrl={cocktail.viz}
              scale={scale}
              onScaleChange={setScale}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
