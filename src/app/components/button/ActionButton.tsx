"use client";

type Props = {
  onClick: () => void;
  label: string;
  variant?: "save" | "remove" | "expand" | "double";
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
      "disabled:bg-gray-400 text-white rounded w-min px-3 py-2 bg-red-800 hover:bg-red-900",
    save: "disabled:bg-gray-400 text-white rounded w-min px-3 py-2 bg-gray-700 hover:bg-gray-800",
    expand:
      "disabled:bg-gray-400 text-white rounded w-min px-1 py-1 bg-gray-700 hover:bg-gray-800 text-xs",
    double:
      " disabled:bg-gray-200 rounded w-full px-2 text-2xl font-semibold hover:bg-gray-100 bg-transparent ",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}
