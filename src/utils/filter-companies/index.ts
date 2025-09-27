import { type Companies } from "@/types";

type FilterCompaniesArgs = {
  companies: Companies;
  searchTerm: string;
};

export function filterCompanies({
  companies,
  searchTerm,
}: FilterCompaniesArgs): Companies {
  if (!searchTerm.trim()) {
    return companies;
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();

  return companies.filter((company) => {
    const matchesNomeFantasia = company.nome_fantasia
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesRazaoSocial = company.razao_social
      .toLowerCase()
      .includes(normalizedSearch);

    // Remove formatação do termo de busca para comparar com CNPJ
    const searchNumbers = normalizedSearch.replace(/\D/g, "");

    // Só tenta match com CNPJ se houver pelo menos 6 dígitos
    const matchesCNPJ =
      searchNumbers.length >= 6 && company.cnpj.includes(searchNumbers);

    return matchesNomeFantasia || matchesRazaoSocial || matchesCNPJ;
  });
}
