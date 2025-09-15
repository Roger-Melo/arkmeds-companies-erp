"use server";

import { z } from "zod";

const companySchema = z.object({
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
    .preprocess((input) => {
      // Garante que o valor seja tratado como número
      // Se não for string ou for vazia, retorna o próprio input
      // para que a validação z.number() possa falhar com a mensagem correta.
      return typeof input === "string" && input.trim() !== ""
        ? Number(input)
        : input;
    }, z.number().nonnegative().int())
    .transform(String), // Converte o número validado de volta para string
});

const CNPJSchema = z
  .string()
  .length(18)
  .transform((maskedCNPJ) => ({ cnpj: maskedCNPJ.replace(/\D/g, "") }));

const companyInfoApiEndpoint = `https://api.arkmeds.com/cnpj`;

export async function getCompanyInfoAction(maskedCNPJ: string) {
  const validatedCNPJ = CNPJSchema.safeParse(maskedCNPJ);
  if (!validatedCNPJ.success) {
    return "";
  }

  const response = await fetch(companyInfoApiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.COMPANY_INFO_API_TOKEN ?? "",
    },
    body: JSON.stringify({ cnpj: validatedCNPJ.data.cnpj }),
  });

  const companyInfo = await response.json();
  const validatedCompanyInfo = companySchema.safeParse(companyInfo);

  if (!validatedCompanyInfo.success) {
    return "";
  }

  return validatedCompanyInfo.data;
}
