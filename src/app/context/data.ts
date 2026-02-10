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
  FrontendBasicCocktail,
  JavaScript,
  TypeScript,
  React,
  Next,
  TailwindCSS,
  SQL,
  ESLint,
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
  ESLint = iof => Tool;
  
  ArchitectsPortal = requires => FrontendBasicCocktail;

  SQL = supports => ArchitectsPortal;

  FrontendBasicCocktail = is_composed_of => JavaScript;
  FrontendBasicCocktail = is_composed_of => TypeScript;
  FrontendBasicCocktail = is_composed_of => React;
  FrontendBasicCocktail = is_composed_of => Next;
  FrontendBasicCocktail = is_composed_of => TailwindCSS;
  FrontendBasicCocktail = is_composed_of => ESLint;
}
.`.trim();

const Backend_BASIC_ONTO = `
Ontologia BackendBasic

concepts {
  Language,
  % Library,
  Framework,
  Tool
}

individuals {
  BackendBasicCocktail,
  Python,
  Java,
  % PyGame,
  Rabit,
  VisualStudioCode,
  SQL,
  PostgreSQL,
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
  Python = iof => Language;
  Java = iof => Language;
  % PyGame = iof => Library;
  Rabit = iof => Tool;
  VisualStudioCode = iof => Tool;
  SQL = iof => Language;
  PostgreSQL = iof => Framework;
  
  ArchitectsPortal = requires => BackendBasicCocktail;

  SQL = supports => ArchitectsPortal;

  BackendBasicCocktail = is_composed_of => Python;
  BackendBasicCocktail = is_composed_of => Java;
  % BackendBasicCocktail = is_composed_of => PyGame;
  BackendBasicCocktail = is_composed_of => Rabit;
  BackendBasicCocktail = is_composed_of => VisualStudioCode;
  BackendBasicCocktail = is_composed_of => PostgreSQL;
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
    ingredients: {},
    onto: FRONTEND_BASIC_ONTO,
  },
  {
    id: "modern-stack",
    name: "Modern Stack",
    viz: "",
    ingredients: {},
    onto: Backend_BASIC_ONTO,
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
