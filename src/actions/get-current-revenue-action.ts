"use server";

import { z } from "zod";
import { formatToBRL } from "@/utils/format-to-brl";
import { getEnvVariable } from "@/utils/get-env-variables";

const currentRevenueSchema = z
  .object({ valor_rendimento: z.number() })
  .transform((data) => ({
    valor_rendimento: formatToBRL(data.valor_rendimento),
  }));

const apiBearerToken = getEnvVariable("API_BEARER_TOKEN");
const currentRevenueApiEndpoint = getEnvVariable(
  "CURRENT_REVENUE_API_ENDPOINT",
);

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiBearerToken}`,
  },
};

export async function getCurrentRevenueAction(cnpj: string) {
  const response = await fetch(`${currentRevenueApiEndpoint}/${cnpj}`, options);
  const data = await response.json();
  const validatedData = currentRevenueSchema.safeParse(data);

  if (!validatedData.success) {
    return "";
  }

  return validatedData.data.valor_rendimento;
}
