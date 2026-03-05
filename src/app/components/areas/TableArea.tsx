"use client";

import React from "react";

type TableData = {
  section: string;
  rows: string[][];
};

type Props = {
  data: TableData[];
};

export default function SectionTable({ data }: Props) {
  return (
    <div className=" overflow-y-auto border-y border-r">
      <table className="w-full text-sm table-fixed">
        {/* HEADER FIXO */}
        <thead className="sticky top-0 bg-gray-300 z-10">
          <tr>
            <th className="w-[8%] px-2 py-1 text-center border-l">Num</th>
            <th className="w-[42%] px-2 py-1 text-center">Condition</th>
            <th className="w-[42%] px-2 py-1 text-center">Action</th>
            <th className="w-[8%] px-1 py-1 text-center">C.S.</th>
          </tr>
        </thead>

        <tbody>
          {data.map((section, i) => (
            <React.Fragment key={i}>
              <tr className="bg-gray-200">
                <td
                  colSpan={4}
                  className="px-2 py-1 border border-r-0  border-b-0 text-center font-semibold"
                >
                  {section.section}
                </td>
              </tr>

              {section.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td
                      key={k}
                      className={`px-2 py-1 border border-r-0  border-b-0 ${k == 0 || k == 3 ? "text-center" : "text-left"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
