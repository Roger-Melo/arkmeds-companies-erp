"use client";

import { useState } from "react";
import {
  useForm,
  Controller,
  type ControllerRenderProps,
  type UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { applyCNPJMask } from "@/utils/apply-cnpj-mask";
import { applyCEPMask } from "@/utils/apply-cep-mask";
import { validateCNPJ } from "@/utils/validate-cnpj";
import { getCompanyInfoAction } from "@/actions/get-cnpj-info-action";
import { type CompanyInfo } from "@/types";

type CompanyFormData = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  estado: string;
};

type HandleCNPJInputChangeArgs = {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  field: ControllerRenderProps<CompanyFormData, "cnpj">;
};

type AutoFillFieldsArgs = {
  companyInfo: CompanyInfo;
  setValue: UseFormSetValue<CompanyFormData>;
  fieldMapping: Partial<Record<keyof CompanyFormData, keyof CompanyInfo>>;
};

type HandleCEPInputChangeArgs = {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  field: ControllerRenderProps<CompanyFormData, "cep">;
};

function autoFillFields({
  companyInfo,
  setValue,
  fieldMapping,
}: AutoFillFieldsArgs) {
  (
    Object.entries(fieldMapping) as Array<
      [keyof CompanyFormData, keyof CompanyInfo]
    >
  ).forEach(([formField, apiField]) => {
    const value = companyInfo[apiField];
    if (value !== undefined && value !== null && value !== "") {
      // Aplica a máscara do CEP se for o campo CEP
      const formattedValue =
        formField === "cep" ? applyCEPMask(String(value)) : String(value);
      setValue(formField, formattedValue);
    }
  });
}

type HandleEstadoInputChangeArgs = {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  field: ControllerRenderProps<CompanyFormData, "estado">;
};

function handleEstadoInputChange({ e, field }: HandleEstadoInputChangeArgs) {
  const upperCaseValue = e.target.value.toUpperCase();
  field.onChange(upperCaseValue);
}

export function FormCreateCompany() {
  const [isLoadingCompanyInfo, setIsLoadingCompanyInfo] = useState(false);
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<CompanyFormData>({
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      nomeFantasia: "",
      cep: "",
      estado: "",
    },
    mode: "onChange",
  });

  async function handleCNPJInputChange({
    e,
    field,
  }: HandleCNPJInputChangeArgs) {
    const maskedCNPJ = applyCNPJMask(e.target.value);
    field.onChange(maskedCNPJ);
    const numbersOnly = maskedCNPJ.replace(/\D/g, "");
    // Verifica se tem exatamente 14 dígitos
    if (numbersOnly.length === 14) {
      // Valida se o CNPJ é válido
      const validationResult = validateCNPJ(maskedCNPJ);
      // Se for válido, executa a action
      if (validationResult === true) {
        setIsLoadingCompanyInfo(true);
        const companyInfo = await getCompanyInfoAction(maskedCNPJ);
        setIsLoadingCompanyInfo(false);
        if (companyInfo) {
          const fieldMapping = {
            razaoSocial: "razaoSocial",
            nomeFantasia: "nomeFantasia",
            cep: "cep",
            estado: "uf",
          } as const;
          autoFillFields({ companyInfo, setValue, fieldMapping });
        }
      }
    }
  }

  function handleCEPInputChange({ e, field }: HandleCEPInputChangeArgs) {
    const maskedCEP = applyCEPMask(e.target.value);
    field.onChange(maskedCEP);
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

          {/* Razão Social */}
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

          {/* Nome Fantasia */}
          <Grid size={{ xs: 12, sm: 6 }} data-cy="nomeFantasiaGridContainer">
            <Controller
              name="nomeFantasia"
              control={control}
              rules={{
                required: "Nome Fantasia obrigatório",
                maxLength: {
                  value: 100,
                  message: "Deve ter no máximo 100 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={isLoadingCompanyInfo}
                  fullWidth
                  label="Nome Fantasia"
                  placeholder="Digite o nome fantasia da empresa"
                  data-cy="nomeFantasiaInput"
                  error={!!errors.nomeFantasia}
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
                      errors.nomeFantasia?.message
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
        </Grid>

        {/* Seção de Endereço da Empresa */}
        <Typography
          variant="h6"
          data-cy="companyAddressSection"
          sx={{
            my: 3,
            color: "#244C5A",
            fontWeight: 500,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Endereço da Empresa
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* CEP */}
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

          {/* Estado */}
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
        </Grid>
      </Box>
    </>
  );
}
