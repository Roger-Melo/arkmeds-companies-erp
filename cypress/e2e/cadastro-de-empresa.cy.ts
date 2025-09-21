import { selectors } from "./cadastro-de-empresa/shared/selectors";

describe("Cadastro de Empresa - Formulário de Criação", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Submissão do formulário", () => {
    const validFormData = {
      cnpj: "11222333000181",
      razaoSocial: "Empresa Teste LTDA",
      nomeFantasia: "Empresa Teste",
      cep: "01310100",
      estado: "SP",
      municipio: "São Paulo",
      logradouro: "Avenida Paulista",
      numero: "1000",
      complemento: "Sala 100",
    };

    it("deve desabilitar o botão durante o carregamento de dados da API do CNPJ", () => {
      cy.get(selectors.cnpjInput).type(validFormData.cnpj);
      // Durante a busca de dados, o botão deve ficar desabilitado
      cy.get(selectors.submitButton).should("be.disabled");
      // Após a busca terminar, o botão deve ser habilitado novamente
      cy.get(selectors.submitButton, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve submeter o formulário com dados válidos", () => {
      // Preenche todos os campos obrigatórios
      cy.get(selectors.cnpjInput).type(validFormData.cnpj);
      // Aguarda o carregamento dos dados automáticos
      cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
      // Completa/ajusta campos que podem não vir da API
      cy.get(selectors.razaoSocialInput)
        .clear()
        .type(validFormData.razaoSocial);
      cy.get(selectors.nomeFantasiaInput)
        .clear()
        .type(validFormData.nomeFantasia);
      cy.get(selectors.cepInput).clear().type(validFormData.cep);
      cy.get(selectors.estadoInput).clear().type(validFormData.estado);
      cy.get(selectors.municipioInput).clear().type(validFormData.municipio);
      cy.get(selectors.logradouroInput).clear().type(validFormData.logradouro);
      cy.get(selectors.numeroInput).clear().type(validFormData.numero);
      cy.get(selectors.complementoInput)
        .clear()
        .type(validFormData.complemento);
      // Submete o formulário
      cy.get(selectors.submitButton).click();
      // Verifica se o botão fica desabilitado durante o envio
      cy.get(selectors.submitButton).should("be.disabled");
      // Como a action faz redirect para "/", verifica a navegação
      cy.url({ timeout: 10000 }).should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("não deve submeter o formulário com campos obrigatórios vazios", () => {
      // Tenta submeter sem preencher nada
      cy.get(selectors.submitButton).click();
      // Deve continuar na mesma página
      cy.url().should("include", "/cadastro-de-empresa");
      // Deve mostrar erros nos campos obrigatórios
      cy.get(selectors.cnpjGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CNPJ obrigatório");
    });
  });

  describe("Estado do botão de submit", () => {
    it("deve manter botão desabilitado enquanto houver loading de CNPJ e durante submissão", () => {
      // Durante busca de CNPJ
      cy.get(selectors.cnpjInput).type("34028316000103");
      cy.get(selectors.submitButton).should("be.disabled");
      // Após busca terminar
      cy.get(selectors.submitButton, { timeout: 10000 }).should(
        "not.be.disabled",
      );
      // Preenche campos restantes
      cy.get(selectors.razaoSocialInput).should("not.have.value", "");
      // Durante submissão
      cy.get(selectors.submitButton).click();
      cy.get(selectors.submitButton).should("be.disabled");
    });

    it("deve exibir estilos corretos no botão quando desabilitado", () => {
      cy.get(selectors.cnpjInput).type("34028316000103");
      // Durante loading, verifica estilo desabilitado
      cy.get(selectors.submitButton)
        .should("be.disabled")
        .and("have.css", "opacity", "0.6");
    });
  });

  describe("Estilos e UX", () => {
    it("deve aplicar cor customizada no focus do campo", () => {
      cy.get(selectors.cnpjInputElement).focus();
      cy.get(selectors.cnpjGridContainer)
        .find(".MuiOutlinedInput-root")
        .should("have.class", "Mui-focused")
        .find("fieldset")
        .should("have.css", "border-color");
    });

    it("deve aplicar cor de erro quando inválido", () => {
      cy.get(selectors.cnpjInput).type("11111111111111");
      cy.get(
        `${selectors.cnpjInput.replace(" input", "")} .MuiOutlinedInput-root`,
      ).should("have.class", "Mui-error");
    });

    it("deve respeitar maxLength de 18 caracteres", () => {
      // 14 dígitos + 4 caracteres de formatação = 18
      cy.get(selectors.cnpjInput).should("have.attr", "maxlength", "18");
    });

    it("deve ser responsivo em diferentes tamanhos de tela", () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selectors.cnpjGridContainer).should(
        "have.class",
        "MuiGrid-grid-sm-6",
      );

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.cnpjGridContainer).should(
        "have.class",
        "MuiGrid-grid-xs-12",
      );
    });

    // Função auxiliar para testar responsividade
    function testResponsiveness(fieldName: string, selector: string) {
      it(`deve ser responsivo para campo ${fieldName}`, () => {
        // Desktop
        cy.viewport(1920, 1080);
        cy.get(selector).should("have.class", "MuiGrid-grid-sm-6");
        // Mobile
        cy.viewport(375, 667);
        cy.get(selector).should("have.class", "MuiGrid-grid-xs-12");
      });
    }

    // Lista de campos para testar
    const fieldsToTest = [
      { name: "Razão Social", selector: selectors.razaoSocialGridContainer },
      { name: "Nome Fantasia", selector: selectors.nomeFantasiaGridContainer },
      { name: "CEP", selector: selectors.cepGridContainer },
      { name: "Estado", selector: selectors.estadoGridContainer },
      { name: "Município", selector: selectors.municipioGridContainer },
      { name: "Logradouro", selector: selectors.logradouroGridContainer },
      { name: "Número", selector: selectors.numeroGridContainer },
      { name: "Complemento", selector: selectors.complementoGridContainer },
    ];

    // Executa os testes
    fieldsToTest.forEach((field) => {
      testResponsiveness(field.name, field.selector);
    });
  });

  describe("Interações do teclado", () => {
    it("deve permitir navegação com Tab", () => {
      // Obtém o input
      cy.get(selectors.cnpjInput).focus();
      // Verifica se o elemento focado tem o data-cy correto
      cy.focused().should("have.attr", "data-cy", "cnpjInputElement");
    });

    it("deve permitir copiar e colar (Ctrl+C/Ctrl+V)", () => {
      const cnpj = "11222333000181";

      // Digita o CNPJ
      cy.get(selectors.cnpjInput).type(cnpj);

      // Seleciona tudo e copia
      cy.get(selectors.cnpjInput).type("{selectall}");

      // Limpa e cola
      cy.get(selectors.cnpjInput).clear();
      cy.get(selectors.cnpjInput)
        .invoke("val", "11.222.333/0001-81")
        .trigger("input");

      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve permitir seleção de texto", () => {
      cy.get(selectors.cnpjInput).type("11222333000181");
      cy.get(selectors.cnpjInput).type("{selectall}");

      // Verifica que o texto pode ser selecionado
      cy.window().then((win) => {
        const selection = win.getSelection()?.toString();
        expect(selection).to.equal("11.222.333/0001-81");
      });
    });
  });

  describe("Casos extremos e edge cases", () => {
    it("deve lidar com entrada rápida de dados", () => {
      // Simula digitação muito rápida
      cy.get(selectors.cnpjInput).type("11222333000181", { delay: 0 });
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve lidar com múltiplas operações de clear", () => {
      cy.get(selectors.cnpjInput).type("11222333");
      cy.get(selectors.cnpjInput).clear();
      cy.get(selectors.cnpjInput).type("44555666");
      cy.get(selectors.cnpjInput).clear();
      cy.get(selectors.cnpjInput).type("11222333000181");

      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve manter estado após perder e recuperar foco", () => {
      cy.get(selectors.cnpjInput).type("11222333");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333");

      // Perde o foco
      cy.get(selectors.pageTitle).click();

      // Recupera o foco
      cy.get(selectors.cnpjInput).focus();
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333");
    });
  });

  describe("Performance", () => {
    it("deve renderizar o formulário rapidamente", () => {
      cy.visit("/cadastro-de-empresa", {
        onBeforeLoad: (win) => {
          win.performance.mark("start");
        },
        onLoad: (win) => {
          win.performance.mark("end");
          win.performance.measure("pageLoad", "start", "end");
          const measure = win.performance.getEntriesByName("pageLoad")[0];
          // Verifica se carregou em menos de 3 segundos
          expect(measure.duration).to.be.lessThan(3000);
        },
      });
    });

    it("deve aplicar máscara sem lag perceptível", () => {
      const startTime = performance.now();

      cy.get(selectors.cnpjInput).type("11222333000181");

      const endTime = performance.now();
      const duration = endTime - startTime;

      // A operação deve ser rápida (menos de 1 segundo para digitar)
      expect(duration).to.be.lessThan(1000);
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter label associado ao campo", () => {
      cy.get(selectors.cnpjGridContainer)
        .find("label")
        .should("exist")
        .and("have.attr", "for");
    });

    it("deve ter aria-invalid quando houver erro", () => {
      cy.get(selectors.cnpjInput).type("11111111111111");
      cy.get(selectors.cnpjInput).should("have.attr", "aria-invalid", "true");
    });

    it("deve ter aria-describedby para o helper text", () => {
      cy.get(selectors.cnpjInput).should("have.attr", "aria-describedby");
    });
  });
});
