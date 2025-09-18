"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { validateCNPJ } from "@/utils/validate-cnpj";
import type { CompanyFormData, HandleCNPJInputChange } from "@/types";

type CNPJGridProps = {
  control: Control<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  handleCNPJInputChange: ({ e, field }: HandleCNPJInputChange) => void;
};

export function CNPJField({
  control,
  errors,
  handleCNPJInputChange,
}: CNPJGridProps) {
  return (
    <Grid size={{ xs: 12, sm: 6 }} data-cy="cnpjGridContainer">
      <Controller
        name="cnpj"
        control={control}
        rules={{
          required: "CNPJ obrigatório",
          validate: validateCNPJ,
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="CNPJ"
            placeholder="00000000000000"
            data-cy="cnpjInput"
            error={!!errors.cnpj}
            helperText={errors.cnpj?.message || "Digite apenas os números"}
            onChange={(e) => handleCNPJInputChange({ e, field })}
            slotProps={{
              htmlInput: {
                maxLength: 18, // 14 dígitos + 4 caracteres de formatação
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
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#244C5A",
              },
            }}
          />
        )}
      />
    </Grid>
  );
}
