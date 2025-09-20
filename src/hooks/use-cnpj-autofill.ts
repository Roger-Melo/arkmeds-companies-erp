import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";
import { applyCNPJMask } from "@/utils/apply-cnpj-mask";
import { applyCEPMask } from "@/utils/apply-cep-mask";
import { validateCNPJ } from "@/utils/validate-cnpj";
import { getCompanyInfoAction } from "@/actions/get-cnpj-info-action";
import type {
  CompanyInfo,
  CompanyFormData,
  HandleCNPJInputChange,
} from "@/types";

type UseCNPJAutoFillProps = {
  setValue: UseFormSetValue<CompanyFormData>;
};

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

export function useCNPJAutoFill({ setValue }: UseCNPJAutoFillProps) {
  const [isLoadingCompanyInfo, setIsLoadingCompanyInfo] = useState(false);

  // Função auxiliar para auto-preencher campos
  function autoFillFields(companyInfo: CompanyInfo) {
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

  async function handleCNPJInputChange({ e, field }: HandleCNPJInputChange) {
    const maskedCNPJ = applyCNPJMask(e.target.value);
    field.onChange(maskedCNPJ);
    const numbersOnly = maskedCNPJ.replace(/\D/g, "");

    // Verifica se tem exatamente 14 dígitos e se o CNPJ é válido
    if (numbersOnly.length === 14 && validateCNPJ(maskedCNPJ)) {
      setIsLoadingCompanyInfo(true);
      const companyInfo = await getCompanyInfoAction(maskedCNPJ);
      setIsLoadingCompanyInfo(false);

      if (companyInfo) {
        autoFillFields(companyInfo);
      }
    }
  }

  return { isLoadingCompanyInfo, handleCNPJInputChange };
}
