"use client";

/*usage:

  <Sidebar />
*/

import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import SidebarSection from "./SidebarSection";

export default function Sidebar() {
  const { cocktails, ingredients } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={` relative bg-gray-900 text-white py-6 flex flex-col transition-all duration-300 ${collapsed ? "w-2 px-2" : "w-40 px-4"}`}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className=" absolute top-1/2 -right-3 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700"
      >
        {collapsed ? "›" : "‹"}
      </button>

      <div className="overflow-hidden">
        <div className="w-32">
          {!collapsed && (
            <SidebarSection
              title="Cocktails"
              titleHref="/cocktails"
              items={cocktails}
              baseHref="/cocktails"
              extraFlags="h-1/4 pb-4"
            />
          )}

          {!collapsed && (
            <SidebarSection
              title="Ingredients"
              titleHref="/ingredients"
              items={ingredients}
              baseHref="/ingredients"
              extraFlags="h-3/4"
            />
          )}
        </div>
      </div>
    </aside>
  );
}
