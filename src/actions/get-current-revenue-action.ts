"use server";

import { z } from "zod";
import { formatToBRL } from "@/utils/format-to-brl";

const currentRevenueSchema = z
  .object({ valor_rendimento: z.number() })
  .transform((data) => ({
    valor_rendimento: formatToBRL(data.valor_rendimento),
  }));

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.COMPANIES_API_TOKEN}`,
  },
};

export async function getCurrentRevenueAction(cnpj: string) {
  const currentRevenueApiEndpoint = `https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/cnpj/${cnpj}`;
  const response = await fetch(currentRevenueApiEndpoint, options);
  const data = await response.json();
  const validatedData = currentRevenueSchema.safeParse(data);

  if (!validatedData.success) {
    return "";
  }

  return validatedData.data.valor_rendimento;
}
