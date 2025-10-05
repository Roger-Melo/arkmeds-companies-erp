"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getEnvVariable } from "@/utils/get-env-variables";
import type { CompanyFormData } from "@/types";

const companyFormSchema = z.object({
  cnpj: z.string().length(18),
  razaoSocial: z.string().max(100),
  nomeFantasia: z.string().max(100),
  cep: z.string().max(9),
  estado: z.string().max(2),
  municipio: z.string().max(100),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string().max(300),
});

const createCompanyApiEndpoint = getEnvVariable("CREATE_COMPANY_API_ENDPOINT");
const apiBearerToken = getEnvVariable("API_BEARER_TOKEN");

export async function createCompanyAction(data: CompanyFormData) {
  const validatedFormData = companyFormSchema.safeParse(data);

  if (!validatedFormData.success) {
    return {
      success: false,
      error: "Dados inválidos",
      errors: validatedFormData.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(createCompanyApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiBearerToken}`,
      },
      body: JSON.stringify(validatedFormData.data),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao cadastrar empresa: ${response.statusText}`,
      };
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    return {
      success: false,
      error: "Erro ao cadastrar empresa. Tente novamente.",
    };
  }

  revalidatePath("/", "page");
  return { success: true };
}
