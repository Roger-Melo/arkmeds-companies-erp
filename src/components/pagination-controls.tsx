"use client";

import Box from "@mui/material/Box";
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        showFirstButton
        showLastButton
        // Desabilita toda a paginação durante o loading
        disabled={isPending}
        size="large"
        siblingCount={0} // Em mobile, não mostra páginas ao lado da atual
        boundaryCount={1} // Mostra apenas 1 página no início e fim
        // Feedback visual adicional
        sx={{
          opacity: isPending ? 0.6 : 1,
          pointerEvents: isPending ? "none" : "auto",
          transition: "opacity 0.3s ease",
          "& .MuiPagination-ul": {
            flexWrap: "nowrap", // Impede quebra de linha
          },

          "& .MuiPaginationItem-root": {
            minWidth: { xs: "32px", sm: "40px" },
            height: { xs: "32px", sm: "40px" },
            margin: { xs: "0 1px", sm: "0 3px" },
            fontSize: { xs: "0.875rem", sm: "1rem" },

            color: "#244C5A",
            "&.Mui-selected": {
              backgroundColor: "#244C5A",
              color: "white",
              "&:hover": {
                backgroundColor: "#1a3540",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(36, 76, 90, 0.08)",
            },
          },
          "& .MuiPaginationItem-firstLast": {
            display: { xs: "none", sm: "flex" },
          },
        }}
      />
    </Box>
  );
}
