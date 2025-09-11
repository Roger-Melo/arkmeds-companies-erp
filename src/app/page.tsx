import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { RendimentoDialog } from "@/components/rendimento-dialog";
import { z } from "zod";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.COMPANIES_API_TOKEN}`,
  },
};

const companiesSchema = z.array(
  z
    .object({
      cnpj: z.string(),
      estado: z.string(),
      municipio: z.string(),
      // necessário por que a API possui essas props tanto como camelCase quanto snake_case
      nome_fantasia: z.string().optional(),
      nomeFantasia: z.string().optional(),
      razao_social: z.string().optional(),
      razaoSocial: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      id: crypto.randomUUID(),
      cnpj: data.cnpj.replace(/\D/g, ""),
      nome_fantasia: data.nome_fantasia ?? data.nomeFantasia ?? "",
      razao_social: data.razao_social ?? data.razaoSocial ?? "",
    })),
);

type Companies = z.infer<typeof companiesSchema>;

type CompaniesListProps = {
  companies: Companies;
};

function CompaniesList({ companies }: CompaniesListProps) {
  return (
    <ul data-cy="companiesList">
      {companies.map((company) => (
        <Box
          component="li"
          key={company.id}
          sx={{ width: 275, listStyle: "none" }}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 12 }}
              >
                {company.razao_social}
              </Typography>
              <Typography variant="h5" component="div">
                {company.nome_fantasia}
              </Typography>
              <Typography
                sx={{ color: "text.secondary", mb: 1.5, fontSize: 14 }}
              >
                {company.cnpj}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {company.municipio} / {company.estado}
              </Typography>
            </CardContent>
            <CardActions>
              <RendimentoDialog data={company} />
            </CardActions>
          </Card>
        </Box>
      ))}
    </ul>
  );
}

const companiesApiEndpoint =
  "https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/";

export default async function Home() {
  const response = await fetch(companiesApiEndpoint, options);
  const companies = await response.json();
  const validatedCompanies = companiesSchema.safeParse(companies);

  if (!validatedCompanies.success) {
    // lança erro que vai cair no error.tsx
    throw new Error("Lançou erro de schema!");
  }

  return <CompaniesList companies={validatedCompanies.data} />;
}
