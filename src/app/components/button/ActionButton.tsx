"use client";

import { X } from "lucide-react";

type Props = {
  onClick: () => void;
  label: any;
  variant?:
    | "save"
    | "remove"
    | "close"
    | "expand"
    | "expand2"
    | "double"
    | "underlined";
  disabled?: boolean;
};

export default function ActionButton({
  onClick,
  label,
  variant = "save",
  disabled = false,
}: Props) {
  const baseClasses = "  hover:opacity-90 cursor-pointer";

  const variantClasses = {
    remove:
      "disabled:bg-gray-400 text-white rounded px-3 py-2 bg-red-800 hover:bg-red-950",
    save: "disabled:bg-gray-400 text-white rounded px-3 py-2 bg-gray-700 hover:bg-gray-900",
    expand:
      "disabled:bg-gray-400 text-white rounded px-1 py-1 bg-gray-700 hover:bg-gray-900 text-xs",
    expand2:
      "disabled:bg-gray-400 text-black rounded px-6 py-1 hover:bg-gray-100",
    double:
      " disabled:bg-gray-200 rounded w-full px-2 text-2xl font-semibold hover:bg-gray-100 bg-transparent ",
    underlined: "font-semibold pb-2 hover:underline cursor-pointer",
    close:
      "disabled:text-gray-400 inline-flex h-8 min-w-8 items-center justify-center rounded px-0.5 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={variant === "close" ? label : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {variant === "close" ? <X size={22} strokeWidth={2.75} /> : label}
    </button>
  );
}
