"use client";

import { useState } from "react";
import type { TableDict } from "../../types";
import { FeaturePopup, type FeatureOption } from "../popups";
import {
  exportVisualization,
  type VizExportFormat,
} from "@/app/context/utils/vizExport";

/*usage:

<ExportButton code={code} filename={name || "ingredient"} table={ingredient.table} />
*/

type Props = {
  code: string;
  filename?: string;
  label?: string;
  options: readonly FeatureOption[];
  table?: TableDict[];
  viz?: string;
};

function escapeDelimitedValue(value: string, delimiter: string) {
  if (
    new RegExp(
      `["${delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\n\r\t]`,
    ).test(value)
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function tableToCsv(table: TableDict[]) {
  const rows: string[][] = [["Num", "Condition", "Action", "C.S."]];

  for (const section of table) {
    const sectionLabel = section.title ?? section.section;

    rows.push([sectionLabel, "", "", ""]);

    for (const row of section.rows) {
      rows.push(row);
    }
  }

  const delimiter = ";";

  return rows
    .map((row) =>
      row
        .map((value) => escapeDelimitedValue(value, delimiter))
        .join(delimiter),
    )
    .join("\r\n");
}

function tableToExcel(table: TableDict[]) {
  const rows: string[][] = [["Num", "Condition", "Action", "C.S."]];

  for (const section of table) {
    const sectionLabel = section.title ?? section.section;

    rows.push([sectionLabel, "", "", ""]);

    for (const row of section.rows) {
      rows.push(row);
    }
  }

  return rows
    .map((row) =>
      row.map((value) => escapeDelimitedValue(value, "\t")).join("\t"),
    )
    .join("\r\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function ExportButton({
  code,
  filename = "ingredient",
  label = "Export",
  options,
  table,
  viz,
}: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const visualizationFormats = new Set(["svg", "jpeg", "png", "pdf"]);

  function handleExport(format: string) {
    if (format === "csv") {
      if (!table?.length) return;
      downloadFile(
        tableToCsv(table),
        `${filename}.csv`,
        "text/csv;charset=utf-8",
      );
      return;
    }

    if (format === "xls") {
      if (!table?.length) return;
      downloadFile(
        tableToExcel(table),
        `${filename}.xls`,
        "application/vnd.ms-excel;charset=utf-8",
      );
      return;
    }

    if (visualizationFormats.has(format)) {
      if (!viz) return;

      void exportVisualization(viz, filename, format as VizExportFormat);

      return;
    }

    const extension = format === "ontodl" ? "ontodl" : "txt";
    downloadFile(code, `${filename}.${extension}`, "text/plain;charset=utf-8");
  }

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="font-semibold pb-2 hover:underline cursor-pointer"
      >
        {label}
      </button>

      <FeaturePopup
        isOpen={isPopupOpen}
        title="Export"
        description="Choose how you want to export this content."
        options={options as FeatureOption[]}
        mode="export"
        onClose={() => setIsPopupOpen(false)}
        onImport={() => {}}
        onExport={(feature) => handleExport(feature)}
      />
    </>
  );
}
