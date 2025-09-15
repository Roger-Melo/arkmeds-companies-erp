"use server";

import { z } from "zod";
import { companySchema, type CompanyInfo } from "@/types";

const CNPJSchema = z
  .string()
  .length(18)
  .transform((maskedCNPJ) => ({ cnpj: maskedCNPJ.replace(/\D/g, "") }));

const companyInfoApiEndpoint = `https://api.arkmeds.com/cnpj`;

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
