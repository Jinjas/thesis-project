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
  const [moving, setMoving] = useState(false);
  return (
    <aside
      className={` relative bg-gray-900 text-white py-6 flex flex-col h-screen max-h-screen transition-all duration-300 ${collapsed ? "w-2 px-2" : "w-40 px-4"}`}
      onTransitionEnd={() => setMoving(false)}
    >
      <button
        onClick={() => {
          setCollapsed((v) => !v);
          setMoving(true);
        }}
        className=" absolute top-1/2 -right-3 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-700 cursor-pointer"
      >
        {collapsed ? "›" : "‹"}
      </button>

      <div className="h-full">
        <div className={`w-32 h-full ${collapsed ? "hidden" : ""}`}>
          {!collapsed && (
            <SidebarSection
              title="Cocktails"
              titleHref="/cocktails"
              items={cocktails}
              baseHref="/cocktails"
              extraFlags="h-[25%] max-h-[25%] pb-4"
              extraFlags2={moving ? "overflow-hidden" : "overflow-y-scroll"}
            />
          )}

          {!collapsed && (
            <SidebarSection
              title="Ingredients"
              titleHref="/ingredients"
              items={ingredients}
              baseHref="/ingredients"
              extraFlags="h-[75%] max-h-[75%]"
              extraFlags2={moving ? "overflow-hidden" : "overflow-y-scroll"}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
