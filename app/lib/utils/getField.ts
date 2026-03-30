export function getField(text: string, field: string) {
  const match = text.match(new RegExp(`${field}[:：]\\s*(.+)`));
  return match ? match[1].split('\n')[0].trim() : null;
}
