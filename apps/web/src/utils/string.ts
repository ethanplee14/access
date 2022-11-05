export function commaSeparate(text: string) {
  const separated = text.split(",").map((t) => t.trim());
  if (!separated[separated.length - 1]) {
    separated.pop();
  }
  return separated;
}
