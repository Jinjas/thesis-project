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
  const imgRef = useRef<HTMLImageElement>(null);

  function zoomIn() {
    onScaleChange(Math.min(scale + 0.2, 4));
  }

  function zoomOut() {
    onScaleChange(Math.max(scale - 0.2, 0.2));
  }

  useEffect(() => {
    if (!containerRef.current || !imgRef.current) return;
    if (scale !== 1) return;

    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const iw = imgRef.current.naturalWidth;
    const ih = imgRef.current.naturalHeight;

    if (!iw || !ih) return;

    const scaleX = cw / iw;
    const scaleY = ch / ih;

    onScaleChange(Math.min(scaleX, scaleY));
  }, [pdfUrl, onScaleChange, scale]);

  function handleImageLoad() {
    if (!containerRef.current || !imgRef.current) return;

    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const iw = imgRef.current.naturalWidth;
    const ih = imgRef.current.naturalHeight;

    if (!iw || !ih) return;

    const scaleX = cw / iw;
    const scaleY = ch / ih;

    onScaleChange(Math.min(scaleX, scaleY));
  }

  return (
    <aside className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-lg font-bold">Visualization Bar</h2>

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
        <p className="text-sm text-gray-500">No visualization available</p>
      ) : (
        <div ref={containerRef} className="flex-1 overflow-auto">
          <div
            style={{
              width: imgRef.current
                ? imgRef.current.naturalWidth * scale
                : "auto",
              height: imgRef.current
                ? imgRef.current.naturalHeight * scale
                : "auto",
            }}
          >
            <img
              ref={imgRef}
              src={pdfUrl}
              onLoad={handleImageLoad}
              style={{
                width: imgRef.current
                  ? imgRef.current.naturalWidth * scale
                  : "auto",
                height: imgRef.current
                  ? imgRef.current.naturalHeight * scale
                  : "auto",
              }}
              draggable={false}
              className="block select-none"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
