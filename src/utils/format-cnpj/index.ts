export function formatCNPJ(cnpj: string) {
  // Remove qualquer caractere não numérico
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return cnpj; // Retorna o original se não tiver o tamanho correto
  }

  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  return cleanCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
