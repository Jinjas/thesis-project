// app/data.ts
import { Ingredient, Cocktail } from "../types";

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
    name: "Next.js",
    type: "Framework",
    code: "export default function Page() {}",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    type: "Tool",
    code: "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
  },
  {
    id: "vite",
    name: "Vite",
    type: "Tool",
    code: "import { defineConfig } from 'vite';",
  },
];

export const COCKTAILS: Cocktail[] = [
  {
    id: "frontend-basic",
    name: "Frontend Basic",
    viz: "/viz/OJS.svg",
    ingredients: {
      js: true,
      react: true,
      tailwind: true,
      ts: true,
      next: true,
    },
  },
  {
    id: "modern-stack",
    name: "Modern Stack",
    viz: "/viz/OJS.svg",
    ingredients: {
      ts: true,
      react: true,
      next: true,
      tailwind: true,
      vite: true,
    },
  },
  {
    id: "vanilla-dev",
    name: "Vanilla Dev",
    viz: "/viz/OJS.svg",
    ingredients: {
      js: true,
      ts: true,
      react: true,
      vite: true,
    },
  },
];
