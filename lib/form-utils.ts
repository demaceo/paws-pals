export function formatPhoneUS(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const parts = [] as string[];
  if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
  if (digits.length >= 4) parts[0] += ") ";
  if (digits.length >= 4) parts.push(digits.slice(3, 6));
  if (digits.length >= 7) parts[1] += "-";
  if (digits.length >= 7) parts.push(digits.slice(6, 10));
  return parts.join("");
}
