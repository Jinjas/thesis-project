export function createId(prefix: string, name: string) {
  return `${prefix}-${name.toLowerCase().replaceAll(" ", "_")}`;
}
