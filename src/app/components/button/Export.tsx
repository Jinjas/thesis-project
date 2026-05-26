"use client";

import { useMemo, useState } from "react";
import type { TableDict } from "../../types";
import ActionButton from "./ActionButton";
import GenericSearch from "./GenericSearch";

export type ExportOption = {
  value: string;
  label: string;
};

/*usage:

<ExportButton code={code} filename={name || "ingredient"} table={ingredient.table} />
*/

type Props = {
  code: string;
  filename?: string;
  label?: string;
  options: readonly ExportOption[];
  table?: TableDict[];
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
}: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const visibleOptions = useMemo(() => options, [options]);

  function closePopup() {
    setIsPopupOpen(false);
    setSelectedFormat("");
    setSearchInput("");
  }

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

    const extension = format === "ontodl" ? "ontodl" : "txt";
    downloadFile(code, `${filename}.${extension}`, "text/plain;charset=utf-8");
  }

  function handleExportClick() {
    if (!selectedFormat) return;
    handleExport(selectedFormat);
    closePopup();
  }

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="font-semibold pb-2 hover:underline cursor-pointer"
      >
        {label}
      </button>

      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-popup-title"
        >
          <div
            className="w-full max-w-md rounded border bg-gray-200 p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between gap-2">
              <h3
                id="export-popup-title"
                className="text-lg font-semibold text-black"
              >
                Export
              </h3>
              <ActionButton
                onClick={closePopup}
                label="Close"
                variant="close"
              />
            </div>

            <p className="pt-2 text-sm text-gray-600">
              Choose how you want to export this content.
            </p>

            <div className="pt-4 flex gap-3 items-start">
              <div className="flex-1">
                <GenericSearch
                  elementsKV={visibleOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder="Select format..."
                  value={searchInput}
                  onChange={(value) => {
                    setSearchInput(value);
                    const match = visibleOptions.find(
                      (option) =>
                        option.label.trim().toLowerCase() ===
                        value.trim().toLowerCase(),
                    );
                    setSelectedFormat(match?.value ?? "");
                  }}
                  onSelect={(value) => {
                    setSelectedFormat(value);
                    const label =
                      visibleOptions.find((option) => option.value === value)
                        ?.label ?? value;
                    setSearchInput(label);
                  }}
                  showOnFocus={true}
                />
              </div>

              <div className="flex-shrink-0">
                <ActionButton
                  onClick={handleExportClick}
                  label="Export File"
                  variant="save"
                  disabled={!selectedFormat}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
