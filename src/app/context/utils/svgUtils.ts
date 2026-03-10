export function normalizeSvg(svg: string) {
  return typeof svg === "string" && svg.trim().startsWith("<")
    ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    : svg;
}
