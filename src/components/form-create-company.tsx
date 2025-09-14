"use client";

import {
  useForm,
  Controller,
  type ControllerRenderProps,
} from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { applyCNPJMask } from "@/utils/apply-cnpj-mask";
import { validateCNPJ } from "@/utils/validate-cnpj";

type CompanyFormData = {
  cnpj: string;
};

type HandleCNPJInputChangeArgs = {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  field: ControllerRenderProps<CompanyFormData, "cnpj">;
};

export function FormCreateCompany() {
  const {
    control,
    formState: { errors },
  } = useForm<CompanyFormData>({
    defaultValues: { cnpj: "" },
    mode: "onChange",
  });

  // executa ao inserir o 14º dígito de um CNPJ válido
  function handleCNPJComplete(cnpj: string) {
    console.log("Executou a função");
    console.log("CNPJ completo e válido:", cnpj);
  }

  function handleCNPJInputChange({ e, field }: HandleCNPJInputChangeArgs) {
    const maskedValue = applyCNPJMask(e.target.value);
    field.onChange(maskedValue);
    const numbersOnly = maskedValue.replace(/\D/g, "");
    // Verifica se tem exatamente 14 dígitos
    if (numbersOnly.length === 14) {
      // Valida se o CNPJ é válido
      const validationResult = validateCNPJ(maskedValue);
      // Se for válido (retorna true), executa a função
      if (validationResult === true) {
        handleCNPJComplete(maskedValue);
      }
    }
  }

  return (
    <>
      <Box component="form" data-cy="companyForm">
        {/* Seção de Dados da Empresa */}
        <Typography
          variant="h6"
          data-cy="companyDataSection"
          sx={{
            mb: 3,
            color: "#244C5A",
            fontWeight: 500,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Dados da Empresa
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* CNPJ */}
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
                  helperText={
                    errors.cnpj?.message || "Digite apenas os números"
                  }
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
        </Grid>
      </Box>
    </>
  );
}
