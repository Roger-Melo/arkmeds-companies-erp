describe("Header - Navegação e Elementos", () => {
  // Seletores reutilizáveis
  const selectors = {
    header: "header",
    logo: "header img[alt='Logo Arkmeds']",
    nav: "header nav",
    navList: "header nav ul",
    navLinks: "header nav a",
    inicioLink: "header nav a[href='/']",
    cadastroLink: "header nav a[href='/cadastro-de-empresa']",
  };

  beforeEach(() => {
    cy.visit("/");
    // Aguarda o header carregar completamente
    cy.get(selectors.header).should("be.visible");
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o componente Header", () => {
      cy.get(selectors.header).should("be.visible");
    });

    it("deve exibir o logo da Arkmeds", () => {
      cy.get(selectors.logo)
        .should("be.visible")
        .and("have.attr", "width", "206")
        .and("have.attr", "height", "45");
    });

    it("deve exibir a navegação com links", () => {
      cy.get(selectors.nav).should("be.visible");
      cy.get(selectors.navList).should("be.visible");
      cy.get(selectors.navLinks).should("have.length", 2);
    });

    it("deve exibir os links com os textos corretos", () => {
      const expectedLinks = [
        { text: "Início", href: "/" },
        { text: "Cadastrar Empresa", href: "/cadastro-de-empresa" },
      ];

      cy.get(selectors.navLinks).each(($link, index) => {
        cy.wrap($link)
          .should("have.text", expectedLinks[index].text)
          .and("have.attr", "href", expectedLinks[index].href);
      });
    });

    it("deve ter estrutura HTML semântica correta", () => {
      // Verifica se usa tags semânticas
      cy.get("header").should("exist");
      cy.get("header nav").should("exist");
      cy.get("header nav ul").should("exist");
    });
  });

  describe("Navegação entre páginas", () => {
    it("deve navegar para a página inicial ao clicar em 'Início'", () => {
      // Primeiro vai para outra página
      cy.visit("/cadastro-de-empresa");
      cy.url().should("include", "/cadastro-de-empresa");

      // Clica no link de início
      cy.get(selectors.inicioLink).click();

      // Verifica se navegou corretamente
      cy.url().should("eq", Cypress.config().baseUrl + "/");

      // Verifica se a página inicial carregou
      cy.get('[data-cy="companiesList"]').should("be.visible");
    });

    it("deve navegar para a página de cadastro ao clicar em 'Cadastrar Empresa'", () => {
      // Clica no link de cadastro
      cy.get(selectors.cadastroLink).click();

      // Verifica se navegou corretamente
      cy.url().should("include", "/cadastro-de-empresa");
    });

    it("deve manter o header visível ao navegar entre páginas", () => {
      // Verifica header na página inicial
      cy.get(selectors.header).should("be.visible");

      // Navega para cadastro
      cy.get(selectors.cadastroLink).click();

      // Header ainda deve estar visível
      cy.get(selectors.header).should("be.visible");

      // Todos os elementos do header devem continuar presentes
      cy.get(selectors.logo).should("be.visible");
      cy.get(selectors.nav).should("be.visible");
      cy.get(selectors.navLinks).should("have.length", 2);
    });

    it("deve permitir navegação de ida e volta", () => {
      // Página inicial -> Cadastro -> Início
      cy.url().should("eq", Cypress.config().baseUrl + "/");

      cy.get(selectors.cadastroLink).click();
      cy.url().should("include", "/cadastro-de-empresa");

      cy.get(selectors.inicioLink).click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter texto alternativo no logo", () => {
      cy.get(selectors.logo).should("have.attr", "alt").and("not.be.empty");
    });
  });

  describe("Performance", () => {
    it("deve carregar o header rapidamente", () => {
      cy.visit("/", {
        onBeforeLoad: (win) => {
          win.performance.mark("header-start");
        },
      });

      cy.get(selectors.header)
        .should("be.visible")
        .then(() => {
          cy.window().then((win) => {
            win.performance.mark("header-end");
            win.performance.measure("headerLoad", "header-start", "header-end");
            const measure = win.performance.getEntriesByName("headerLoad")[0];

            // Header deve carregar em menos de 2 segundos
            expect(measure.duration).to.be.lessThan(2000);
          });
        });
    });

    it("deve carregar o logo sem erro", () => {
      cy.get<HTMLImageElement>(selectors.logo)
        .should("be.visible")
        .and(($img) => {
          // Verifica se a imagem carregou corretamente
          expect($img[0].naturalWidth).to.be.greaterThan(0);
          expect($img[0].naturalHeight).to.be.greaterThan(0);
        });
    });
  });

  describe("Integração com outras partes da aplicação", () => {
    it("não deve sobrepor conteúdo da página", () => {
      // Verifica se o header não cobre o conteúdo principal
      cy.get(selectors.header).then(($header) => {
        const headerHeight = $header.height();

        if (headerHeight === undefined) {
          return;
        }

        // Verifica se o conteúdo principal tem margem ou padding adequado
        cy.get('[data-cy="companiesList"]').should(($content) => {
          const contentOffset = $content.offset();
          if (contentOffset === undefined) {
            return;
          }

          const contentTop = contentOffset.top;
          expect(contentTop).to.be.at.least(headerHeight);
        });
      });
    });
  });
});
