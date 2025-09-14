import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg"; // Importando o SVG
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function Logo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Image
        src={logo}
        alt="Logo Arkmeds"
        width={206}
        height={45}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </Box>
  );
}

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
    <AppBar
      position="static"
      component="header"
      sx={{
        backgroundColor: "#244C5A",
        boxShadow: 2,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "lg",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 3 },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: "center",
          py: { xs: 2, sm: 1 },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Logo />
        </Box>
        <Box
          component="nav"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="ul"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {routes.map((route) => (
              <Box component="li" key={route.name}>
                <Button
                  component={Link}
                  href={route.path}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
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
