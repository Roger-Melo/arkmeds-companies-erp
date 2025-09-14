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
    <Box
      component="ul"
      data-cy="companiesList"
      sx={{
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        padding: 0,
        margin: 0,
      }}
    >
      {companies.map((company) => (
        <Box component="li" key={company.id} sx={{ listStyle: "none" }}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 2,
                borderColor: "#244C5A",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                data-cy="razao-social"
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {company.razao_social}
              </Typography>
              <Typography
                data-cy="nome-fantasia"
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  color: "#244C5A",
                  mb: 1,
                  minHeight: "3.5em",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {company.nome_fantasia}
              </Typography>
              <Typography
                data-cy="cnpj"
                sx={{
                  color: "text.secondary",
                  mb: 1.5,
                  fontSize: 14,
                  fontFamily: "monospace",
                }}
              >
                {company.cnpj}
              </Typography>
              <Typography
                data-cy="municipio-estado"
                variant="body2"
                sx={{
                  fontSize: 13,
                  color: "#666",
                  fontWeight: 500,
                }}
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
    </Box>
  );
}
