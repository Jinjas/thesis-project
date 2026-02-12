import React from "react";
import { Sidebar } from "../components";
import BaseLayout from "./baseLayout";

type Props = {
  title: string;
  children: React.ReactNode;
  typeOf2: string;
  withViz?: boolean;
};

export default function DoubleSectionLayout({
  title,
  children,
  typeOf2,
  withViz = false,
}: Props) {
  let children2 = <div></div>;
  switch (typeOf2) {
    case "ingredList":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen justify-center">
          <h2 className="text-2xl font-semibold pb-4">Conteúdo</h2>

          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      );
      break;
    default:
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">Conteúdo</h2>

          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      );
  }

  return (
    <BaseLayout withViz={withViz}>
      <section className="flex-1 p-9 bg-gray-100 text-black flex flex-col w-full h-screen">
        <h1 className="text-2xl font-bold ">{title}</h1>
        {children}
      </section>

      {children2}
    </BaseLayout>
  );
}
