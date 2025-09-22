"use client";

import Box from "@mui/material/Box";
import { FormFooter } from "./form-footer";
import { useCompanyForm } from "@/hooks/use-company-form";
import { useCNPJAutoFill } from "@/hooks/use-cnpj-autofill";
import { useFormSubmission } from "@/hooks/use-form-submission";
import { CompanyDataSection } from "./sections/company-data-section";
import { CompanyAddressSection } from "./sections/company-address-section";

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
        <CompanyAddressSection
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
      </Box>
    </>
  );
}
