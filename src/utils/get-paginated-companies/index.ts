import { Companies } from "@/types";

type GetPaginatedCompaniesArgs = {
  currentPage: number;
  perPage: number;
  validatedCompanies: Companies;
};

export function getPaginatedCompanies({
  currentPage,
  perPage,
  validatedCompanies,
}: GetPaginatedCompaniesArgs) {
  // Calcula os índices para o slice
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  // Fatia o array para pegar apenas os itens da página atual
  return validatedCompanies.slice(startIndex, endIndex);
}
