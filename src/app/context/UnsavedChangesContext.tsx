"use client";

import { createContext, useContext, useMemo, useState } from "react";

type UnsavedChangesContextType = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  resetUnsavedChanges: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(
  null,
);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const value = useMemo(
    () => ({
      hasUnsavedChanges,
      setHasUnsavedChanges,
      resetUnsavedChanges: () => setHasUnsavedChanges(false),
    }),
    [hasUnsavedChanges],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    throw new Error(
      "useUnsavedChanges must be used inside UnsavedChangesProvider",
    );
  }

  return ctx;
}
