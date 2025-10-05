"use client";

import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// Imports do Material-UI para detectar o tamanho da tela. Relevante para a paginação
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  // Detecta o tamanho da tela
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      {/* Backdrop de loading */}
      <Backdrop
        sx={{
          position: "fixed",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        open={isPending}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "primary.main",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: 1,
          }}
        />
      </Backdrop>

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
          siblingCount={isMobile ? 0 : 1} // Em mobile, não mostra páginas ao lado da atual
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
              color: "primary.main",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
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
    </>
  );
}
