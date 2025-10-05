"use client";

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type { CommonCreateCompanyFieldProps } from "@/types";

export function MunicipioField({
  control,
  errors,
  isLoadingCompanyInfo,
}: CommonCreateCompanyFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="municipioGridContainer">
      <Controller
        name="municipio"
        control={control}
        rules={{
          required: "Município obrigatório",
          maxLength: {
            value: 100,
            message: "Deve ter no máximo 100 caracteres",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Município"
            placeholder="Digite o nome do município"
            data-cy="municipioInput"
            disabled={isLoadingCompanyInfo}
            error={!!errors.municipio}
            helperText={
              isLoadingCompanyInfo ? (
                <Box
                  component="span"
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
                errors.municipio?.message
              )
            }
            slotProps={{
              htmlInput: {
                maxLength: 100,
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
