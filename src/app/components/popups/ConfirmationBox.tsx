"use client";

import ActionButton from "../button/ActionButton";

type ConfirmationBoxProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  boldDescription?: string;
  details?: string[];
  detailsTitle?: string;
  confirmLabel?: string;
  confirmVariant?: "save" | "remove";
  showCancel?: boolean;
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
  details = [],
  detailsTitle = "",
  confirmLabel = "Remove",
  confirmVariant = "remove",
  showCancel = true,
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
        <div className="flex justify-between gap-2">
          <h3 id="confirmation-box-title" className="text-lg font-semibold">
            {title}
          </h3>
          <ActionButton onClick={onCancel} label={"Close"} variant={"close"} />
        </div>

        <p className="pt-2 text-sm text-gray-600">{description}</p>
        <p className="pt-2 text-sm text-gray-600 font-bold">
          {boldDescription}
        </p>

        {details.length > 0 && (
          <div className="pt-2 text-sm text-gray-700">
            {detailsTitle && (
              <p className="font-semibold pb-1">{detailsTitle}</p>
            )}
            <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`pt-4 flex gap-6 ${showCancel ? "justify-around" : "justify-center"}`}
        >
          <ActionButton
            onClick={onConfirm}
            label={confirmLabel}
            variant={confirmVariant}
          />
          {showCancel && (
            <ActionButton
              onClick={onCancel}
              label={cancelLabel}
              variant={cancelVariant}
            />
          )}
        </div>
      </div>
    </div>
  );
}
