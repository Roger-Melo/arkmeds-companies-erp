"use client";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 3, color: "#244C5A", fontWeight: 600 }}
        >
          Algo inesperado aconteceu
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Ocorreu um erro ao processar sua solicitação. Por favor, tente
          novamente.
        </Typography>
        <Button
          variant="contained"
          onClick={() => reset()}
          sx={{
            mt: 2,
            backgroundColor: "#244C5A",
            "&:hover": {
              backgroundColor: "#1a3542",
            },
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          Tentar novamente
        </Button>
      </Paper>
    </Container>
  );
}
