"use client";

import { ActionButton } from "./components";
import { redirect } from "next/navigation";
import DiagonalLineLayout from "./layouts/diagonalLineLayout";

export default function Home() {
  return (
    <DiagonalLineLayout
      leftContent={
        <article className="flex flex-col gap-2 pl-10 h-full w-full">
          <div className="flex flex-col gap-2 pl-13 lg:pt-45 sm:pt-30">
            <h1 className="font-bold text-7xl">COSMO</h1>
            <h2 className="font-bold pl-2 text-2xl">
              Cocktail Cognitive Structure Model
            </h2>
          </div>

          {/*<p className="flex lg:pt-25 sm:pt-10 pr-30 text-justify text-lg">
            A web application designed to define Cognitive Production Models,
            and ease the creation, management, and processing of Cognitive
            Entropy for Programming Cocktails and their respective Ingredients.
          </p>*/}

          <div className="absolute bottom-14 left-14">
            <p className="font-bold text-xl">Project Team:</p>
            <ul className="pt-2 pl-2 flex flex-col gap-1 text-lg">
              <li className="font-bold">Rodrigo Casal Novo</li>
              <li>Alvaro Costa Neto</li>
              <li>Pedro Rangel Henriques</li>
            </ul>
          </div>
        </article>
      }
      rightContent={
        <article className="grid grid-rows-[1fr_auto_1fr] h-full w-full">
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto] grid-cols-1 xl:pl-40 xl:pr-40 pl-20 pr-20 pt-50 items-center gap-x-6 gap-y-4">
            <p className="text-xl font-bold hidden lg:block">
              Inspect the COSMO app:
            </p>
            <ActionButton
              label="Go to Cocktails"
              onClick={() => {
                redirect("/cocktails");
              }}
            />
            <p className="pt-3 text-xl font-bold hidden lg:block">
              Check repository with ingredient definitions:
            </p>
            <ActionButton
              label="Go to Zenodo"
              onClick={() => {
                window.open("https://zenodo.org/records/23730309", "_blank");
              }}
            />
          </div>

          <div className="absolute bottom-12 left-2 pr-15">
            <h2 className="text-2xl font-bold">COSMO Project</h2>
            <p className="pt-2 text-md text-justify">
              This program is part of the Master's thesis of Rodrigo Casal Novo
              at the University of Minho with the title "Construction of
              Cognitive Production Tables for Programming Cocktails".
            </p>
            <p className="pt-1 text-md text-justify">
              Cosmo is a web application designed to define Cognitive Production
              Models, and ease the creation, management, and processing of
              Cognitive Entropy for Programming Cocktails and their respective
              Ingredients.
            </p>
          </div>
        </article>
      }
    />
  );
}
