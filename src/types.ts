import { z } from "zod";

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
