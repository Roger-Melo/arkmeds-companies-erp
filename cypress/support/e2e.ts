// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.on("window:before:load", (win) => {
  // Intercepta todas as requisições
  win.fetch = new Proxy(win.fetch, {
    apply(target, thisArg, args) {
      const [url, config = {}] = args;

      // Adiciona o header de autenticação
      // Corrigido: usando VERCEL_PROTECTION_BYPASS em vez de VERCEL_BYPASS
      const bypassSecret = Cypress.env("VERCEL_PROTECTION_BYPASS");
      if (bypassSecret) {
        config.headers = {
          ...config.headers,
          "x-vercel-protection-bypass": bypassSecret,
        };
      }

      return target.apply(thisArg, [url, config]);
    },
  });
});

// Adiciona o header também para requisições diretas do Cypress
beforeEach(() => {
  // Corrigido: usando VERCEL_PROTECTION_BYPASS
  const bypassSecret = Cypress.env("VERCEL_PROTECTION_BYPASS");

  if (bypassSecret) {
    // Intercepta TODAS as requisições para adicionar o header
    cy.intercept("**/*", (req) => {
      // Corrigido: usando o header correto do Vercel
      req.headers["x-vercel-protection-bypass"] = bypassSecret;
    });
  }

  // Log para debug (pode remover depois de funcionar)
  cy.log("Vercel Bypass Secret configurado:", !!bypassSecret);
});
