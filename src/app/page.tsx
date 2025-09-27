import { SearchBar } from "@/components/search-bar";
import { CompaniesList } from "@/components/companies-list";
import { PaginationControls } from "@/components/pagination-controls";
import { getPaginatedCompanies } from "@/utils/get-paginated-companies";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { companiesSchema } from "@/types";
import { filterCompanies } from "@/utils/filter-companies";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
  },
};

const companiesApiEndpoint =
  "https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/";

const perPage = 10;

type HomeProps = {
  searchParams: { page?: string; search?: string };
};

export default async function Home({ searchParams }: HomeProps) {
  const response = await fetch(companiesApiEndpoint, options);
  const companies = await response.json();
  const validatedCompanies = companiesSchema.safeParse(companies);
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const searchTerm = params.search || "";

  if (!validatedCompanies.success) {
    // lança erro que vai cair no error.tsx
    throw new Error("Lançou erro de schema!");
  }

  // Reverte a lista primeiro
  const reversedCompanies = validatedCompanies.data.reverse();
  // Aplica o filtro de busca
  const filteredCompanies = filterCompanies({
    companies: reversedCompanies,
    searchTerm,
  });

  const totalPages = Math.ceil(filteredCompanies.length / perPage);
  const paginatedCompanies = getPaginatedCompanies({
    currentPage,
    perPage,
    validatedCompanies: filteredCompanies,
  });

  const companiesFound = filteredCompanies.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} data-cy="homepageContainer">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Seção de título e busca */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Typography
            data-cy="pageHeading"
            variant="h4"
            component="h1"
            sx={{
              color: "#244C5A",
              fontWeight: 600,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              textAlign: "center",
            }}
          >
            Empresas Cadastradas
          </Typography>

          <SearchBar />
        </Box>

        {companiesFound ? (
          <CompaniesList companies={paginatedCompanies} />
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                mb: 2,
              }}
            >
              Nenhuma empresa encontrada
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#999",
              }}
            >
              Tente buscar por outro nome ou CNPJ
            </Typography>
          </Box>
        )}

        {companiesFound && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
