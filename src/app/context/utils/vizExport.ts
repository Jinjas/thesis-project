import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";

export type VizExportFormat = "svg" | "jpeg" | "png" | "pdf";

function sanitizeFilename(value: string) {
  return value.replace(/[\\/:*?"<>|]+/g, "-").trim() || "export";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function readSvgContent(svgUrl: string) {
  const response = await fetch(svgUrl);

  if (!response.ok) {
    throw new Error(`Failed to load visualization: ${response.status}`);
  }

  return await response.text();
}

async function svgUrlToCanvas(svgUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () =>
      reject(new Error("Failed to load visualization image"));
    element.src = svgUrl;
  });

  const width = Math.max(1, Math.round(image.naturalWidth));
  const height = Math.max(1, Math.round(image.naturalHeight));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create canvas context");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return { canvas, width, height };
}

function svgTextToElement(svgText: string) {
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.documentElement;

  if (svgElement.nodeName.toLowerCase() !== "svg") {
    throw new Error("Visualization is not a valid SVG");
  }

  return svgElement as unknown as SVGElement;
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
) {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function parseSvgLength(value: string | null) {
  if (!value) return undefined;

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function measureSvg(svgElement: SVGElement) {
  const widthFromAttribute = parseSvgLength(svgElement.getAttribute("width"));
  const heightFromAttribute = parseSvgLength(svgElement.getAttribute("height"));
  const viewBox = svgElement
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map((value) => Number.parseFloat(value));

  const width =
    widthFromAttribute ??
    (viewBox && viewBox.length === 4 && viewBox[2] > 0 ? viewBox[2] : 1000);
  const height =
    heightFromAttribute ??
    (viewBox && viewBox.length === 4 && viewBox[3] > 0 ? viewBox[3] : 1000);

  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

export async function exportVisualization(
  svgUrl: string,
  filename: string,
  format: VizExportFormat,
) {
  const safeFilename = sanitizeFilename(filename);

  if (format === "svg") {
    const svgText = await readSvgContent(svgUrl);
    downloadBlob(
      new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      `${safeFilename}.svg`,
    );
    return;
  }

  const { canvas } = await svgUrlToCanvas(svgUrl);

  if (format === "png") {
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `${safeFilename}.png`);
    return;
  }

  if (format === "jpeg") {
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.96);
    downloadBlob(blob, `${safeFilename}.jpeg`);
    return;
  }

  const svgText = await readSvgContent(svgUrl);
  const svgElement = svgTextToElement(svgText);
  const { width, height } = measureSvg(svgElement);
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
  });

  await svg2pdf(svgElement, pdf, {
    x: 0,
    y: 0,
    width,
    height,
  });
  pdf.save(`${safeFilename}.pdf`);
}
