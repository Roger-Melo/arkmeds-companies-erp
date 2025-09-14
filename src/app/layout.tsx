import { Header } from "@/components/header";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arkmeds Companies ERP",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <Header />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
