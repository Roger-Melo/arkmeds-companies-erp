import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Garante que a variável de ambiente seja passada corretamente
      config.env.VERCEL_PROTECTION_BYPASS =
        process.env.CYPRESS_VERCEL_PROTECTION_BYPASS;
      return config;
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    // Configurações para melhor compatibilidade com Vercel
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
});
