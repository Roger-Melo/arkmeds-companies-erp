"use server";

import { z } from "zod";
import { getEnvVariable } from "@/utils/get-env-variables";
import { companySchema, type CompanyInfo } from "@/types";

const CNPJSchema = z
  .string()
  .length(18)
  .transform((maskedCNPJ) => ({ cnpj: maskedCNPJ.replace(/\D/g, "") }));

const companyInfoApiEndpoint = getEnvVariable("COMPANY_INFO_API_ENDPOINT");
const companyInfoApiToken = getEnvVariable("COMPANY_INFO_API_TOKEN");

export async function getCompanyInfoAction(
  maskedCNPJ: string,
): Promise<CompanyInfo | ""> {
  const validatedCNPJ = CNPJSchema.safeParse(maskedCNPJ);

  if (!validatedCNPJ.success) {
    return "";
  }

  const response = await fetch(companyInfoApiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": companyInfoApiToken,
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
