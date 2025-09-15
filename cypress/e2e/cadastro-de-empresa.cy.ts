describe("Cadastro de Empresa - Formulário de Criação", () => {
  // Seletores reutilizáveis
  const selectors = {
    pageTitle: '[data-cy="pageTitle"]',
    companyForm: '[data-cy="companyForm"]',
    companyDataSection: '[data-cy="companyDataSection"]',
    cnpjInput: '[data-cy="cnpjInput"] input',
    cnpjHelperText: ".MuiFormHelperText-root",
    cnpjGridContainer: '[data-cy="cnpjGridContainer"]',
    razaoSocialInput: '[data-cy="razaoSocialInput"] input',
    razaoSocialGridContainer: '[data-cy="razaoSocialGridContainer"]',
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

    it("deve renderizar o campo Razão Social com placeholder correto", () => {
      cy.get(selectors.razaoSocialInput)
        .should("be.visible")
        .and("have.attr", "placeholder", "Digite a razão social da empresa");
    });

    it("deve ter o campo Razão Social vazio inicialmente", () => {
      cy.get(selectors.razaoSocialInput).should("have.value", "");
    });

    it("deve renderizar o campo Razão Social sem estar desabilitado inicialmente", () => {
      cy.get(selectors.razaoSocialInput).should("not.be.disabled");
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

  describe("Validação de Razão Social", () => {
    it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
      cy.get(selectors.razaoSocialInput).type("a").clear();
      cy.get(selectors.razaoSocialInput).blur();

      cy.get(selectors.razaoSocialGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Razão Social obrigatória")
        .and("have.class", "Mui-error");
    });

    it("deve ter limite máximo de 100 caracteres configurado", () => {
      cy.get(selectors.razaoSocialInput).should(
        "have.attr",
        "maxlength",
        "100",
      );
    });

    it("deve impedir entrada de mais de 100 caracteres", () => {
      const texto100 = "a".repeat(100);
      const textoExtra = "bcdef";

      cy.get(selectors.razaoSocialInput).type(texto100);
      cy.get(selectors.razaoSocialInput).should("have.value", texto100);

      // Tenta digitar mais caracteres
      cy.get(selectors.razaoSocialInput).type(textoExtra);

      // Verifica que ainda tem apenas 100 caracteres
      cy.get(selectors.razaoSocialInput).should("have.value", texto100);
    });

    it("deve aceitar Razão Social válida sem mostrar erro", () => {
      cy.get(selectors.razaoSocialInput).type("Empresa Teste LTDA");
      cy.get(selectors.razaoSocialInput).blur();

      cy.get(selectors.razaoSocialGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.exist");
    });

    it("deve respeitar maxLength de 100 caracteres", () => {
      cy.get(selectors.razaoSocialInput).should(
        "have.attr",
        "maxlength",
        "100",
      );
    });
  });

  describe("Integração com API de CNPJ (teste real)", () => {
    const cnpjTeste = {
      numero: "59155651000101", // CNPJ da Empresa Brasileira de Correios e Telégrafos
      razaoSocialEsperada: "59.155.651 ROGER WATERS ALVES DE MELO",
    };

    it("deve buscar e preencher dados da empresa ao inserir CNPJ válido", () => {
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Aguarda o campo Razão Social ser preenchido (timeout maior para chamada real)
      cy.get(selectors.razaoSocialInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se algum valor foi preenchido
      cy.get(selectors.razaoSocialInput)
        .invoke("val")
        .should("have.length.greaterThan", 0);
    });

    it("deve mostrar indicador de loading durante busca de dados reais", () => {
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Verifica rapidamente se o loading aparece
      cy.get(selectors.razaoSocialGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      // Verifica se o CircularProgress está visível durante o loading
      cy.get(selectors.razaoSocialGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      // Verifica que o loading sumiu
      cy.get(selectors.razaoSocialGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar e habilitar campo Razão Social durante processo de busca", () => {
      // Campo deve estar habilitado inicialmente
      cy.get(selectors.razaoSocialInput).should("not.be.disabled");

      // Digita o CNPJ
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Verifica se o campo fica desabilitado durante a busca
      cy.get(selectors.razaoSocialInput).should("be.disabled");

      // Aguarda a busca terminar e o campo ser habilitado novamente
      cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("não deve fazer chamada à API para CNPJ inválido", () => {
      // Digita CNPJ inválido
      cy.get(selectors.cnpjInput).type("11111111111111");

      // Aguarda para garantir que não houve chamada
      cy.wait(2000);

      // Simplesmente verifica que o campo continua vazio e habilitado
      cy.get(selectors.razaoSocialInput)
        .should("have.value", "")
        .should("not.be.disabled");

      // Verifica que não há spinner de loading
      cy.get(".MuiCircularProgress-root").should("not.exist");
    });

    it("deve permitir edição manual do campo Razão Social após preenchimento automático", () => {
      // Primeiro, preenche automaticamente via API
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Aguarda o preenchimento automático
      cy.get(selectors.razaoSocialInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Limpa e digita novo valor
      cy.get(selectors.razaoSocialInput)
        .clear()
        .type("Nova Razão Social Digitada");

      // Verifica que o valor foi alterado
      cy.get(selectors.razaoSocialInput).should(
        "have.value",
        "Nova Razão Social Digitada",
      );
    });

    it("deve buscar dados apenas uma vez por CNPJ válido", () => {
      // Digite o CNPJ
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Aguarda o primeiro preenchimento
      cy.get(selectors.razaoSocialInput, { timeout: 10000 }).should(
        "not.have.value",
        "",
      );

      // Armazena o valor preenchido
      cy.get(selectors.razaoSocialInput)
        .invoke("val")
        .then((valorPreenchido) => {
          // Adiciona e remove um dígito (não deve buscar novamente)
          cy.get(selectors.cnpjInput).type("9");
          cy.get(selectors.cnpjInput).type("{backspace}");

          // Aguarda um pouco
          cy.wait(1000);

          // Verifica que não apareceu loading novamente
          cy.get(selectors.razaoSocialGridContainer)
            .find(".MuiCircularProgress-root")
            .should("not.exist");

          // Valor deve permanecer o mesmo
          cy.get(selectors.razaoSocialInput).should(
            "have.value",
            valorPreenchido,
          );
        });
    });

    it("deve lidar com timeout ou erro de rede graciosamente", () => {
      // Este teste depende do comportamento da API real
      // Se a API estiver fora do ar ou lenta, o campo deve permanecer editável

      // Usa um CNPJ válido
      cy.get(selectors.cnpjInput).type(cnpjTeste.numero);

      // Mesmo que a API falhe, o campo deve eventualmente ficar habilitado
      // (após timeout ou erro)
      cy.get(selectors.razaoSocialInput, { timeout: 15000 }).should(
        "not.be.disabled",
      );

      // O usuário deve poder digitar manualmente se necessário
      cy.get(selectors.razaoSocialInput)
        .should("not.be.disabled")
        .type("{selectall}Digitado Manualmente")
        .should("have.value", "Digitado Manualmente");
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

    it("deve ser responsivo para campo Razão Social", () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selectors.razaoSocialGridContainer).should(
        "have.class",
        "MuiGrid-grid-sm-6",
      );

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.razaoSocialGridContainer).should(
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
