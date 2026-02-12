"use client";

type Props = {
  onClick: () => void;
  label: string;
  variant?: "save" | "remove";
  disabled?: boolean;
};

export default function ActionButton({
  onClick,
  label,
  variant = "save",
  disabled = false,
}: Props) {
  const baseClasses =
    "text-white px-3 py-2 rounded w-min disabled:bg-gray-400 hover:opacity-90";

  const variantClasses = {
    remove: "bg-red-800 hover:bg-red-900",
    save: "bg-gray-700 hover:bg-gray-800",
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
