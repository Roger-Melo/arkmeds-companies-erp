"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormSetValue } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { applyCNPJMask } from "@/utils/apply-cnpj-mask";
import { applyCEPMask } from "@/utils/apply-cep-mask";
import { validateCNPJ } from "@/utils/validate-cnpj";
import { getCompanyInfoAction } from "@/actions/get-cnpj-info-action";
import { createCompanyAction } from "@/actions/create-company-action";
import type {
  CompanyInfo,
  CompanyFormData,
  HandleCNPJInputChange,
  HandleCEPInputChangeArgs,
  HandleEstadoInputChangeArgs,
} from "@/types";
import Alert from "@mui/material/Alert";
import { CNPJField } from "./form-create-company/cnpj-field";
import { RazaoSocialField } from "./form-create-company/razao-social-field";
import { NomeFantasiaField } from "./form-create-company/nome-fantasia-field";
import { CEPField } from "./form-create-company/cep-field";
import { EstadoField } from "./form-create-company/estado-field";
import { MunicipioField } from "./form-create-company/municipio-field";
import { LogradouroField } from "./form-create-company/logradouro-field";
import { NumeroField } from "./form-create-company/numero-field";
import { ComplementoField } from "./form-create-company/complemento-field";

type AutoFillFieldsArgs = {
  companyInfo: CompanyInfo;
  setValue: UseFormSetValue<CompanyFormData>;
  fieldMapping: Partial<Record<keyof CompanyFormData, keyof CompanyInfo>>;
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

function handleEstadoInputChange({ e, field }: HandleEstadoInputChangeArgs) {
  const upperCaseValue = e.target.value.toUpperCase();
  field.onChange(upperCaseValue);
}

export function FormCreateCompany() {
  const [isLoadingCompanyInfo, setIsLoadingCompanyInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<CompanyFormData>({
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      nomeFantasia: "",
      cep: "",
      estado: "",
      municipio: "",
      logradouro: "",
      numero: "",
      complemento: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CompanyFormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createCompanyAction(data);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Erro ao cadastrar empresa");
        setIsSubmitting(false);
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  async function handleCNPJInputChange({ e, field }: HandleCNPJInputChange) {
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
            municipio: "municipio",
            logradouro: "logradouro",
            numero: "numero",
            complemento: "complemento",
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
      <Box
        component="form"
        data-cy="companyForm"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          <CNPJField
            control={control}
            errors={errors}
            handleCNPJInputChange={handleCNPJInputChange}
          />
          <RazaoSocialField
            control={control}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
            errors={errors}
          />
          <NomeFantasiaField
            control={control}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
            errors={errors}
          />
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
          <CEPField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
            handleCEPInputChange={handleCEPInputChange}
          />
          <EstadoField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
            handleEstadoInputChange={handleEstadoInputChange}
          />
          <MunicipioField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
          />
          <LogradouroField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
          />
          <NumeroField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
          />
          <ComplementoField
            control={control}
            errors={errors}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
          />
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
        </Grid>
      </Box>
    </>
  );
}
