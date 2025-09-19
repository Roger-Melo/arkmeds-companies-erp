"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

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
          backgroundColor: "#244C5A",
          color: "#fff",
          px: 4,
          py: 1.5,
          "&:hover": {
            backgroundColor: "#1a3742",
          },
          "&:disabled": {
            backgroundColor: "#244C5A",
            opacity: 0.6,
          },
        }}
      >
        Cadastrar Empresa
      </Button>
    </Box>
  );
}
