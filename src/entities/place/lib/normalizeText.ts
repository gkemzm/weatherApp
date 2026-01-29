export function normalizeText(input: string) {
  return input.trim().toLowerCase().replaceAll("-", " ").replace(/\s+/g, " ");
}
