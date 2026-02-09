// app/data.ts
import { Ingredient, Cocktail } from "../types";

const FRONTEND_BASIC_ONTO = `
Ontologia FrontendBasic

concepts {
  Language,
  Library,
  Framework,
  Tool
}

individuals {
  FrontendBasic,
  JavaScript,
  TypeScript,
  React,
  Next,
  TailwindCSS,
  SQL,
  ArchitectsPortal
}

relations {
	uses,
	requires,
	is_composed_of,
	supports,
	is_used_for
}

triples {
  JavaScript = iof => Language;
  TypeScript = iof => Language;
  React = iof => Library;
  Next = iof => Framework;
  TailwindCSS = iof => Tool;
  SQL = iof => Language;
  
  ArchitectsPortal = requires => FrontendBasic;

  SQL = supports => ArchitectsPortal;

  FrontendBasic = is_composed_of => JavaScript;
  FrontendBasic = is_composed_of => TypeScript;
  FrontendBasic = is_composed_of => React;
  FrontendBasic = is_composed_of => Next;
  FrontendBasic = is_composed_of => TailwindCSS;
}
.`.trim();

export const INGREDIENTS: Ingredient[] = [
  {
    id: "ts",
    name: "TypeScript",
    type: "Language",
    code: "// Strongly typed JavaScript",
  },
  {
    id: "js",
    name: "JavaScript",
    type: "Language",
    code: "// Dynamic language for the web",
  },
  {
    id: "react",
    name: "React",
    type: "Library",
    code: "function App() { return <div /> }",
  },
  {
    id: "next",
    name: "Next",
    type: "Framework",
    code: "export default function Page() {}",
  },
  {
    id: "tailwind",
    name: "TailwindCSS",
    type: "Tool",
    code: "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
  },
  {
    id: "vite",
    name: "Vite",
    type: "Tool",
    code: "import { defineConfig } from 'vite';",
  },
  {
    id: "sql",
    name: "SQL",
    type: "Language",
    code: "SELECT * FROM table;",
  },
];

export const COCKTAILS: Cocktail[] = [
  {
    id: "frontend-basic",
    name: "Frontend Basic",
    viz: "",
    ingredients: {
      js: true,
      react: true,
      tailwind: true,
      ts: true,
      next: true,
      sql: true,
    },
    onto: FRONTEND_BASIC_ONTO,
  },
  {
    id: "modern-stack",
    name: "Modern Stack",
    viz: "",
    ingredients: {
      js: true,
      react: true,
      tailwind: true,
      ts: true,
      next: true,
      sql: true,
    },
    onto: FRONTEND_BASIC_ONTO,
  },
  {
    id: "vanilla-dev",
    name: "Vanilla Dev",
    viz: "",
    ingredients: {
      js: true,
      react: true,
      tailwind: true,
      ts: true,
      next: true,
      sql: true,
    },
    onto: "",
  },
];
