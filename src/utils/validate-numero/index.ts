export function validateNumero(value: string): true | string {
  // Campo não é obrigatório, então vazio é válido
  if (!value || value.trim() === "") {
    return true;
  }

  // Aceita "S/N" (case insensitive)
  if (value.toUpperCase() === "S/N") {
    return true;
  }

  // Verifica se é um número
  const num = Number(value);
  if (isNaN(num)) {
    return "Deve ser um número ou 'S/N'";
  }

  // Verifica se é negativo
  if (num < 0) {
    return "Não pode ser negativo";
  }

  // Verifica se é decimal
  if (!Number.isInteger(num)) {
    return "Não pode ser decimal";
  }

  return true;
}
