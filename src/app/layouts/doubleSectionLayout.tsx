import React, { useState } from "react";
import BaseLayout from "./baseLayout";
import { ActionButton, TableData } from "../components";

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
  const [selectedButton, setSelectedButton] = useState(true);

  let children2 = <div></div>;
  switch (typeOf2) {
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

    case "cocktailDetail":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <div className={` ${selectedButton ? "pb-4" : "pb-2"}`}>
            <div className="border-b-2 border-gray-500 flex justify-center w-full">
              <ActionButton
                onClick={() => setSelectedButton(true)}
                label="Cocktail View"
                variant="double"
                disabled={selectedButton}
              />
              <ActionButton
                onClick={() => setSelectedButton(false)}
                label="Ingredients View"
                variant="double"
                disabled={!selectedButton}
              />
            </div>
          </div>

          {selectedButton ? <TableData type={1} /> : <TableData type={4} />}
        </section>
      );
      break;

    case "cocktailList":
      children2 = (
        <section className="flex-1 p-9 bg-white text-black flex flex-col w-full h-screen ">
          <div className={` ${selectedButton ? "pb-4" : "pb-2"}`}>
            <div className="border-b-2 border-gray-500 flex justify-center w-full">
              <ActionButton
                onClick={() => setSelectedButton(true)}
                label="Cocktail View"
                variant="double"
                disabled={selectedButton}
              />
              <ActionButton
                onClick={() => setSelectedButton(false)}
                label="Ingredients View"
                variant="double"
                disabled={!selectedButton}
              />
            </div>
          </div>

          {selectedButton ? (
            <TableData type={3} selectedId={id} />
          ) : (
            <TableData type={5} selectedId={id} />
          )}
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
        <h1 className="text-2xl font-bold min-h-[32px] overflow-hidden text-ellipsis">
          {title}
        </h1>
        {children}
      </section>

      {children2}
    </BaseLayout>
  );
}
