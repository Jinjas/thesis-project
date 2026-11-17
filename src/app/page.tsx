"use client";

import { ActionButton } from "./components";
import { redirect } from "next/navigation";
import DiagonalLineLayout from "./layouts/diagonalLineLayout";

export default function Home() {
  return (
    <DiagonalLineLayout
      leftContent={
        <article className="relative h-full w-full text-white">
          <div className="absolute left-12 top-1/4 max-w-md -translate-y-1/2">
            <h1 className="text-4xl font-bold">COSMO</h1>
            <h2 className="text-2xl font-bold">
              Cocktail Cognitive Structure Model
            </h2>

            <p className="mt-4 text-lg">
              COSMO is a web application that allows users to explore the
              cognitive structure of cocktails. It provides a visual
              representation of the relationships between different cocktail
              ingredients and their effects.
            </p>
          </div>

          <div className="absolute bottom-12 left-12">
            <p className="font-bold">Project team:</p>
            <ul className="mt-2 flex flex-col gap-1">
              <li>Rodrigo Casal Novo</li>
              <li>Alvaro Costa Neto</li>
              <li>Pedro Rangel Henriques</li>
            </ul>
          </div>
        </article>
      }
      rightContent={
        <article className="relative h-full w-full">
          <div className="absolute left-8 top-[38%] flex -translate-y-1/2 flex-col items-start gap-3">
            <p className="text-xl font-bold">try it out:</p>
            <ActionButton
              label="Go to Cocktails"
              onClick={() => {
                redirect("/cocktails");
              }}
            />
            <p className="mt-3 text-xl font-bold">
              Check repository with available files:
            </p>
            <ActionButton
              label="Go to Zenodo"
              onClick={() => {
                window.open("https://zenodo.org/records/23730309", "_blank");
              }}
            />
          </div>

          <div className="absolute bottom-12 left-8 max-w-sm">
            <h2 className="text-2xl font-bold">About</h2>
            <p className="mt-2 text-lg">
              This project is part of the final year thesis of Rodrigo Casal
              Novo at the University of Porto. The goal of this project is to
              explore the cognitive structure of cocktails and their
              ingredients. The project is supervised by Alvaro Costa Neto and
              Pedro Rangel Henriques.
            </p>
          </div>
        </article>
      }
    />
  );
}
