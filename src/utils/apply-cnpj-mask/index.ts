export const applyCNPJMask = (value: string) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  const truncated = numbers.slice(0, 14);

  // Aplica a máscara progressivamente
  let masked = truncated;

  if (truncated.length > 2) {
    masked = truncated.slice(0, 2) + "." + truncated.slice(2);
  }

  if (truncated.length > 5) {
    masked = masked.slice(0, 6) + "." + truncated.slice(5);
  }

  if (truncated.length > 8) {
    masked = masked.slice(0, 10) + "/" + truncated.slice(8);
  }

  if (truncated.length > 12) {
    masked = masked.slice(0, 15) + "-" + truncated.slice(12);
  }

  return masked;
};
