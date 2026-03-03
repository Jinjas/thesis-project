"use client";

/*usage:
  
  <SidebarSection
    title="Cocktails"
    titleHref="/cocktails"
    items={cocktails}
    baseHref="/cocktails"
    extraFlags="h-1/4 pb-4"
  />
*/

import Link from "next/link";

import { usePathname } from "next/navigation";

type Item = {
  id: string;
  name: string;
};

type SidebarSectionProps = {
  title: string;
  titleHref: string;
  items: Item[];
  baseHref: string;
  extraFlags?: string;
  extraFlags2?: string;
};

export default function SidebarSection({
  title,
  titleHref,
  items,
  baseHref,
  extraFlags = "h-full",
  extraFlags2 = "overflow-y-scroll",
}: SidebarSectionProps) {
  const pathname = usePathname();

  return (
    <div className={`${extraFlags} flex flex-col`}>
      <Link
        href={titleHref}
        className={`font-semibold rounded px-1 hover:bg-slate-800 ${
          pathname === titleHref ? "bg-slate-800" : ""
        }`}
      >
        {title}
      </Link>

      <ul
        className={`pt-1 ${extraFlags2} h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-600 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700`}
      >
        {items.map((item) => {
          const itemHref = `${baseHref}/${item.id}`;
          const isActive = pathname === itemHref;

          return (
            <li key={item.id} className="px-1">
              <Link
                href={itemHref}
                className={`block py-1 px-1 rounded border-b border-gray-500 text-sm hover:bg-slate-800 ${
                  isActive ? "bg-slate-800" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
