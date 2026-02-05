"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { useState, useEffect, useRef } from "react";
import { IngredientType, INGREDIENT_TYPES } from "../../types";
import TypeSelector from "../../components/TypeSelector";
import CodeEdit from "../../components/CodeEdit";
import Sidebar from "../../components/Sidebar";

export default function IngredientDetailPage() {
  const { id } = useParams();
  const { ingredients, updateIngredient, remIngredient } = useAppContext();
  const router = useRouter();
  const ingredient = ingredients.find((i) => i.id === id);

  const [name, setName] = useState("");
  const [type, setType] = useState<IngredientType>("Language");
  const [code, setCode] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setType(ingredient.type);
      setCode(ingredient.code);
    }
  }, [ingredient]);

  useEffect(() => {
    if (!ingredient) {
      router.replace("/ingredients");
    }
  }, [ingredient, router]);

  if (!ingredient) return <p className="p-6">Redirecting…</p>;

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      setCode(text);
    };

    reader.readAsText(file);

    e.target.value = "";
  }

  function handleExport() {
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "ingredient"}.txt`; // nome do ficheiro
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
          <h1 className="text-2xl font-bold pb-4">Edit Ingredient</h1>

          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 max-w-[493px]">
            <h3 className=" lg:p-2 lg:pr-1 lg:w-[50px] ">Name:</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-1 pl-2 rounded lg:w-[calc(100%-150px)] text-sm"
            />
          </div>

          <div className="pt-2 flex flex-col lg:flex-row gap-2 lg:gap-4 max-w-[493px]">
            <label className="lg:p-2 lg:pr-1 lg:w-[50px]">Type:</label>

            <TypeSelector
              value={type}
              onChange={setType}
              types={INGREDIENT_TYPES}
            />
          </div>

          <div className="pt-4 px-2 flex flex-col h-full">
            <div className="pt-4 flex justify-between">
              <h3 className="font-semibold pb-2"> OntoDL</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleImportClick}
                  className="font-semibold pb-2 hover:underline"
                >
                  Import
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.ontodl"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </button>

                <button
                  onClick={handleExport}
                  className="font-semibold pb-2 hover:underline"
                >
                  Export
                </button>
              </div>
            </div>

            <CodeEdit code={code} setCode={setCode} />
          </div>
          <div className=" pt-2 px-2 flex gap-2 justify-end">
            <button
              onClick={() => {
                remIngredient(ingredient.id);
                router.push("/ingredients");
              }}
              className=" bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded w-min"
            >
              Remove
            </button>
            <button
              onClick={() => updateIngredient(ingredient.id, name, type, code)}
              className=" bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded w-min"
            >
              Save
            </button>
          </div>
        </section>

        <section className="flex-1 p-10 bg-white text-black border-l border-gray-300 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold pb-4">Conteúdo</h2>

          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      </main>
    </div>
  );
}
