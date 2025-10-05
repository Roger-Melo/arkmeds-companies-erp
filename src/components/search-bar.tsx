"use client";

import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Estado local para o valor do input
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    // Sincroniza o estado local com a URL quando ela muda
    const urlSearchValue = searchParams.get("search") || "";
    setSearchValue(urlSearchValue);
  }, [searchParams]);

  // Função para atualizar a URL
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
      params.set("page", "1");
    } else {
      params.delete("search");
      params.delete("page");
    }

    const newUrl = `/?${params.toString()}`;
    startTransition(() => {
      router.push(newUrl);
    });
  }, 300); // 300ms de delay

  // Função para limpar o campo e a URL
  const handleClear = () => {
    setSearchValue("");
    handleSearch(""); // Limpa também a URL
  };

  return (
    <Box
      data-cy="searchBar"
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "500px", md: "600px" },
        mx: "auto",
      }}
    >
      <TextField
        value={searchValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearchValue(newValue);
          handleSearch(newValue);
        }}
        data-cy="searchBarInput"
        fullWidth
        variant="outlined"
        placeholder="Buscar por nome ou CNPJ da empresa"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {isPending ? (
                  <CircularProgress size={20} sx={{ color: "primary.main" }} />
                ) : (
                  <SearchIcon
                    data-cy="searchBarIcon"
                    sx={{ color: "primary.main" }}
                  />
                )}
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="limpar busca"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(36, 76, 90, 0.08)",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            padding: { xs: "12px 14px", sm: "14px 14px" },
          },
        }}
      />
    </Box>
  );
}
