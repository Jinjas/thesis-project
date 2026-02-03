"use client";

type Props = {
  code: string;
  setCode: (value: string) => void;
};

export default function CodeEdit({ code, setCode }: Props) {
  return (
    <textarea
      rows={10}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Write ingredient code here..."
      className="w-full border rounded p-2 font-mono h-full text-sm"
    />
  );
}
