"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

type Props = {
  pdfUrl?: string;
  scale: number;
  onScaleChange: (s: number) => void;
};

export default function VisSidebar({ pdfUrl, scale, onScaleChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  function zoomIn() {
    onScaleChange(Math.min(scale + 0.2, 4));
  }

  function zoomOut() {
    onScaleChange(Math.max(scale - 0.2, 0.2));
  }

  const fitToContainer = (iw: number, ih: number) => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight || 150;

    if (!cw || !ch) return;

    const scaleX = cw / iw;
    const scaleY = ch / ih;

    onScaleChange(Math.min(scaleX, scaleY));
  };

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    setDimensions({ width: iw, height: ih });
    fitToContainer(iw, ih);
  }

  useEffect(() => {
    if (dimensions) {
      fitToContainer(dimensions.width, dimensions.height);
    }
  }, [pdfUrl]);

  return (
    <aside className="flex flex-col max-h-full min-w-0">
      <div className="flex items-center justify-between pb-1 flex-shrink-0">
        <h2 className="text-lg font-bold">Cocktail Identity Card</h2>

        <div className="flex gap-1">
          <button
            onClick={zoomOut}
            className="p-1 border rounded hover:bg-gray-200 cursor-pointer"
          >
            <Minus size={16} />
          </button>

          <button
            onClick={zoomIn}
            className="p-1 border rounded hover:bg-gray-200 cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {!pdfUrl ? (
        <p className="text-xs text-gray-500">No visualization available</p>
      ) : (
        <div
          ref={containerRef}
          className="w-full max-h-[140px] overflow-auto min-w-0 border border-gray-200 rounded bg-white"
          style={{ scrollbarGutter: "stable" }}
        >
          {dimensions && (
            <div
              style={{
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              }}
              className="max-w-none flex items-center justify-center m-auto"
            >
              <img
                src={pdfUrl}
                onLoad={handleImageLoad}
                className="w-full h-full object-contain block"
                draggable={false}
                alt="PDF Preview"
              />
            </div>
          )}

          {!dimensions && (
            <img
              src={pdfUrl}
              onLoad={handleImageLoad}
              className="hidden"
              alt=""
            />
          )}
        </div>
      )}
    </aside>
  );
}
