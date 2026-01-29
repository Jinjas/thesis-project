export default function Home() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col gap-4 bg-gray-900 text-white p-6">
        <p className="font-semibold">pos1</p>
        <p className="font-semibold">pos2</p>
      </aside>

      {/* Área principal dividida ao meio */}
      <main className="flex flex-1">
        {/* Coluna esquerda */}
        <section className="flex-1 p-10 bg-gray-100 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Projeto de Tese</h1>
          <p className="text-gray-700 max-w-md">
            Aplicação privada de suporte ao desenvolvimento da investigação.
          </p>
        </section>

        {/* Coluna direita */}
        <section className="flex-1 p-10 bg-white border-l border-gray-300 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Conteúdo</h2>
          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      </main>
    </div>
  );
}
