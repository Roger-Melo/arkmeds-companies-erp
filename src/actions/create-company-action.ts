"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

const createCompanyApiEndpoint = `https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies`;

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
        Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
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

  redirect("/");
}
