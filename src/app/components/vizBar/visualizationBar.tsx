"use client";

/*usage:

  <VizBar />
*/

import { useAppContext } from "../../context/AppContext";
import { useState, useEffect } from "react";
import VisSidebar from "./VizImgSideBar";
import { useParams, useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

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
      <aside className="relative w-full overflow-visible bg-gray-100 text-black">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute left-1/2 top-0 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-gray-100 hover:bg-gray-300 cursor-pointer"
          aria-label={
            collapsed ? "Expand visualization" : "Collapse visualization"
          }
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? "max-h-0  pt-4" : "max-h-[240px] opacity-100 pt-2 px-4 pb-4"}`}
        >
          <div className="flex items-center justify-center w-full max-h-[184px] h-[184px] overflow-hidden pb-2">
            Generating...
          </div>
        </div>
      </aside>
    );

  return (
    <aside className="relative w-full overflow-visible bg-gray-100 text-black">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute left-1/2 top-0 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-gray-100 hover:bg-gray-300 cursor-pointer"
        aria-label={
          collapsed ? "Expand visualization" : "Collapse visualization"
        }
      >
        {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <div
        className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? "max-h-0 pt-4" : "max-h-[240px] opacity-100 pt-2 px-4 pb-4"}`}
      >
        <div className="w-full max-h-[184px] overflow-visible pb-1">
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
