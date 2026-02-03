"use client";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

export default function CodePreview({ code, setCode }: Props) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Ingredient Code</h3>

      {/* Editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write ingredient code here..."
        className="w-full border rounded p-2 font-mono text-sm h-28"
      />

      {/* Preview */}
      <div className="mt-3 bg-gray-900 text-green-200 rounded p-3 font-mono text-sm whitespace-pre-wrap">
        {code.trim() === "" ? "(empty)" : code}
      </div>
    </div>
  );
}
