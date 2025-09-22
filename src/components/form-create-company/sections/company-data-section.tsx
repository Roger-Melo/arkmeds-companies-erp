import { CNPJField } from "@/components/form-create-company/fields/cnpj-field";
import { RazaoSocialField } from "@/components/form-create-company/fields/razao-social-field";
import { NomeFantasiaField } from "@/components/form-create-company/fields/nome-fantasia-field";
import { FormHeading } from "@/components/form-create-company/form-heading";
import Grid from "@mui/material/Grid";
import type {
  CommonCreateCompanyFieldProps,
  HandleCNPJInputChange,
} from "@/types";

type CompanyDataSectionProps = CommonCreateCompanyFieldProps & {
  handleCNPJInputChange: ({ e, field }: HandleCNPJInputChange) => Promise<void>;
};

export function CompanyDataSection({
  control,
  errors,
  isLoadingCompanyInfo,
  handleCNPJInputChange,
}: CompanyDataSectionProps) {
  return (
    <>
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
    </>
  );
}
