export const applyCEPMask = (value: string) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 8 dígitos
  const truncated = numbers.slice(0, 8);

  // Aplica a máscara progressivamente (00000-000)
  let masked = truncated;

  if (truncated.length > 5) {
    masked = truncated.slice(0, 5) + "-" + truncated.slice(5);
  }

  return masked;
};
