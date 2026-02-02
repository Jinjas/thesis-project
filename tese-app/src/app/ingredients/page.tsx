"use client";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";

export default function MainPage() {
  const { search } = useAppContext();

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex flex-1">
        <section className="flex-1 p-10 bg-gray-100 text-black flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Ingredients</h1>

          <p className="mt-4">
            Você pesquisou: <strong>{search}</strong>
          </p>
        </section>

        <section className="flex-1 p-10 bg-white text-black border-l border-gray-300 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Conteúdo</h2>
          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      </main>
    </div>
  );
}
