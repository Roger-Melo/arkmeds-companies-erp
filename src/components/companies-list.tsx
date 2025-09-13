import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CurrentRevenueDialog } from "@/components/current-revenue-dialog";
import { Companies } from "@/types";

type CompaniesListProps = {
  companies: Companies;
};

export function CompaniesList({ companies }: CompaniesListProps) {
  return (
    <ul
      data-cy="companiesList"
      style={{
        listStyle: "none",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "1000px",
      }}
    >
      {companies.map((company) => (
        <Box
          component="li"
          key={company.id}
          sx={{ width: 275, listStyle: "none" }}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography
                data-cy="razao-social"
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 12 }}
              >
                {company.razao_social}
              </Typography>
              <Typography data-cy="nome-fantasia" variant="h5" component="div">
                {company.nome_fantasia}
              </Typography>
              <Typography
                data-cy="cnpj"
                sx={{ color: "text.secondary", mb: 1.5, fontSize: 14 }}
              >
                {company.cnpj}
              </Typography>
              <Typography
                data-cy="municipio-estado"
                variant="body2"
                sx={{ fontSize: 12 }}
              >
                {company.municipio} / {company.estado}
              </Typography>
            </CardContent>
            <CardActions>
              <CurrentRevenueDialog company={company} />
            </CardActions>
          </Card>
        </Box>
      ))}
    </ul>
  );
}
