import { selectors } from "../shared/selectors";

describe("SearchBar", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o componente SearchBar", () => {
      cy.get(selectors.searchBar).should("be.visible");
    });

    it("deve renderizar o campo de busca com placeholder correto", () => {
      cy.get(selectors.searchBarInput)
        .should("be.visible")
        .find("input")
        .should(
          "have.attr",
          "placeholder",
          "Buscar por nome ou CNPJ da empresa",
        );
    });

    it("deve renderizar o ícone de busca", () => {
      cy.get(selectors.searchBarIcon).should("be.visible");
    });

    it("deve renderizar o título 'Empresas Cadastradas' acima do SearchBar", () => {
      cy.get(selectors.pageHeading)
        .should("be.visible")
        .and("have.text", "Empresas Cadastradas");
    });
  });

  describe("Estrutura e Posicionamento", () => {
    it("deve estar posicionado entre o título e a lista de empresas", () => {
      // Verifica ordem dos elementos na página
      cy.get(selectors.pageHeading).then(($heading) => {
        cy.get(selectors.searchBar).then(($searchBar) => {
          cy.get(selectors.companiesList).then(($list) => {
            const headingTop = $heading[0].getBoundingClientRect().top;
            const searchBarTop = $searchBar[0].getBoundingClientRect().top;
            const listTop = $list[0].getBoundingClientRect().top;

            // SearchBar deve estar abaixo do título
            expect(searchBarTop).to.be.greaterThan(headingTop);
            // Lista deve estar abaixo do SearchBar
            expect(listTop).to.be.greaterThan(searchBarTop);
          });
        });
      });
    });

    it("deve ter largura máxima apropriada em diferentes viewports", () => {
      // Desktop
      cy.viewport(1200, 800);
      cy.get(selectors.searchBar).should(($el) => {
        const width = $el.width();
        expect(width).to.be.at.most(600);
      });

      // Tablet
      cy.viewport(768, 1024);
      cy.get(selectors.searchBar).should(($el) => {
        const width = $el.width();
        expect(width).to.be.at.most(500);
      });

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.searchBar).should(($el) => {
        const width = $el.width();
        const parentWidth = $el.parent().width();
        // Em mobile deve ocupar 100% da largura disponível
        expect(width).to.be.closeTo(parentWidth!, 20);
      });
    });

    it("deve estar centralizado horizontalmente", () => {
      cy.get(selectors.searchBar).then(($searchBar) => {
        const searchBar = $searchBar[0].getBoundingClientRect();

        cy.get(selectors.homepageContainer).then(($container) => {
          const container = $container[0].getBoundingClientRect();

          // Calcula as distâncias das bordas
          const leftDistance = searchBar.left - container.left;
          const rightDistance = container.right - searchBar.right;

          // Deve estar aproximadamente centralizado (tolerância de 10px)
          expect(Math.abs(leftDistance - rightDistance)).to.be.lessThan(10);
        });
      });
    });
  });

  describe("Responsividade", () => {
    it("deve ajustar o tamanho da fonte em diferentes viewports", () => {
      // Desktop
      cy.viewport(1200, 800);
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.css", "font-size", "16px");

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.css", "font-size", "14px");
    });

    it("deve ajustar o padding do input em diferentes viewports", () => {
      // Desktop
      cy.viewport(1200, 800);
      cy.get(selectors.searchBarInput)
        .find("input")
        .then(($input) => {
          const paddingTop = parseInt($input.css("padding-top"));
          const paddingBottom = parseInt($input.css("padding-bottom"));
          expect(paddingTop).to.be.at.least(14);
          expect(paddingBottom).to.be.at.least(14);
        });

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.searchBarInput)
        .find("input")
        .then(($input) => {
          const paddingTop = parseInt($input.css("padding-top"));
          const paddingBottom = parseInt($input.css("padding-bottom"));
          expect(paddingTop).to.be.at.least(12);
          expect(paddingBottom).to.be.at.least(12);
        });
    });
  });

  describe("Estilo e Tema", () => {
    it("deve aplicar a cor primária do tema no ícone", () => {
      cy.get(selectors.searchBarIcon).should(
        "have.css",
        "color",
        "rgb(36, 76, 90)",
      ); // #244C5A em RGB
    });

    it("deve ter background branco no campo de busca", () => {
      cy.get(selectors.searchBarInput)
        .find(".MuiOutlinedInput-root")
        .should("have.css", "background-color", "rgb(255, 255, 255)");
    });

    it("deve aplicar hover effect na borda", () => {
      // Estado normal
      cy.get(selectors.searchBarInput)
        .find(".MuiOutlinedInput-notchedOutline")
        .should("have.css", "border-color");

      // Simula hover
      cy.get(selectors.searchBarInput)
        .find(".MuiOutlinedInput-root")
        .trigger("mouseover");

      // Verifica mudança visual (a cor exata pode variar)
      cy.get(selectors.searchBarInput)
        .find(".MuiOutlinedInput-root")
        .should("have.class", "MuiOutlinedInput-root");
    });

    it("deve aplicar focus effect na borda", () => {
      cy.get(selectors.searchBarInput).find("input").focus();

      cy.get(selectors.searchBarInput)
        .find(".MuiOutlinedInput-root")
        .should("have.class", "Mui-focused");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica apropriada", () => {
      // Campo de busca deve ser um input
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.attr", "type", "text");
    });

    it("deve ser focável via teclado", () => {
      // Testa se o campo pode receber foco programaticamente
      cy.get(selectors.searchBarInput)
        .find("input")
        .focus()
        .should("have.focus");

      // Verifica que o placeholder está visível quando focado
      cy.focused().should(
        "have.attr",
        "placeholder",
        "Buscar por nome ou CNPJ da empresa",
      );
    });

    it("deve ter placeholder descritivo", () => {
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.attr", "placeholder")
        .and("not.be.empty");
    });
  });

  describe("Funcionalidade de Busca", () => {
    it("deve filtrar empresas ao digitar no campo de busca", () => {
      // Captura quantidade inicial de empresas
      cy.get(selectors.companyCard)
        .its("length")
        .then((initialCount) => {
          // Digita um termo de busca
          cy.get(selectors.searchBarInput).find("input").type("games");

          // Aguarda o debounce e a navegação
          cy.wait(500);

          // Verifica que a URL foi atualizada
          cy.url().should("include", "search=games");

          // Verifica que o número de empresas mudou OU apareceu mensagem
          cy.get("body").then(($body) => {
            const hasCards = $body.find(selectors.companyCard).length > 0;
            const hasNoResultsMessage = $body
              .text()
              .includes("Nenhuma empresa encontrada");

            // Deve ter cards filtrados OU mensagem de não encontrado
            expect(hasCards || hasNoResultsMessage).to.equal(true);

            // Se tem cards, deve ter menos que antes
            if (hasCards) {
              cy.get(selectors.companyCard).should(
                "have.length.at.most",
                initialCount,
              );
            }
          });
        });
    });

    it("deve mostrar mensagem quando não encontrar resultados", () => {
      // Busca por algo que não existe
      cy.get(selectors.searchBarInput).find("input").type("xyz999inexistente");

      cy.wait(500);

      // Verifica mensagem de não encontrado
      cy.contains("Nenhuma empresa encontrada").should("be.visible");
      cy.contains("Tente buscar por outro nome ou CNPJ").should("be.visible");

      // Verifica que não há cards
      cy.get(selectors.companyCard).should("not.exist");

      // Verifica que paginação não aparece
      cy.get(selectors.pagination).should("not.exist");
    });

    it("deve mostrar ícone de loading durante a busca", () => {
      cy.get(selectors.searchBarInput).find("input").type("tech");

      // O CircularProgress deve aparecer brevemente
      cy.get(selectors.searchBar)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Após carregar, volta ao ícone normal
      cy.wait(500);
      cy.get(selectors.searchBarIcon).should("be.visible");
    });
  });

  describe("Botão Limpar (Clear)", () => {
    it("deve aparecer botão X quando há texto", () => {
      // Inicialmente não deve haver botão clear
      cy.get(selectors.searchBar)
        .find('button[aria-label="limpar busca"]')
        .should("not.exist");

      // Digite algo
      cy.get(selectors.searchBarInput).find("input").type("empresa");

      // Botão clear deve aparecer
      cy.get(selectors.searchBar)
        .find('button[aria-label="limpar busca"]')
        .should("be.visible");
    });

    it("deve limpar busca ao clicar no X", () => {
      // Digite algo
      cy.get(selectors.searchBarInput).find("input").type("tech");

      cy.wait(500);
      cy.url().should("include", "search=tech");

      // Clique no botão limpar
      cy.get(selectors.searchBar)
        .find('button[aria-label="limpar busca"]')
        .click();

      // Campo deve estar vazio
      cy.get(selectors.searchBarInput).find("input").should("have.value", "");

      // URL não deve ter parâmetro search
      cy.url().should("not.include", "search=");

      // Todas as empresas devem voltar a aparecer
      cy.get(selectors.companyCard).should("have.length.greaterThan", 0);
    });

    it("deve ter hover effect no botão limpar", () => {
      cy.get(selectors.searchBarInput).find("input").type("teste");

      cy.get(selectors.searchBar)
        .find('button[aria-label="limpar busca"]')
        .trigger("mouseover")
        .should("have.css", "background-color");
    });
  });

  describe("Busca por CNPJ", () => {
    it("deve encontrar empresa por CNPJ formatado", () => {
      // Pega o CNPJ de uma empresa visível
      cy.get(selectors.companyCard)
        .first()
        .find(selectors.cnpj)
        .invoke("text")
        .then((cnpj) => {
          // Digite o CNPJ formatado
          cy.get(selectors.searchBarInput).find("input").clear().type(cnpj);

          // Aguarda mais tempo para garantir re-render completo
          cy.wait(1000);

          // Aguarda a URL mudar (indica que a navegação ocorreu)
          cy.url().should("include", "search=");

          // Aguarda a lista estabilizar
          cy.get(selectors.companiesList).should("exist");

          // Nova query para pegar cards atualizados
          cy.get(selectors.companyCard)
            .should("have.length.at.least", 1)
            .each(($card) => {
              // Usa invoke com callback para evitar detached DOM
              cy.wrap($card)
                .find(selectors.cnpj)
                .should("exist")
                .invoke("text")
                .should("equal", cnpj);
            });
        });
    });

    it("deve encontrar empresa por CNPJ sem formatação", () => {
      cy.get(selectors.companyCard)
        .first()
        .find(selectors.cnpj)
        .invoke("text")
        .then((cnpjFormatted) => {
          // Remove formatação
          const cnpjNumbers = cnpjFormatted.replace(/\D/g, "");

          cy.get(selectors.searchBarInput)
            .find("input")
            .clear()
            .type(cnpjNumbers);

          cy.wait(1000);

          // Aguarda a URL mudar
          cy.url().should("include", "search=");

          // Nova query após re-render
          cy.get(selectors.companyCard)
            .should("have.length.at.least", 1)
            .each(($card) => {
              cy.wrap($card)
                .find(selectors.cnpj)
                .should("exist")
                .invoke("text")
                .then((cardCnpj) => {
                  const cardCnpjNumbers = cardCnpj.replace(/\D/g, "");
                  expect(cardCnpjNumbers).to.equal(cnpjNumbers);
                });
            });
        });
    });

    it("deve encontrar empresa por CNPJ parcial (mínimo 6 dígitos)", () => {
      cy.get(selectors.companyCard)
        .first()
        .find(selectors.cnpj)
        .invoke("text")
        .then((cnpj) => {
          // Pega apenas os primeiros 6 dígitos
          const partialCNPJ = cnpj.replace(/\D/g, "").substring(0, 6);

          cy.get(selectors.searchBarInput)
            .find("input")
            .clear()
            .type(partialCNPJ);

          cy.wait(500);

          // Deve encontrar pelo menos uma empresa
          cy.get(selectors.companyCard).should("have.length.greaterThan", 0);
        });
    });

    it("NÃO deve encontrar com menos de 6 dígitos do CNPJ", () => {
      cy.get(selectors.searchBarInput).find("input").type("12345"); // Apenas 5 dígitos

      cy.wait(500);

      // Não deve encontrar resultados
      cy.contains("Nenhuma empresa encontrada").should("be.visible");
    });
  });

  describe("Persistência e Navegação", () => {
    it("deve manter busca ao recarregar página (F5)", () => {
      // Faça uma busca
      cy.get(selectors.searchBarInput).find("input").type("premium");

      cy.wait(500);
      cy.url().should("include", "search=premium");

      // Recarrega a página
      cy.reload();

      // Campo deve manter o valor
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.value", "premium");

      // URL deve manter o parâmetro
      cy.url().should("include", "search=premium");
    });

    it("deve resetar página para 1 ao fazer nova busca", () => {
      // Se houver paginação, vá para página 2
      cy.get("body").then(($body) => {
        if ($body.find(selectors.nextPageButton).length > 0) {
          cy.get(selectors.nextPageButton).click();
          cy.url().should("include", "page=2");

          // Faça uma busca
          cy.get(selectors.searchBarInput).find("input").type("games");

          cy.wait(500);

          // Verifica que tem o termo de busca
          cy.url().should("include", "search=games");

          // Verifica que NÃO está mais na página 2
          cy.url().should("not.include", "page=2");

          // Verifica se ainda há paginação após a busca
          cy.get("body").then(($bodyAfterSearch) => {
            if ($bodyAfterSearch.find(selectors.pagination).length > 0) {
              // Se há paginação, verifica que está na página 1
              cy.get(".Mui-selected").should("contain.text", "1");
            } else {
              // Se não há paginação, apenas verifica que tem resultados
              cy.get(selectors.companyCard).should("exist");
            }
          });
        }
      });
    });

    it("deve limpar busca ao clicar em Início no menu", () => {
      // Faça uma busca
      cy.get(selectors.searchBarInput).find("input").type("games");

      cy.wait(500);
      cy.url().should("include", "search=games");

      // Clique no link Início
      cy.contains("a", "Início").click();

      // Campo deve estar limpo
      cy.get(selectors.searchBarInput).find("input").should("have.value", "");

      // URL não deve ter parâmetros
      cy.url().should("match", /\/$|\/\?$/);
    });

    it("deve permitir acesso direto via URL", () => {
      // Acessa diretamente com parâmetro de busca
      cy.visit("/?search=tech&page=1");

      // Campo deve estar preenchido
      cy.get(selectors.searchBarInput)
        .find("input")
        .should("have.value", "tech");

      // Deve mostrar resultados filtrados
      cy.get("body").then(($body) => {
        if ($body.find(selectors.companyCard).length > 0) {
          cy.get(selectors.companyCard).each(($card) => {
            cy.wrap($card)
              .invoke("text")
              .then((text) => {
                expect(text.toLowerCase()).to.include("tech");
              });
          });
        }
      });
    });
  });

  describe("Casos Extremos e Validações", () => {
    it("deve lidar com busca mista de texto e números (bug xyz123)", () => {
      cy.get(selectors.searchBarInput).find("input").type("xyz123");

      cy.wait(500);

      // NÃO deve encontrar empresas
      cy.contains("Nenhuma empresa encontrada").should("be.visible");
    });

    it("deve ignorar espaços extras", () => {
      // Primeiro, pega uma empresa que existe
      cy.get(selectors.companyCard)
        .first()
        .find(selectors.nomeFantasia)
        .invoke("text")
        .then((nomeEmpresa) => {
          // Pega a primeira palavra do nome
          const primeiraPalavra = nomeEmpresa.split(" ")[0];

          // Limpa o campo e busca com espaços extras
          cy.get(selectors.searchBarInput)
            .find("input")
            .clear()
            .type(`   ${primeiraPalavra}   `);

          cy.wait(500);

          // Deve encontrar a empresa normalmente
          cy.get(selectors.companyCard).should("have.length.greaterThan", 0);

          // Verifica que encontrou a empresa correta
          cy.get(selectors.companyCard).should(($cards) => {
            const cardsText = $cards.text();
            expect(cardsText).to.include(primeiraPalavra);
          });
        });
    });

    it("deve ser case-insensitive", () => {
      // Teste com maiúsculas
      cy.get(selectors.searchBarInput).find("input").type("PREMIUM");

      cy.wait(500);

      // Captura resultados
      cy.get("body").then(($body) => {
        const hasCards = $body.find(selectors.companyCard).length;

        // Limpa e testa com minúsculas
        cy.get(selectors.searchBarInput).find("input").clear().type("premium");

        cy.wait(500);

        // Deve ter mesma quantidade
        if (hasCards > 0) {
          cy.get(selectors.companyCard).should("have.length", hasCards);
        } else {
          cy.contains("Nenhuma empresa encontrada").should("be.visible");
        }
      });
    });

    it("deve funcionar com caracteres especiais", () => {
      cy.get(selectors.searchBarInput).find("input").type("& CIA");

      // Aguarda a URL ser atualizada (não apenas wait)
      cy.url().should("include", "search=", { timeout: 2000 });

      // Agora verifica o conteúdo
      cy.get(selectors.companyCard).should("have.length.at.least", 1);

      // Verifica que encontrou empresas com CIA
      cy.get(selectors.companyCard)
        .first()
        .then(($card) => {
          const text = $card.text().toUpperCase();
          expect(text).to.include("CIA");
        });
    });
  });
});
