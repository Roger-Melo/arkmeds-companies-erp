import Grid from "@mui/material/Grid";
import { FormHeading } from "@/components/form-create-company/form-heading";
import { CEPField } from "@/components/form-create-company/cep-field";
import { EstadoField } from "@/components/form-create-company/estado-field";
import { MunicipioField } from "@/components/form-create-company/municipio-field";
import { LogradouroField } from "@/components/form-create-company/logradouro-field";
import { NumeroField } from "@/components/form-create-company/numero-field";
import { ComplementoField } from "@/components/form-create-company/complemento-field";
import { applyCEPMask } from "@/utils/apply-cep-mask";
import type {
  CommonCreateCompanyFieldProps,
  HandleCEPInputChangeArgs,
  HandleEstadoInputChangeArgs,
} from "@/types";

function handleEstadoInputChange({ e, field }: HandleEstadoInputChangeArgs) {
  const upperCaseValue = e.target.value.toUpperCase();
  field.onChange(upperCaseValue);
}

function handleCEPInputChange({ e, field }: HandleCEPInputChangeArgs) {
  const maskedCEP = applyCEPMask(e.target.value);
  field.onChange(maskedCEP);
}

export function CompanyAddressSection({
  control,
  errors,
  isLoadingCompanyInfo,
}: CommonCreateCompanyFieldProps) {
  return (
    <>
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
      </Grid>
    </>
  );
}
