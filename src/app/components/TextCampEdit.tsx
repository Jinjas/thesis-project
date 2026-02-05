"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextCampEdit({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 max-w-[493px]">
      <h3 className="lg:p-2 lg:pr-1 lg:w-[50px]">{label}:</h3>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 pl-2 rounded lg:w-[calc(100%-150px)] text-sm"
      />
    </div>
  );
}
