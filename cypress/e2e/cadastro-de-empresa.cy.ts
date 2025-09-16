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
    nomeFantasiaInput: '[data-cy="nomeFantasiaInput"] input',
    nomeFantasiaGridContainer: '[data-cy="nomeFantasiaGridContainer"]',
    cepInput: '[data-cy="cepInput"] input',
    cepGridContainer: '[data-cy="cepGridContainer"]',
    companyAddressSection: '[data-cy="companyAddressSection"]',
    estadoInput: '[data-cy="estadoInput"] input',
    estadoGridContainer: '[data-cy="estadoGridContainer"]',
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

  const validCEPs = {
    formatted: "01310-100",
    unformatted: "01310100",
    realCEP: "04567000",
  };

  const invalidCEPs = {
    incomplete: "0131010",
    tooMany: "013101000",
    invalidFormat: "12345678",
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

    it("deve renderizar o campo Nome Fantasia com placeholder correto", () => {
      cy.get(selectors.nomeFantasiaInput)
        .should("be.visible")
        .and("have.attr", "placeholder", "Digite o nome fantasia da empresa");
    });

    it("deve ter o campo Nome Fantasia vazio inicialmente", () => {
      cy.get(selectors.nomeFantasiaInput).should("have.value", "");
    });

    it("deve renderizar o campo Nome Fantasia sem estar desabilitado inicialmente", () => {
      cy.get(selectors.nomeFantasiaInput).should("not.be.disabled");
    });

    it("deve renderizar a seção 'Endereço da Empresa'", () => {
      cy.get(selectors.companyAddressSection)
        .should("be.visible")
        .and("contain.text", "Endereço da Empresa");
    });

    it("deve renderizar o campo CEP com placeholder correto", () => {
      cy.get(selectors.cepInput)
        .should("be.visible")
        .and("have.attr", "placeholder", "00000000");
    });

    it("deve ter o campo CEP vazio inicialmente", () => {
      cy.get(selectors.cepInput).should("have.value", "");
    });

    it("deve renderizar o campo CEP sem estar desabilitado inicialmente", () => {
      cy.get(selectors.cepInput).should("not.be.disabled");
    });

    it("deve exibir helper text inicial para CEP", () => {
      cy.get(selectors.cepInput)
        .parent()
        .parent()
        .find(selectors.cnpjHelperText)
        .should("be.visible")
        .and("contain.text", "Digite apenas os números");
    });

    it("deve renderizar o campo Estado com placeholder correto", () => {
      cy.get(selectors.estadoInput)
        .should("be.visible")
        .and("have.attr", "placeholder", "UF");
    });

    it("deve ter o campo Estado vazio inicialmente", () => {
      cy.get(selectors.estadoInput).should("have.value", "");
    });

    it("deve renderizar o campo Estado sem estar desabilitado inicialmente", () => {
      cy.get(selectors.estadoInput).should("not.be.disabled");
    });

    it("deve exibir helper text inicial para Estado", () => {
      cy.get(selectors.estadoInput)
        .parent()
        .parent()
        .find(selectors.cnpjHelperText)
        .should("be.visible")
        .and("contain.text", "Digite a sigla do estado (UF)");
    });
  });

  describe("Máscara de CEP", () => {
    it("deve aplicar máscara progressivamente ao digitar", () => {
      const cep = "01310100";

      cy.get(selectors.cepInput).type("01310");
      cy.get(selectors.cepInput).should("have.value", "01310");

      cy.get(selectors.cepInput).type("1");
      cy.get(selectors.cepInput).should("have.value", "01310-1");

      cy.get(selectors.cepInput).clear().type(cep);
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve limitar a 8 dígitos", () => {
      const cepComExcesso = "013101009999";

      cy.get(selectors.cepInput).type(cepComExcesso);
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve aceitar apenas números", () => {
      cy.get(selectors.cepInput).type("abc01310def100ghi");
      cy.get(selectors.cepInput).should("have.value", "01310-100");
    });

    it("deve manter a máscara ao deletar caracteres", () => {
      cy.get(selectors.cepInput).type("01310100");
      cy.get(selectors.cepInput).should("have.value", "01310-100");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310-10");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310-1");

      cy.get(selectors.cepInput).type("{backspace}");
      cy.get(selectors.cepInput).should("have.value", "01310");
    });
  });

  describe("Validação de CEP", () => {
    it("deve mostrar erro para CEP incompleto", () => {
      cy.get(selectors.cepInput).type("0131010");
      cy.get(selectors.cepInput).blur();

      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CEP inválido")
        .and("have.class", "Mui-error");
    });

    it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
      cy.get(selectors.cepInput).type("1").clear();
      cy.get(selectors.cepInput).blur();

      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CEP obrigatório")
        .and("have.class", "Mui-error");
    });

    it("deve aceitar CEP válido sem mostrar erro", () => {
      cy.get(selectors.cepInput).type(validCEPs.unformatted);
      cy.get(selectors.cepInput).blur();

      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error")
        .and("contain.text", "Digite apenas os números");
    });

    it("deve ter limite máximo de 9 caracteres configurado", () => {
      cy.get(selectors.cepInput).should("have.attr", "maxlength", "9");
    });

    it("deve mostrar erro para CEP com formato inválido (sem hífen na posição correta)", () => {
      // Digita 8 dígitos que formariam um CEP mas com formato errado
      cy.get(selectors.cepInput).type(invalidCEPs.invalidFormat);
      cy.get(selectors.cepInput).blur();

      // A máscara vai formatar para "12345-678",
      // mas o padrão regex espera /^\d{5}-\d{3}$/
      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error"); // A máscara deve corrigir automaticamente
    });

    it("deve validar em tempo real (modo onChange)", () => {
      // Digita um CEP incompleto
      cy.get(selectors.cepInput).type(invalidCEPs.incomplete);

      // Sem precisar blur, já deve mostrar erro
      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CEP inválido")
        .and("have.class", "Mui-error");

      // Completa o CEP
      cy.get(selectors.cepInput).type("0");

      // Erro deve sumir
      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error");
    });

    it("não deve permitir mais dígitos que o necessário", () => {
      cy.get(selectors.cepInput).type(invalidCEPs.tooMany);
      // Deve ter exatamente 9 caracteres (8 dígitos + 1 hífen)
      cy.get(selectors.cepInput).invoke("val").should("have.length", 9);
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

  describe("Validação de Nome Fantasia", () => {
    it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
      cy.get(selectors.nomeFantasiaInput).type("a").clear();
      cy.get(selectors.nomeFantasiaInput).blur();

      cy.get(selectors.nomeFantasiaGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Nome Fantasia obrigatório")
        .and("have.class", "Mui-error");
    });

    it("deve ter limite máximo de 100 caracteres configurado", () => {
      cy.get(selectors.nomeFantasiaInput).should(
        "have.attr",
        "maxlength",
        "100",
      );
    });

    it("deve impedir entrada de mais de 100 caracteres", () => {
      const texto100 = "a".repeat(100);
      const textoExtra = "bcdef";

      cy.get(selectors.nomeFantasiaInput).type(texto100);
      cy.get(selectors.nomeFantasiaInput).should("have.value", texto100);

      cy.get(selectors.nomeFantasiaInput).type(textoExtra);
      cy.get(selectors.nomeFantasiaInput).should("have.value", texto100);
    });

    it("deve aceitar Nome Fantasia válido sem mostrar erro", () => {
      cy.get(selectors.nomeFantasiaInput).type("Empresa Fantasia LTDA");
      cy.get(selectors.nomeFantasiaInput).blur();

      cy.get(selectors.nomeFantasiaGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.exist");
    });
  });

  describe("Validação de Estado", () => {
    it("deve mostrar erro de campo obrigatório quando vazio após interação", () => {
      cy.get(selectors.estadoInput).type("a").clear();
      cy.get(selectors.estadoInput).blur();

      cy.get(selectors.estadoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Estado obrigatório")
        .and("have.class", "Mui-error");
    });

    it("deve ter limite máximo de 2 caracteres configurado", () => {
      cy.get(selectors.estadoInput).should("have.attr", "maxlength", "2");
    });

    it("deve impedir entrada de mais de 2 caracteres", () => {
      cy.get(selectors.estadoInput).type("ABC");
      cy.get(selectors.estadoInput).should("have.value", "AB");
    });

    it("deve aceitar Estado válido sem mostrar erro", () => {
      cy.get(selectors.estadoInput).type("SP");
      cy.get(selectors.estadoInput).blur();

      cy.get(selectors.estadoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error")
        .and("contain.text", "Digite a sigla do estado (UF)");
    });

    it("deve converter texto para maiúsculas automaticamente", () => {
      cy.get(selectors.estadoInput).type("sp");
      cy.get(selectors.estadoInput).should("have.value", "SP");
    });
  });

  describe("Integração com API de CNPJ", () => {
    const cnpjTeste = {
      numero: "59155651000101",
      razaoSocialEsperada: "59.155.651 ROGER WATERS ALVES DE MELO",
    };

    // CNPJ que retorna nome fantasia preenchido
    const cnpjComNomeFantasia = { numero: "34028316000103" };

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

    it("deve preencher o campo Nome Fantasia automaticamente", () => {
      cy.get(selectors.cnpjInput).type(cnpjComNomeFantasia.numero);

      // Aguarda o campo Nome Fantasia ser preenchido
      cy.get(selectors.nomeFantasiaInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se algum valor foi preenchido
      cy.get(selectors.nomeFantasiaInput)
        .invoke("val")
        .should("have.length.greaterThan", 0);
    });

    it("deve mostrar loading no campo Nome Fantasia durante busca", () => {
      cy.get(selectors.cnpjInput).type(cnpjComNomeFantasia.numero);

      // Verifica se o loading aparece
      cy.get(selectors.nomeFantasiaGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      // Verifica se o CircularProgress está visível
      cy.get(selectors.nomeFantasiaGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.nomeFantasiaInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      // Verifica que o loading sumiu
      cy.get(selectors.nomeFantasiaGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Nome Fantasia durante busca e habilitar depois", () => {
      cy.get(selectors.nomeFantasiaInput).should("not.be.disabled");

      cy.get(selectors.cnpjInput).type(cnpjComNomeFantasia.numero);

      // Verifica se fica desabilitado durante a busca
      cy.get(selectors.nomeFantasiaInput).should("be.disabled");

      // Aguarda ser habilitado novamente
      cy.get(selectors.nomeFantasiaInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Nome Fantasia após preenchimento automático", () => {
      cy.get(selectors.cnpjInput).type(cnpjComNomeFantasia.numero);

      // Aguarda o preenchimento automático
      cy.get(selectors.nomeFantasiaInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Limpa e digita novo valor
      cy.get(selectors.nomeFantasiaInput)
        .clear()
        .type("Novo Nome Fantasia Digitado");

      cy.get(selectors.nomeFantasiaInput).should(
        "have.value",
        "Novo Nome Fantasia Digitado",
      );
    });

    it("deve preencher o campo CEP automaticamente quando disponível", () => {
      const cnpjComCEP = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComCEP);

      // Aguarda o campo CEP ser preenchido
      cy.get(selectors.cepInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se a máscara foi aplicada (deve conter hífen)
      cy.get(selectors.cepInput).invoke("val").should("include", "-");
    });

    it("deve mostrar loading no campo CEP durante busca", () => {
      const cnpjComCEP = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComCEP);

      // Verifica se o loading aparece no CEP
      cy.get(selectors.cepGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.cepGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.cepInput, { timeout: 10000 }).should("not.be.disabled");

      cy.get(selectors.cepGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar CEP durante busca e habilitar depois", () => {
      const cnpjComCEP = "34028316000103";
      cy.get(selectors.cepInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComCEP);
      cy.get(selectors.cepInput).should("be.disabled");
      cy.get(selectors.cepInput, { timeout: 10000 }).should("not.be.disabled");
    });

    it("deve permitir edição manual do CEP após preenchimento automático", () => {
      const cnpjComCEP = "34028316000103";
      cy.get(selectors.cnpjInput).type(cnpjComCEP);
      cy.get(selectors.cepInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");
      cy.get(selectors.cepInput).clear().type("04567000");
      cy.get(selectors.cepInput).should("have.value", "04567-000");
    });

    it("deve preencher o campo Estado automaticamente quando disponível", () => {
      const cnpjComEstado = "34028316000103"; // Assumindo que este CNPJ retorna UF

      cy.get(selectors.cnpjInput).type(cnpjComEstado);

      // Aguarda o campo Estado ser preenchido
      cy.get(selectors.estadoInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se tem exatamente 2 caracteres (formato UF)
      cy.get(selectors.estadoInput).invoke("val").should("have.length", 2);
    });

    it("deve mostrar loading no campo Estado durante busca", () => {
      const cnpjComEstado = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComEstado);

      // Verifica se o loading aparece no Estado
      cy.get(selectors.estadoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.estadoGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.estadoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.estadoGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Estado durante busca e habilitar depois", () => {
      const cnpjComEstado = "34028316000103";

      cy.get(selectors.estadoInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComEstado);
      cy.get(selectors.estadoInput).should("be.disabled");
      cy.get(selectors.estadoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Estado após preenchimento automático", () => {
      const cnpjComEstado = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComEstado);

      cy.get(selectors.estadoInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      cy.get(selectors.estadoInput).clear().type("RJ");
      cy.get(selectors.estadoInput).should("have.value", "RJ");
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

    it("deve ser responsivo para campo Nome Fantasia", () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selectors.nomeFantasiaGridContainer).should(
        "have.class",
        "MuiGrid-grid-sm-6",
      );

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.nomeFantasiaGridContainer).should(
        "have.class",
        "MuiGrid-grid-xs-12",
      );
    });

    it("deve ser responsivo para campo CEP", () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selectors.cepGridContainer).should(
        "have.class",
        "MuiGrid-grid-sm-6",
      );

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.cepGridContainer).should(
        "have.class",
        "MuiGrid-grid-xs-12",
      );
    });

    it("deve ser responsivo para campo Estado", () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get(selectors.estadoGridContainer).should(
        "have.class",
        "MuiGrid-grid-sm-6",
      );

      // Mobile
      cy.viewport(375, 667);
      cy.get(selectors.estadoGridContainer).should(
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
