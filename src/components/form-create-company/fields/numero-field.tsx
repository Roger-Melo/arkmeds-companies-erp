"use client";

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type { CommonCreateCompanyFieldProps } from "@/types";
import { validateNumero } from "@/utils/validate-numero";

export function NumeroField({
  control,
  errors,
  isLoadingCompanyInfo,
}: CommonCreateCompanyFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="numeroGridContainer">
      <Controller
        name="numero"
        control={control}
        rules={{ validate: validateNumero }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Número"
            placeholder="Digite o número ou S/N"
            data-cy="numeroInput"
            disabled={isLoadingCompanyInfo}
            error={!!errors.numero}
            helperText={
              isLoadingCompanyInfo ? (
                <Box
                  component="span"
                  data-cy="numeroHelperText"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={12} />
                  <span>Buscando dados da empresa...</span>
                </Box>
              ) : (
                <span data-cy="numeroHelperText">
                  {errors.numero?.message ||
                    "Aceita número inteiro positivo ou 'S/N'"}
                </span>
              )
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#244C5A",
                },
                "&.Mui-error fieldset": {
                  borderColor: "#d32f2f",
                },
                "&.Mui-disabled": {
                  "& fieldset": {
                    borderColor: "#244C5A",
                    opacity: 0.6,
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#244C5A",
              },
              "& .MuiFormHelperText-root": {
                color: isLoadingCompanyInfo ? "#244C5A" : undefined,
              },
            }}
          />
        )}
      />
    </Grid>
  );
}
