import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { FormCreateCompany } from "@/components/form-create-company";

export default function CreateCompanyPage() {
  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            data-cy="pageTitle"
            sx={{
              mb: 4,
              color: "#244C5A",
              fontWeight: 600,
              textAlign: "center",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            Cadastro de Empresa
          </Typography>

          <FormCreateCompany />
        </Paper>
      </Container>
    </>
  );
}
