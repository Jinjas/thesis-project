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

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationBox from "../popups/ConfirmationBox";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";

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
  const router = useRouter();
  const { hasUnsavedChanges, resetUnsavedChanges } = useUnsavedChanges();
  const [isGuardPopupOpen, setIsGuardPopupOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  function handleNavigationAttempt(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!hasUnsavedChanges) return;

    if (pathname === href) return;

    event.preventDefault();
    setPendingHref(href);
    setIsGuardPopupOpen(true);
  }

  function handleConfirmNavigation() {
    if (!pendingHref) return;

    resetUnsavedChanges();
    setIsGuardPopupOpen(false);
    router.push(pendingHref);
    setPendingHref(null);
  }

  return (
    <>
      <div className={`${extraFlags} flex flex-col`}>
        <Link
          href={titleHref}
          onClick={(event) => handleNavigationAttempt(event, titleHref)}
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
                  onClick={(event) => handleNavigationAttempt(event, itemHref)}
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

      <ConfirmationBox
        isOpen={isGuardPopupOpen}
        title="Unsaved Changes"
        description="There are unsaved changes on this page. Do you wish to continue?"
        boldDescription="These changes will be discarded."
        confirmLabel="Yes"
        confirmVariant="save"
        showCancel={true}
        cancelLabel="No"
        cancelVariant="remove"
        onCancel={() => {
          setIsGuardPopupOpen(false);
          setPendingHref(null);
        }}
        onConfirm={handleConfirmNavigation}
      />
    </>
  );
}
