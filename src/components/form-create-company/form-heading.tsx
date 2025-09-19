import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material";

type FormHeadingProps = {
  text: string;
  cyValue: string;
  sxObj?: SxProps<Theme>;
};

export function FormHeading({ text, cyValue, sxObj }: FormHeadingProps) {
  return (
    <Typography
      variant="h6"
      data-cy={cyValue}
      sx={{
        mb: 3,
        color: "#244C5A",
        fontWeight: 500,
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
        ...sxObj,
      }}
    >
      {text}
    </Typography>
  );
}
