"use client";

/*usage:

<ImportButton setCode={setCode} />
*/

import { useRef } from "react";

type Props = {
  setCode: (code: string) => void;
};

export default function ImportButton({ setCode }: Props) {
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
      setCode(text);
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
