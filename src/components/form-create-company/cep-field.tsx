"use client";

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import type {
  CommonCreateCompanyFieldProps,
  HandleCEPInputChangeArgs,
} from "@/types";

type CEPFieldProps = CommonCreateCompanyFieldProps & {
  handleCEPInputChange: ({ e, field }: HandleCEPInputChangeArgs) => void;
};

export function CEPField({
  control,
  errors,
  isLoadingCompanyInfo,
  handleCEPInputChange,
}: CEPFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="cepGridContainer">
      <Controller
        name="cep"
        control={control}
        rules={{
          required: "CEP obrigatório",
          pattern: {
            value: /^\d{5}-\d{3}$/,
            message: "CEP inválido",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="CEP"
            placeholder="00000000"
            data-cy="cepInput"
            disabled={isLoadingCompanyInfo}
            error={!!errors.cep}
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
                errors.cep?.message || "Digite apenas os números"
              )
            }
            onChange={(e) => handleCEPInputChange({ e, field })}
            slotProps={{
              htmlInput: {
                maxLength: 9,
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
