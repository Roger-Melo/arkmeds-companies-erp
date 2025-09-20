"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { applyCEPMask } from "@/utils/apply-cep-mask";
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
import { CompanyDataSection } from "./form-create-company/sections/company-data-section";

function handleEstadoInputChange({ e, field }: HandleEstadoInputChangeArgs) {
  const upperCaseValue = e.target.value.toUpperCase();
  field.onChange(upperCaseValue);
}

function handleCEPInputChange({ e, field }: HandleCEPInputChangeArgs) {
  const maskedCEP = applyCEPMask(e.target.value);
  field.onChange(maskedCEP);
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

  return (
    <>
      <Box
        component="form"
        data-cy="companyForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CompanyDataSection
          control={control}
          errors={errors}
          isLoadingCompanyInfo={isLoadingCompanyInfo}
          handleCNPJInputChange={handleCNPJInputChange}
        />
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
