"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type { CompanyFormData } from "@/types";

type RazaoSocialFieldProps = {
  control: Control<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  isLoadingCompanyInfo: boolean;
};

export function RazaoSocialField({
  control,
  errors,
  isLoadingCompanyInfo,
}: RazaoSocialFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="razaoSocialGridContainer">
      <Controller
        name="razaoSocial"
        control={control}
        rules={{
          required: "Razão Social obrigatória",
          maxLength: {
            value: 100,
            message: "Deve ter no máximo 100 caracteres",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Razão Social"
            placeholder="Digite a razão social da empresa"
            disabled={isLoadingCompanyInfo}
            data-cy="razaoSocialInput"
            error={!!errors.razaoSocial}
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
                errors.razaoSocial?.message
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
