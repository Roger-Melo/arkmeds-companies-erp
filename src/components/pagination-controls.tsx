"use client";

import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  // detecta automaticamente quando o Server Component está re-renderizando
  const [isPending, startTransition] = useTransition();

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    // Impede múltiplos cliques durante o loading
    if (isPending) {
      return;
    }

    if (!window) {
      return;
    }

    const url = new URL(window.location.href);

    if (value === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", value.toString());
    }

    const newUrl = `${url.pathname}${url.search}`;
    // Envolve a navegação em startTransition
    // Isso faz isPending ser true até o Server Component terminar
    startTransition(() => {
      router.push(newUrl);
    });
  }

  return (
    <>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        showFirstButton
        showLastButton
        // Desabilita toda a paginação durante o loading
        disabled={isPending}
        // Feedback visual adicional
        sx={{
          opacity: isPending ? 0.6 : 1,
          pointerEvents: isPending ? "none" : "auto",
        }}
      />
    </>
  );
}
