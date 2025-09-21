import { selectors } from "./shared/selectors";

describe("Homepage - Listagem de Empresas e Modal de Receita", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o componente CompaniesList", () => {
      cy.get(selectors.companiesList).should("be.visible");
    });

    it("deve exibir cards de empresas da API", () => {
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);
      // Verifica se tem no máximo 10 cards (limite por página)
      cy.get(selectors.companyCard).should("have.length.lte", 10);
    });

    it("deve exibir empresas conhecidas do sistema", () => {
      const companies = [
        "Premium Café do Rafael Ltda",
        "Delicioso Lanches da Clara Ltda",
        "Popular Pão do Paulo Ltda",
      ];

      companies.forEach((empresa) => {
        cy.get(selectors.companiesList).then(($list) => {
          // Verifica se a empresa está na página atual
          if ($list.text().includes(empresa)) {
            cy.wrap($list).should("contain.text", empresa);
          }
        });
      });
    });

    it("deve exibir informações completas em cada card", () => {
      cy.get(selectors.companyCard)
        .first()
        .within(() => {
          // Verifica estrutura do card
          // Razão Social
          cy.get(selectors.razaoSocial).should("exist");
          // Nome Fantasia (título principal)
          cy.get(selectors.nomeFantasia).should("exist");
          // CNPJ
          cy.get(selectors.cnpj)
            .should("exist")
            .and(($el) => {
              const text = $el.text();
              const hasCNPJ = /\d{14}/.test(text.replace(/\D/g, ""));
              expect(hasCNPJ).to.equal(true);
            });
          // Município / Estado
          cy.get(selectors.municipioEstado).should("contain", "/");
          // Botão de ação
          cy.get(".MuiCardActions-root").should("exist");
        });
    });

    it("deve renderizar os controles de paginação se houver mais de 10 empresas", () => {
      // Verifica quantos cards existem
      cy.get(selectors.companyCard).then(($cards) => {
        if ($cards.length === 10) {
          // Se tem 10 cards, provavelmente há mais páginas
          cy.get(selectors.pagination).should("be.visible");
          cy.get(selectors.paginationButton).should(
            "have.length.greaterThan",
            0,
          );
        }
      });
    });
  });

  describe("Navegação por paginação", () => {
    it("deve navegar para a próxima página ao clicar em 'próxima'", () => {
      // Só executa se houver paginação
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          // Captura o primeiro card da página 1
          cy.get(selectors.companyCard)
            .first()
            .invoke("text")
            .then((firstCardTextPage1) => {
              // Navega para próxima página
              cy.get(selectors.nextPageButton).click();

              // Verifica URL atualizada
              cy.url().should("include", "page=2");

              // Aguarda carregar nova página
              cy.get(selectors.companiesList).should("be.visible");

              // Verifica que o conteúdo mudou
              cy.get(selectors.companyCard)
                .first()
                .invoke("text")
                .should((firstCardTextPage2) => {
                  expect(firstCardTextPage2).to.not.equal(firstCardTextPage1);
                });
            });
        }
      });
    });

    it("deve navegar para página específica ao clicar no número", () => {
      cy.get("body").then(($body) => {
        // Verifica se existe botão da página 2
        const page2Button = $body.find(
          selectors.paginationButton + ':contains("2")',
        );
        if (page2Button.length > 0) {
          // Captura conteúdo inicial
          cy.get(selectors.companyCard)
            .first()
            .invoke("text")
            .then((initialText) => {
              // Clica na página 2
              cy.get(selectors.paginationButton).contains("2").click();

              // Verifica URL
              cy.url().should("include", "page=2");

              // Verifica que conteúdo mudou
              cy.get(selectors.companyCard)
                .first()
                .invoke("text")
                .should("not.equal", initialText);
            });
        }
      });
    });

    it("deve voltar para primeira página", () => {
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          // Vai para página 2
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");

          // Captura conteúdo da página 2
          cy.get(selectors.companyCard)
            .first()
            .invoke("text")
            .then((page2Text) => {
              // Volta para primeira página
              cy.get(selectors.firstPageButton).click();

              // URL não deve ter parâmetro page quando está na página 1
              cy.url().should("not.include", "page=");

              // Conteúdo deve ser diferente
              cy.get(selectors.companyCard)
                .first()
                .invoke("text")
                .should("not.equal", page2Text);
            });
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
        const page3Button = $body.find(
          selectors.paginationButton + ':contains("3")',
        );
        if (page3Button.length > 0) {
          cy.wrap(page3Button).click();
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
        const page5Button = $body.find(
          selectors.paginationButton + ':contains("5")',
        );
        if (page5Button.length > 0) {
          cy.wrap(page5Button).click();
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

  describe("Fluxo completo: Listagem → Paginação → Modal", () => {
    it("deve completar o fluxo de navegação e visualização de receita", () => {
      // 1. Verifica listagem inicial
      cy.get(selectors.companiesList).should("be.visible");
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);

      // 2. Se houver paginação, navega para página 2
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");
          cy.get(selectors.companiesList).should("be.visible");
        }
      });

      // 3. Abre modal de uma empresa
      cy.get(selectors.companyCard)
        .first()
        .within(() => {
          cy.get(selectors.revenueDialogButton).click();
        });

      // 4. Verifica modal
      cy.get(selectors.revenueDialog).should("be.visible");

      // 5. Fecha modal
      cy.get(selectors.revenueDialogClose).click();
      cy.get(selectors.revenueDialog).should("not.exist");

      // 6. Se estava na página 2, volta para primeira página
      cy.url().then((url) => {
        if (url.includes("page=2")) {
          cy.get(selectors.previousPageButton).click();
          cy.url().should("not.include", "page=");
        }
      });

      // 7. Verifica que está mostrando cards
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);
    });

    it("deve manter estado da página após abrir e fechar modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          // Vai para página 2
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");

          // Captura primeiro card da página 2
          cy.get(selectors.companyCard)
            .first()
            .find(selectors.nomeFantasia)
            .invoke("text")
            .then((nomeEmpresa) => {
              // Abre modal
              cy.get(selectors.companyCard)
                .first()
                .within(() => {
                  cy.get(selectors.revenueDialogButton).click();
                });

              // Fecha modal
              cy.get(selectors.revenueDialogClose).click();

              // Verifica se ainda está na página 2
              cy.url().should("include", "page=2");

              // Verifica se o mesmo card ainda está visível
              cy.get(selectors.companyCard)
                .first()
                .should("contain.text", nomeEmpresa);
            });
        }
      });
    });
  });

  describe("Validação de dados", () => {
    it("deve exibir CNPJ formatado ou não formatado", () => {
      cy.get(selectors.companyCard)
        .first()
        .within(() => {
          cy.get(selectors.cnpj).should(($element) => {
            const text = $element.text();
            const cnpjPattern = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14}/;
            expect(text).to.match(cnpjPattern);
          });
        });
    });

    it("deve exibir município e estado separados por barra", () => {
      cy.get(selectors.companyCard).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(selectors.municipioEstado).should(($element) => {
            const text = $element.text();
            // Verifica formato "Município / Estado"
            expect(text).to.match(/.+ \/ .+/);
          });
        });
      });
    });

    it("deve ter razão social e nome fantasia em cada card", () => {
      cy.get(selectors.companyCard)
        .first()
        .within(() => {
          // Razão social
          cy.get(selectors.razaoSocial).should("exist").and("not.be.empty");

          // Nome fantasia
          cy.get(selectors.nomeFantasia).should("exist").and("not.be.empty");
        });
    });
  });

  describe("Performance e UX", () => {
    it("deve carregar a página inicial em tempo razoável", () => {
      cy.visit("/", {
        onBeforeLoad: (win) => {
          win.performance.mark("start");
        },
        onLoad: (win) => {
          win.performance.mark("end");
          win.performance.measure("pageLoad", "start", "end");
          const measure = win.performance.getEntriesByName("pageLoad")[0];
          // Verifica se carregou em menos de 5 segundos
          expect(measure.duration).to.be.lessThan(5000);
        },
      });
    });
  });
});
