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
};

export default function SidebarSection({
  title,
  titleHref,
  items,
  baseHref,
  extraFlags = "h-full",
}: SidebarSectionProps) {
  return (
    <div className={`${extraFlags} flex flex-col`}>
      <Link
        href={titleHref}
        className="font-semibold hover:bg-gray-700 rounded px-1"
      >
        {title}
      </Link>

      <ul className="pt-1 overflow-y-scroll h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-600 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
        {items.map((item) => (
          <li key={item.id} className="px-1">
            <Link
              href={`${baseHref}/${item.id}`}
              className="block hover:bg-gray-700 py-1 px-1 rounded border-b border-gray-500 text-sm"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
