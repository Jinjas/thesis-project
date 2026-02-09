"use client";

/*usage:

<ImportButton func={setCode} />
*/

import { useRef } from "react";

type Props = {
  func: (code: string) => void;
};

export default function ImportButton({ func }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      func(text);
    };

    reader.readAsText(file);

    e.target.value = "";
  }

  return (
    <button
      onClick={handleImportClick}
      className="font-semibold pb-2 hover:underline"
    >
      Import
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.ontodl"
        className="hidden"
        onChange={handleFileChange}
      />
    </button>
  );
}
