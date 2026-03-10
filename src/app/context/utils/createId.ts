export function createId(prefix: string, name: string) {
  return `${prefix}-${name.toLowerCase().replace(" ", "_")}`;
}
