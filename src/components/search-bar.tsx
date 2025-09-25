import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";

export function SearchBar() {
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
        data-cy="searchBarInput"
        fullWidth
        variant="outlined"
        placeholder="Buscar por nome ou CNPJ da empresa"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon data-cy="searchBarIcon" sx={{ color: "#244C5A" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            "&:hover fieldset": {
              borderColor: "#244C5A",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#244C5A",
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
