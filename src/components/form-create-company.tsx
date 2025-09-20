"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { applyCEPMask } from "@/utils/apply-cep-mask";
import { CNPJField } from "./form-create-company/cnpj-field";
import { RazaoSocialField } from "./form-create-company/razao-social-field";
import { NomeFantasiaField } from "./form-create-company/nome-fantasia-field";
import { CEPField } from "./form-create-company/cep-field";
import { EstadoField } from "./form-create-company/estado-field";
import { MunicipioField } from "./form-create-company/municipio-field";
import { LogradouroField } from "./form-create-company/logradouro-field";
import { NumeroField } from "./form-create-company/numero-field";
import { ComplementoField } from "./form-create-company/complemento-field";
import { FormFooter } from "./form-create-company/form-footer";
import { FormHeading } from "./form-create-company/form-heading";
import { useCompanyForm } from "@/hooks/use-company-form";
import { useCNPJAutoFill } from "@/hooks/use-cnpj-autofill";
import { useFormSubmission } from "@/hooks/use-form-submission";
import type {
  HandleCEPInputChangeArgs,
  HandleEstadoInputChangeArgs,
} from "@/types";

function handleEstadoInputChange({ e, field }: HandleEstadoInputChangeArgs) {
  const upperCaseValue = e.target.value.toUpperCase();
  field.onChange(upperCaseValue);
}

export function FormCreateCompany() {
  const { isSubmitting, error, setError, onSubmit } = useFormSubmission();
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useCompanyForm();
  const { isLoadingCompanyInfo, handleCNPJInputChange } = useCNPJAutoFill({
    setValue,
  });

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
        <FormHeading text="Dados da Empresa" cyValue="companyDataSection" />
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
        <FormHeading
          text="Endereço da Empresa"
          cyValue="companyAddressSection"
          sxObj={{ my: 3 }}
        />
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
          <FormFooter
            error={error}
            setError={setError}
            isLoadingCompanyInfo={isLoadingCompanyInfo}
            isSubmitting={isSubmitting}
          />
        </Grid>
      </Box>
    </>
  );
}
