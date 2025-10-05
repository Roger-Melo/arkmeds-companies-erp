import Image from "next/image";
import logo from "@/assets/logo.svg";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material";

export function Logo() {
  return (
    <Box sx={logoStyles.box}>
      <Image
        src={logo}
        alt="Logo Arkmeds"
        width={206}
        height={45}
        style={logoStyles.img}
      />
    </Box>
  );
}

const logoStyles = {
  box: { display: "flex", alignItems: "center" },
  img: { maxWidth: "100%", height: "auto" },
} satisfies { box: SxProps<Theme>; img: React.CSSProperties };
