"use client";

/*usage:

  <VizBar />
*/

import { useAppContext } from "../../context/AppContext";
import { useState, useEffect } from "react";
import VisSidebar from "./VizImgSideBar";
import { useParams, useRouter } from "next/navigation";

type Props = {
  selectedId: string;
};

export default function VizBar({ selectedId }: Props) {
  const { cocktails } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  let cocktail;
  if (selectedId === "") {
    cocktail = cocktails.find((c) => c.id === id);
  } else {
    cocktail = cocktails.find((c) => c.id === selectedId);
  }

  const router = useRouter();

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!cocktail) {
      router.replace("/cocktails");
    }
  }, [cocktail, router]);

  if (!cocktail)
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
        {!collapsed && <div className="overflow-hidden">Generating...</div>}
      </aside>
    );

  return (
    <aside
      className={`bg-gray-100 duration-300 flex flex-col justify-between py-6 relative text-black transition-all ${collapsed ? "px-2 w-2" : "px-4 w-80"}`}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className=" absolute top-1/2 -left-3 -translate-y-1/2 bg-gray-100 border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
      >
        {collapsed ? "‹" : "›"}
      </button>

      <div className="overflow-hidden">
        <div className="w-72 h-full pb-2">
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
      <div className="pb-10 text-sm text-gray-600">
        {!collapsed && (
          <p>
            <strong>Name:</strong> {cocktail.name}
          </p>
        )}
      </div>
    </aside>
  );
}
