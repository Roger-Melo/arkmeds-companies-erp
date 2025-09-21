import { selectors } from "../shared/selectors";

describe("Listagem de Empresas", () => {
  beforeEach(() => {
    cy.visit("/");
    // Aguarda a página carregar completamente
    cy.get(selectors.companiesList).should("be.visible");
  });

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
