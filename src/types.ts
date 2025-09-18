import { z } from "zod";
import {
  type Control,
  type FieldErrors,
  type ControllerRenderProps,
} from "react-hook-form";

export const companiesSchema = z.array(
  z
    .object({
      cnpj: z.string(),
      estado: z.string(),
      municipio: z.string(),
      // necessário por que a API possui essas props tanto como camelCase quanto snake_case
      nome_fantasia: z.string().optional(),
      nomeFantasia: z.string().optional(),
      razao_social: z.string().optional(),
      razaoSocial: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      id: crypto.randomUUID(),
      cnpj: data.cnpj.replace(/\D/g, ""),
      nome_fantasia: data.nome_fantasia ?? data.nomeFantasia ?? "",
      razao_social: data.razao_social ?? data.razaoSocial ?? "",
    })),
);

export type Companies = z.infer<typeof companiesSchema>;
export type Company = Companies[number];

export const companySchema = z.object({
  cnpj: z.string().length(14),
  razaoSocial: z.string().max(100),
  nomeFantasia: z.string().max(100),
  descricaoSituacaoCadastral: z.string(),
  email: z.string(),
  telefone1: z.string(),
  telefone2: z.string(),
  logradouro: z.string(),
  bairro: z.string(),
  complemento: z.string().max(300),
  municipio: z.string(),
  uf: z.string().max(2),
  cep: z.string().max(8),
  codigoMunicipioIbge: z.number(),
  numero: z
    .preprocess(
      (input) => {
        if (typeof input === "string" && input.trim() !== "") {
          const num = Number(input);
          // Se não for um número válido, retorna a string original
          return isNaN(num) ? input : num;
        }
        return input;
      },
      z.union([z.number().nonnegative().int(), z.string()]),
    )
    .transform(String),
});

export type CompanyInfo = z.infer<typeof companySchema>;

export type CompanyFormData = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  estado: string;
  municipio: string;
  logradouro: string;
  numero: string;
  complemento: string;
};

export type HandleCNPJInputChange = {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  field: ControllerRenderProps<CompanyFormData, "cnpj">;
};

export type CommonCreateCompanyFieldProps = {
  control: Control<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  isLoadingCompanyInfo: boolean;
};
