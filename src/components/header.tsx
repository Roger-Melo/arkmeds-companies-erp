import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Logo } from "@/components/logo";
import type { SxProps, Theme } from "@mui/material";

const routes = [
  {
    name: "Início",
    path: "/",
  },
  {
    name: "Cadastrar Empresa",
    path: "/cadastro-de-empresa",
  },
];

export function Header() {
  return (
    <AppBar position="static" component="header" sx={headerStyles.appBar}>
      <Toolbar sx={headerStyles.toolBar}>
        <Box sx={headerStyles.logoBox}>
          <Logo />
        </Box>
        <Box component="nav" sx={headerStyles.nav}>
          <Box component="ul" sx={headerStyles.ul}>
            {routes.map((route) => (
              <Box component="li" key={route.name}>
                <Button component={Link} href={route.path} sx={headerStyles.li}>
                  {route.name}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const headerStyles = {
  appBar: { backgroundColor: "primary.main", boxShadow: 2 },
  toolBar: {
    maxWidth: "lg",
    width: "100%",
    mx: "auto",
    px: { xs: 2, sm: 3, md: 3 },
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: { xs: "center", sm: "space-between" },
    alignItems: "center",
    py: { xs: 2, sm: 1 },
    gap: { xs: 1, sm: 0 },
  },
  logoBox: { display: "flex", justifyContent: "center" },
  nav: { display: "flex", alignItems: "center" },
  ul: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: { xs: 1, sm: 2 },
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  li: {
    color: "white",
    textTransform: "none",
    fontSize: { xs: "0.9rem", sm: "1rem" },
    px: { xs: 1.5, sm: 2 },
    py: { xs: 0.75, sm: 1 },
    minWidth: "auto",
    whiteSpace: "nowrap",
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  },
} satisfies Record<string, SxProps<Theme>>;
