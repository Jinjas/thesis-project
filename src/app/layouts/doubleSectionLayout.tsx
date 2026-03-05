import React from "react";
import BaseLayout from "./baseLayout";
import { Sidebar, VizBar, SectionTable } from "../components";

type Props = {
  title: string;
  children: React.ReactNode;
  typeOf2: string;
  withViz?: boolean;
  extraFlag?: string;
};

type TableData = {
  section: string;
  rows: string[][];
};

const tableData: TableData[] = [
  {
    section: "section",
    rows: [
      ["1", "1-data2", "1-data3", "1.0"],
      ["2", "2-data2", "2-data3", "1.0"],
    ],
  },
  {
    section: "section2",
    rows: [["3", "3-data2", "3-data3", "1.0"]],
  },
];

export default function DoubleSectionLayout({
  title,
  children,
  typeOf2,
  withViz = false,
  extraFlag = "",
}: Props) {
  let children2 = <div></div>;
  switch (typeOf2) {
    case "ingredientList":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen justify-center">
          <h2 className="text-2xl font-semibold pb-4">Conteúdo</h2>

          <p className="text-gray-600 max-w-md">
            Resultados, visualizações, ferramentas.
          </p>
        </section>
      );
      break;

    case "ingredientDetail":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <h2 className="text-2xl font-semibold pb-4">
            Cognitive Production Table
          </h2>

          <SectionTable data={tableData} />
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
