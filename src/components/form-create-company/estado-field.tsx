"use client";

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import {
  type CommonCreateCompanyFieldProps,
  HandleEstadoInputChangeArgs,
} from "@/types";

type EstadoFieldProps = CommonCreateCompanyFieldProps & {
  handleEstadoInputChange: ({ e, field }: HandleEstadoInputChangeArgs) => void;
};

export function EstadoField({
  control,
  errors,
  isLoadingCompanyInfo,
  handleEstadoInputChange,
}: EstadoFieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="estadoGridContainer">
      <Controller
        name="estado"
        control={control}
        rules={{
          required: "Estado obrigatório",
          maxLength: {
            value: 2,
            message: "Deve ter no máximo 2 caracteres",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Estado"
            placeholder="UF"
            data-cy="estadoInput"
            disabled={isLoadingCompanyInfo}
            error={!!errors.estado}
            onChange={(e) => handleEstadoInputChange({ e, field })}
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
                errors.estado?.message || "Digite a sigla do estado (UF)"
              )
            }
            slotProps={{
              htmlInput: {
                maxLength: 2,
                style: { textTransform: "uppercase" },
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
