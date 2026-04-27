"use client";

import ActionButton from "../button/ActionButton";

type ConfirmationBoxProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  boldDescription?: string;
  confirmLabel?: string;
  confirmVariant?: "save" | "remove";
  cancelLabel?: string;
  cancelVariant?: "save" | "remove";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationBox({
  isOpen,
  title,
  description = "This action cannot be undone.",
  boldDescription = "",
  confirmLabel = "Remove",
  confirmVariant = "remove",
  cancelLabel = "Cancel",
  cancelVariant = "save",
  onCancel,
  onConfirm,
}: ConfirmationBoxProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-box-title"
    >
      <div
        className="w-full max-w-md rounded border bg-gray-200 p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirmation-box-title" className="text-lg font-semibold">
          {title}
        </h3>

        <p className="pt-2 text-sm text-gray-600">{description}</p>
        <p className="pt-2 text-sm text-gray-600 font-bold">
          {boldDescription}
        </p>

        <div className="pt-4 flex justify-between gap-2">
          <ActionButton
            onClick={onCancel}
            label={cancelLabel}
            variant={cancelVariant}
          />

          <ActionButton
            onClick={onConfirm}
            label={confirmLabel}
            variant={confirmVariant}
          />
        </div>
      </div>
    </div>
  );
}
