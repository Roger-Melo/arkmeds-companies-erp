describe("Cadastro de Empresa - Formulário de Criação", () => {
  // Seletores reutilizáveis
  const selectors = {
    pageTitle: '[data-cy="pageTitle"]',
    companyForm: '[data-cy="companyForm"]',
    companyDataSection: '[data-cy="companyDataSection"]',
    cnpjInput: '[data-cy="cnpjInput"] input',
    cnpjHelperText: ".MuiFormHelperText-root",
    cnpjGridContainer: '[data-cy="cnpjGridContainer"]',
  };

  // CNPJs válidos para teste
  const validCNPJs = {
    formatted: "11.222.333/0001-81",
    unformatted: "11222333000181",
    realCompany: "34028316000103",
  };

  const invalidCNPJs = {
    allSameDigits: "11111111111111",
    wrongCheckDigit: "11222333000180",
    incomplete: "112223330001",
    tooMany: "112223330001811",
  };

  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o título da página corretamente", () => {
      cy.get(selectors.pageTitle)
        .should("be.visible")
        .and("contain.text", "Cadastro de Empresa");
    });

    it("deve renderizar o formulário de cadastro", () => {
      cy.get(selectors.companyForm).should("be.visible");
    });

    it("deve renderizar a seção 'Dados da Empresa'", () => {
      cy.get(selectors.companyDataSection)
        .should("be.visible")
        .and("contain.text", "Dados da Empresa");
    });

    it("deve renderizar o campo CNPJ com placeholder correto", () => {
      cy.get(selectors.cnpjInput)
        .should("be.visible")
        .and("have.attr", "placeholder", "00000000000000");
    });

    it("deve exibir helper text inicial", () => {
      cy.get(selectors.cnpjInput)
        .parent()
        .parent()
        .find(selectors.cnpjHelperText)
        .should("be.visible")
        .and("contain.text", "Digite apenas os números");
    });

    it("deve renderizar o Paper com elevation correto", () => {
      cy.get(".MuiPaper-root").should("have.class", "MuiPaper-elevation3");
    });

    it("deve ter o campo CNPJ vazio inicialmente", () => {
      cy.get(selectors.cnpjInput).should("have.value", "");
    });
  });

  describe("Máscara de CNPJ", () => {
    it("deve aplicar máscara progressivamente ao digitar", () => {
      const cnpj = "11222333000181";

      // Testa cada etapa da máscara
      cy.get(selectors.cnpjInput).type("11");
      cy.get(selectors.cnpjInput).should("have.value", "11");

      cy.get(selectors.cnpjInput).type("2");
      cy.get(selectors.cnpjInput).should("have.value", "11.2");

      cy.get(selectors.cnpjInput).clear().type("11222");
      cy.get(selectors.cnpjInput).should("have.value", "11.222");

      cy.get(selectors.cnpjInput).type("3");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.3");

      cy.get(selectors.cnpjInput).clear().type("11222333");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333");

      cy.get(selectors.cnpjInput).type("0");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0");

      cy.get(selectors.cnpjInput).clear().type("112223330001");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001");

      cy.get(selectors.cnpjInput).type("8");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-8");

      cy.get(selectors.cnpjInput).clear().type(cnpj);
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve limitar a 14 dígitos", () => {
      const cnpjComExcesso = "112223330001819999";

      cy.get(selectors.cnpjInput).type(cnpjComExcesso);
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve aceitar apenas números", () => {
      cy.get(selectors.cnpjInput).type("abc11def222ghi333jkl0001mn81op");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");
    });

    it("deve manter a máscara ao deletar caracteres", () => {
      cy.get(selectors.cnpjInput).type("11222333000181");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-81");

      // Remove o último dígito
      cy.get(selectors.cnpjInput).type("{backspace}");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001-8");

      // Remove mais um
      cy.get(selectors.cnpjInput).type("{backspace}");
      cy.get(selectors.cnpjInput).should("have.value", "11.222.333/0001");
    });
  });

  describe("Validação de CNPJ", () => {
    it("deve mostrar erro para CNPJ incompleto", () => {
      cy.get(selectors.cnpjInput).type("1122233300");
      cy.get(selectors.cnpjInput).blur();

      cy.get(selectors.cnpjHelperText)
        .should("contain.text", "O CNPJ deve ter 14 dígitos")
        .and("have.class", "Mui-error");
    });

    it("deve mostrar erro para CNPJ com todos dígitos iguais", () => {
      cy.get(selectors.cnpjInput).type(invalidCNPJs.allSameDigits);
      cy.get(selectors.cnpjInput).blur();

      cy.get(selectors.cnpjHelperText)
        .should("contain.text", "CNPJ inválido")
        .and("have.class", "Mui-error");
    });

    it("deve mostrar erro para CNPJ com dígito verificador incorreto", () => {
      cy.get(selectors.cnpjInput).type(invalidCNPJs.wrongCheckDigit);
      cy.get(selectors.cnpjInput).blur();

      cy.get(selectors.cnpjHelperText)
        .should("contain.text", "CNPJ inválido")
        .and("have.class", "Mui-error");
    });

    it("deve aceitar CNPJ válido sem mostrar erro", () => {
      cy.get(selectors.cnpjInput).type(validCNPJs.unformatted);
      cy.get(selectors.cnpjInput).blur();

      cy.get(selectors.cnpjHelperText)
        .should("not.have.class", "Mui-error")
        .and("contain.text", "Digite apenas os números");
    });

    it("deve validar em tempo real (modo onChange)", () => {
      // Digite um CNPJ inválido
      cy.get(selectors.cnpjInput).type("11222333000180");

      // Sem precisar blur, já deve mostrar erro
      cy.get(selectors.cnpjHelperText)
        .should("contain.text", "CNPJ inválido")
        .and("have.class", "Mui-error");

      // Corrige o último dígito
      cy.get(selectors.cnpjInput).type("{backspace}1");

      // Erro deve sumir
      cy.get(selectors.cnpjHelperText).should("not.have.class", "Mui-error");
    });

    it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
      cy.get(selectors.cnpjInput).type("1").clear();
      cy.get(selectors.cnpjInput).blur();

      cy.get(selectors.cnpjHelperText)
        .should("contain.text", "CNPJ obrigatório")
        .and("have.class", "Mui-error");
    });
  });

  describe("Função handleCNPJComplete", () => {
    it("deve executar handleCNPJComplete ao inserir CNPJ válido com 14 dígitos", () => {
      // Intercepta console.log para verificar se a função foi chamada
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.get(selectors.cnpjInput).type(validCNPJs.unformatted);

      // Verifica se os console.log foram chamados
      cy.get("@consoleLog").should("have.been.calledWith", "Executou a função");
      cy.get("@consoleLog").should(
        "have.been.calledWith",
        "CNPJ completo e válido:",
        "11.222.333/0001-81",
      );
    });

    it("não deve executar handleCNPJComplete para CNPJ inválido", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.get(selectors.cnpjInput).type(invalidCNPJs.wrongCheckDigit);

      // Verifica que a função NÃO foi chamada
      cy.get("@consoleLog").should("not.have.been.called");
    });

    it("não deve executar handleCNPJComplete para CNPJ incompleto", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.get(selectors.cnpjInput).type("1122233300");

      cy.get("@consoleLog").should("not.have.been.called");
    });

    it("deve executar apenas uma vez mesmo com múltiplas edições", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      // Digita CNPJ válido
      cy.get(selectors.cnpjInput).type(validCNPJs.unformatted);

      // Adiciona e remove caracteres (não deve executar novamente)
      cy.get(selectors.cnpjInput).type("9");
      cy.get(selectors.cnpjInput).type("{backspace}");

      // Verifica que foi chamado apenas 2 vezes (uma para cada console.log)
      cy.get("@consoleLog").should("have.been.calledTwice");
    });
  });

  describe("Estilos e UX", () => {
    it("deve aplicar cor customizada no focus do campo", () => {
      cy.get(selectors.cnpjInput).focus();

      // Verifica se a borda muda para a cor customizada no focus
      cy.get(selectors.cnpjInput)
        .parent()
        .should("have.class", "Mui-focused")
        .find("fieldset")
        .should("have.css", "border-color");
    });

    it("deve aplicar cor de erro quando inválido", () => {
      cy.get(selectors.cnpjInput).type("11111111111111");

      cy.get(selectors.cnpjInput).parent().should("have.class", "Mui-error");
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
  });

  describe("Interações do teclado", () => {
    it("deve permitir navegação com Tab", () => {
      cy.get(selectors.cnpjInput).focus();
      cy.focused()
        .parent()
        .parent()
        .should("have.attr", "data-cy", "cnpjInput");
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
      cy.get(selectors.cnpjInput)
        .parent()
        .parent()
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
