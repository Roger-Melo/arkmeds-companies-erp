import { useForm } from "react-hook-form";
import type { CompanyFormData } from "@/types";

export function useCompanyForm() {
  const form = useForm<CompanyFormData>({
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

  return { ...form };
}
