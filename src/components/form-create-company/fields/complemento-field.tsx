"use client";

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type { CommonCreateCompanyFieldProps } from "@/types";

export function ComplementoField({
  control,
  errors,
  isLoadingCompanyInfo,
}: CommonCreateCompanyFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="complementoGridContainer">
      <Controller
        name="complemento"
        control={control}
        rules={{
          maxLength: {
            value: 300,
            message: "Deve ter no máximo 300 caracteres",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Complemento"
            placeholder="Apartamento, sala, bloco, etc. (opcional)"
            data-cy="complementoInput"
            disabled={isLoadingCompanyInfo}
            error={!!errors.complemento}
            helperText={
              isLoadingCompanyInfo ? (
                <Box
                  component="span"
                  data-cy="complementoHelperText"
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
                <span data-cy="complementoHelperText">
                  {errors.complemento?.message || "Campo opcional"}
                </span>
              )
            }
            slotProps={{
              htmlInput: {
                maxLength: 300,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-error fieldset": {
                  borderColor: "#d32f2f",
                },
                "&.Mui-disabled": {
                  "& fieldset": {
                    borderColor: "primary.main",
                    opacity: 0.6,
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },
              "& .MuiFormHelperText-root": {
                color: isLoadingCompanyInfo ? "primary.main" : undefined,
              },
            }}
          />
        )}
      />
    </Grid>
  );
}
