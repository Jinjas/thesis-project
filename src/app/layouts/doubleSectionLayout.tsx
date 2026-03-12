import React from "react";
import BaseLayout from "./baseLayout";
import { Sidebar, VizBar, TableData } from "../components";

type Props = {
  title: string;
  children: React.ReactNode;
  typeOf2: string;
  withViz?: boolean;
  extraFlag?: string;
  id?: string;
};

export default function DoubleSectionLayout({
  title,
  children,
  typeOf2,
  withViz = false,
  extraFlag = "",
  id = "",
}: Props) {
  let children2 = <div></div>;
  switch (typeOf2) {
    case "cocktailList":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">
            Cognitive Production Table
          </h2>

          <TableData type={3} selectedId={id} />
        </section>
      );
      break;

    case "ingredientDetail":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">
            Cognitive Production Table
          </h2>

          <TableData type={0} />
        </section>
      );
      break;
    case "cocktailDetail":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">
            Cognitive Production Table
          </h2>

          <TableData type={1} />
        </section>
      );
      break;
    case "ingredientList":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">
            Cognitive Production Table
          </h2>

          <TableData type={2} selectedId={id} />
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
      <section
        className={`flex-1 p-9 bg-gray-100 text-black flex flex-col w-full ${extraFlag != "" ? extraFlag : "h-screen"}`}
      >
        <h1 className="text-2xl font-bold ">{title}</h1>
        {children}
      </section>

      {children2}
    </BaseLayout>
  );
}
