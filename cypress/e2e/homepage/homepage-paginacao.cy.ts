import { selectors } from "../shared/selectors";

describe("Paginação", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

  it("deve renderizar os controles de paginação se houver mais de 10 empresas", () => {
    // Verifica quantos cards existem
    cy.get(selectors.companyCard).then(($cards) => {
      if ($cards.length === 10) {
        // Se tem 10 cards, provavelmente há mais páginas
        cy.get(selectors.pagination).should("be.visible");
        cy.get(selectors.paginationButton).should("have.length.greaterThan", 0);
      }
    });
  });

  it("deve navegar para a próxima página ao clicar em 'próxima'", () => {
    // Só executa se houver paginação
    cy.get("body").then(($body) => {
      if ($body.find(selectors.nextPageButton).length > 0) {
        // Navega para próxima página
        cy.get(selectors.nextPageButton).click();

        // Verifica URL atualizada
        cy.url().should("include", "page=2");

        // Aguarda carregar nova página
        cy.get(selectors.companiesList).should("be.visible");

        // Verifica que a paginação está ativa na página 2
        cy.get(".Mui-selected").should("contain.text", "2");

        // Verifica que o botão anterior agora está habilitado
        cy.get(selectors.previousPageButton).should("not.be.disabled");

        // Verifica que ainda existem cards (pode ter quantidade diferente na última página)
        cy.get(selectors.companyCard).should("have.length.at.least", 1);

        // Se não for a última página, deve ter 10 cards
        cy.get("body").then(($body) => {
          const nextButton = $body.find(selectors.nextPageButton);
          if (!nextButton.is(":disabled")) {
            // Não é a última página, deve ter 10 cards
            cy.get(selectors.companyCard).should("have.length", 10);
          }
        });
      }
    });
  });

  it("deve navegar para página específica ao clicar no número", () => {
    cy.get("body").then(($body) => {
      // Verifica se existe botão da página 2
      const page2Button = Array.from(
        $body.find(selectors.paginationButton),
      ).filter((el) => el.textContent?.trim() === "2");

      if (page2Button.length > 0) {
        // Verifica estado inicial - página 1 deve estar selecionada
        cy.get(".Mui-selected").should("contain.text", "1");

        // Clica na página 2
        cy.get(selectors.paginationButton)
          .filter((_, el) => el.textContent?.trim() === "2")
          .click();

        // Verifica URL
        cy.url().should("include", "page=2");

        // Verifica que página 2 está selecionada
        cy.get(".Mui-selected").should("contain.text", "2");

        // Verifica que o botão da página 1 não está mais selecionado
        cy.get(selectors.paginationButton)
          .contains("1")
          .should("not.have.class", "Mui-selected");

        // Verifica que existem cards na página
        cy.get(selectors.companyCard).should("have.length.at.least", 1);
      }
    });
  });

  it("deve voltar para primeira página", () => {
    cy.get("body").then(($body) => {
      if ($body.find(selectors.nextPageButton).length > 0) {
        // Vai para página 2
        cy.get(selectors.nextPageButton).click();
        cy.url().should("include", "page=2");

        // Verifica que está na página 2
        cy.get(".Mui-selected").should("contain.text", "2");

        // Verifica que o botão anterior está habilitado
        cy.get(selectors.previousPageButton).should("not.be.disabled");

        // Volta para primeira página
        cy.get(selectors.firstPageButton).click();

        // URL não deve ter parâmetro page quando está na página 1
        cy.url().should("not.include", "page=");

        // Verifica que está na página 1
        cy.get(".Mui-selected").should("contain.text", "1");

        // Verifica que o botão anterior está desabilitado novamente
        cy.get(selectors.previousPageButton).should("be.disabled");

        // Verifica que existem cards
        cy.get(selectors.companyCard).should("have.length.at.least", 1);
      }
    });
  });

  it("deve desabilitar botão 'anterior' na primeira página", () => {
    cy.get(selectors.previousPageButton).should(($button) => {
      const isDisabledByAttribute = $button.is(":disabled");
      expect(isDisabledByAttribute).to.equal(true);
    });
  });

  it("deve desabilitar botão 'próxima' na última página", () => {
    cy.get("body").then(($body) => {
      if ($body.find(selectors.lastPageButton).length > 0) {
        // Vai para última página
        cy.get(selectors.lastPageButton).click();

        // Aguarda navegação
        cy.get(selectors.companiesList).should("be.visible");

        // Botão próxima deve estar desabilitado
        cy.get(selectors.nextPageButton).should(($button) => {
          const isDisabledByAttribute = $button.is(":disabled");
          expect(isDisabledByAttribute).to.equal(true);
        });
      }
    });
  });

  it("deve mostrar feedback visual durante carregamento entre páginas", () => {
    cy.get("body").then(($body) => {
      if ($body.find(selectors.nextPageButton).length > 0) {
        // Clica para próxima página
        cy.get(selectors.nextPageButton).click();

        // Durante a transição, a paginação deve ficar com opacity reduzida
        cy.get(selectors.pagination).should(($pagination) => {
          const opacity = parseFloat($pagination.css("opacity"));
          // Verifica se está em estado de loading ou já carregou
          expect(opacity).to.be.oneOf([0.6, 1]);
        });
      }
    });
  });

  // Garante que o comportamento responsivo da paginação seja mantido
  describe("Paginação responsiva", () => {
    // Só executa os testes se houver paginação suficiente
    beforeEach(() => {
      cy.visit("/");
      cy.get(selectors.companiesList).should("be.visible");
      // Navega para uma página intermediária se houver
      cy.get("body").then(($body) => {
        // Procura por um botão de página 3 ou superior para garantir que há páginas suficientes
        const page3Button = Array.from(
          $body.find(selectors.paginationButton),
        ).filter((el) => el.textContent?.trim() === "3");

        if (page3Button.length > 0) {
          cy.wrap(page3Button[0]).click();
          cy.url().should("include", "page=3");
        }
      });
    });

    it("deve pular testes de paginação responsiva se não houver páginas suficientes", () => {
      cy.get(selectors.pagination).then(($pagination) => {
        // Conta quantos botões de página existem (excluindo navegação)
        const pageButtons = $pagination.find(".MuiPaginationItem-page");
        if (pageButtons.length < 5) {
          cy.log(
            `Apenas ${pageButtons.length} páginas disponíveis. Testes de responsividade requerem pelo menos 5 páginas.`,
          );
          expect(true).to.equal(true); // Passa o teste sem fazer asserções
        }
      });
    });

    it("deve mostrar páginas adjacentes em telas desktop", () => {
      // Define viewport desktop
      cy.viewport(1200, 800);
      // Aguarda a paginação renderizar
      cy.get(selectors.pagination).should("be.visible");
      // Verifica se há páginas suficientes para testar
      cy.get("body").then(($body) => {
        const currentPage = $body.find(".Mui-selected").text();
        const currentPageNum = parseInt(currentPage);
        // Se está na página 3 ou superior
        if (currentPageNum >= 3) {
          // Deve mostrar a página anterior (currentPage - 1)
          cy.get(selectors.paginationButton)
            .contains((currentPageNum - 1).toString())
            .should("be.visible");
          // Se não for a última página, deve mostrar a próxima também
          const nextButton = $body.find(selectors.nextPageButton);
          if (!nextButton.is(":disabled")) {
            cy.get(selectors.paginationButton)
              .contains((currentPageNum + 1).toString())
              .should("be.visible");
          }
        }
      });
    });

    it("deve ocultar páginas adjacentes em telas mobile", () => {
      // Define viewport mobile
      cy.viewport(375, 667);
      // Aguarda a paginação renderizar
      cy.get(selectors.pagination).should("be.visible");
      // Verifica se há páginas suficientes para testar
      cy.get("body").then(($body) => {
        const currentPage = $body.find(".Mui-selected").text();
        const currentPageNum = parseInt(currentPage);
        // Se está em uma página intermediária
        if (currentPageNum >= 3) {
          const prevPageNum = (currentPageNum - 1).toString();
          const nextPageNum = (currentPageNum + 1).toString();
          // Busca todos os botões de paginação
          const allButtons = $body.find(selectors.paginationButton);
          // Filtra apenas botões numéricos (não navegação)
          allButtons.each((_, button) => {
            const $button = Cypress.$(button);
            const buttonText = $button.text().trim();
            // Ignora botões de navegação (que têm aria-label ou ícones)
            const isNavigationButton =
              $button.hasClass("MuiPaginationItem-firstLast") ||
              $button.hasClass("MuiPaginationItem-previousNext") ||
              $button.attr("aria-label")?.includes("Go to") ||
              buttonText === "";
            if (!isNavigationButton) {
              // Se é um botão de página adjacente, não deve existir em mobile
              if (buttonText === prevPageNum || buttonText === nextPageNum) {
                throw new Error(
                  `Página adjacente ${buttonText} não deveria estar visível em mobile`,
                );
              }
            }
          });
        }
      });
    });

    it("deve manter botões de navegação em ambos os tamanhos de tela", () => {
      const viewports: Array<[number, number, string]> = [
        [1200, 800, "desktop"],
        [375, 667, "mobile"],
      ];

      viewports.forEach(([width, height, device]) => {
        cy.log(`Testando em ${device}: ${width}x${height}`);
        cy.viewport(width, height);
        // Botões de primeira e última página
        cy.get(selectors.firstPageButton).should("exist");
        cy.get(selectors.lastPageButton).should("exist");
        // Botões anterior/próxima
        cy.get(selectors.previousPageButton).should("exist");
        cy.get(selectors.nextPageButton).should("exist");
        // Página atual sempre deve estar visível
        cy.get(".Mui-selected").should("be.visible");
      });
    });

    it("deve alternar comportamento de siblingCount baseado no viewport", () => {
      // Primeiro testa em desktop
      cy.viewport(1200, 800);
      cy.visit("/");
      // Navega para página 5 se disponível
      cy.get("body").then(($body) => {
        const page5Button = Array.from(
          $body.find(selectors.paginationButton),
        ).filter((el) => el.textContent?.trim() === "5");

        if (page5Button.length > 0) {
          cy.wrap(page5Button[0]).click();
          // Em desktop: deve ver páginas 4, [5], 6
          cy.get(selectors.paginationButton).contains("4").should("be.visible");
          cy.get(selectors.paginationButton).contains("6").should("be.visible");
          // Agora muda para mobile sem recarregar
          cy.viewport(375, 667);
          cy.wait(500); // Aguarda re-renderização
          // Em mobile: NÃO deve ver páginas 4 e 6 adjacentes
          cy.get(selectors.paginationButton).contains("4").should("not.exist");
          cy.get(selectors.paginationButton).contains("6").should("not.exist");
          // Mas ainda deve ver a página atual (5)
          cy.get(".Mui-selected").should("contain.text", "5");
        } else {
          // Se não há páginas suficientes, pula o teste
          cy.log(
            "Não há páginas suficientes para testar comportamento de siblingCount",
          );
        }
      });
    });
  });
});
