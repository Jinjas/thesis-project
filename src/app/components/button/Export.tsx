"use client";

/*usage:

<ExportButton code={code} filename={name || "ingredient"} />
*/

type Props = {
  code: string;
  filename?: string;
  label?: string;
};

export default function ExportButton({
  code,
  filename = "ingredient",
  label = "Export",
}: Props) {
  function handleExport() {
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="font-semibold pb-2 hover:underline"
    >
      Export
    </button>
  );
}
