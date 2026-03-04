"use client";

type Props = {
  onClick: () => void;
  label: string;
  variant?: "save" | "remove" | "expand";
  disabled?: boolean;
};

export default function ActionButton({
  onClick,
  label,
  variant = "save",
  disabled = false,
}: Props) {
  const baseClasses =
    "text-white rounded w-min disabled:bg-gray-400 hover:opacity-90 cursor-pointer";

  const variantClasses = {
    remove: "px-3 py-2 bg-red-800 hover:bg-red-900",
    save: "px-3 py-2 bg-gray-700 hover:bg-gray-800",
    expand: "px-1 py-1 bg-gray-700 hover:bg-gray-800 text-xs",
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
