"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

type FormFooterProps = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoadingCompanyInfo: boolean;
  isSubmitting: boolean;
};

export function FormFooter({
  error,
  setError,
  isLoadingCompanyInfo,
  isSubmitting,
}: FormFooterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 2,
        width: "100%",
        mt: 3,
      }}
    >
      {/* Renderiza o Backdrop de loading apenas quando estiver enviando o form */}
      {isSubmitting && (
        <Backdrop
          sx={{
            position: "fixed",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          open={isSubmitting}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                color: "primary.main",
                backgroundColor: "white",
                borderRadius: "50%",
                padding: 1,
              }}
            />
            <Typography sx={{ color: "white", fontWeight: 500 }}>
              Cadastrando empresa...
            </Typography>
          </Box>
        </Backdrop>
      )}

      {error && (
        <Alert
          severity="error"
          data-cy="errorAlert"
          onClose={() => setError(null)}
          sx={{
            maxWidth: "500px",
            width: "auto",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Botão de Envio */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoadingCompanyInfo || isSubmitting}
        data-cy="submitButton"
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          px: 4,
          py: 1.5,
          "&:hover": {
            backgroundColor: "#1a3742",
          },
          "&:disabled": {
            backgroundColor: "primary.main",
            opacity: 0.6,
          },
        }}
      >
        Cadastrar Empresa
      </Button>
    </Box>
  );
}
