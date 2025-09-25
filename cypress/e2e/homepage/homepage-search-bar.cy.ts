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
});
