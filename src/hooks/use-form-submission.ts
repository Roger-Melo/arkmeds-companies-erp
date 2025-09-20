import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompanyAction } from "@/actions/create-company-action";
import type { CompanyFormData } from "@/types";

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(data: CompanyFormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createCompanyAction(data);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Erro ao cadastrar empresa");
        setIsSubmitting(false);
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, error, setError, onSubmit };
}
