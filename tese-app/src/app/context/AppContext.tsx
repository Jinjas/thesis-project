"use client";

import { createContext, useContext, useState } from "react";

type AppContextType = {
  selectedPage: string;
  setSelectedPage: (value: string) => void;

  search: string;
  setSearch: (value: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedPage, setSelectedPage] = useState("cocktails");
  const [search, setSearch] = useState("");

  return (
    <AppContext.Provider
      value={{
        selectedPage,
        setSelectedPage,
        search,
        setSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
