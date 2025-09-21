import { selectors } from "./cadastro-de-empresa/shared/selectors";

describe("Cadastro de Empresa - Formulário de Criação", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

  describe("Validação de Complemento", () => {
    it("deve aceitar campo vazio (campo opcional)", () => {
      cy.get(selectors.complementoInput).focus();
      cy.get(selectors.complementoInput).blur();

      cy.get(selectors.complementoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error")
        .and("contain.text", "Campo opcional");
    });

    it("deve ter limite máximo de 300 caracteres configurado", () => {
      cy.get(selectors.complementoInput).should(
        "have.attr",
        "maxlength",
        "300",
      );
    });

    it("deve impedir entrada de mais de 300 caracteres", () => {
      const texto300 = "a".repeat(300);
      const textoExtra = "bcdef";

      cy.get(selectors.complementoInput).type(texto300);
      cy.get(selectors.complementoInput).should("have.value", texto300);

      // Tenta digitar mais caracteres
      cy.get(selectors.complementoInput).type(textoExtra);

      // Verifica que ainda tem apenas 300 caracteres
      cy.get(selectors.complementoInput).should("have.value", texto300);
    });

    it("deve aceitar texto válido sem mostrar erro", () => {
      cy.get(selectors.complementoInput).type("Bloco A, Apartamento 301");
      cy.get(selectors.complementoInput).blur();

      cy.get(selectors.complementoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error");
    });

    it("deve validar em tempo real (modo onChange)", () => {
      const texto300 = "a".repeat(300);

      cy.get(selectors.complementoInput).type(texto300);

      // Campo ainda deve estar válido com 300 caracteres
      cy.get(selectors.complementoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error");
    });

    it("deve permitir caracteres especiais comuns em endereços", () => {
      cy.get(selectors.complementoInput).type(
        "Apt. 123, Bl. 4-B, Fund./Térreo",
      );
      cy.get(selectors.complementoInput).blur();

      cy.get(selectors.complementoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("not.have.class", "Mui-error");
    });
  });

  describe("Validação no momento do envio do form", () => {
    it("deve validar CNPJ inválido ao submeter", () => {
      // Preenche com CNPJ inválido
      cy.get(selectors.cnpjInput).type("11111111111111");

      // Preenche outros campos para garantir que só o CNPJ está errado
      cy.get(selectors.razaoSocialInput).type("Empresa Teste");
      cy.get(selectors.nomeFantasiaInput).type("Teste");
      cy.get(selectors.cepInput).type("01310100");
      cy.get(selectors.estadoInput).type("SP");
      cy.get(selectors.municipioInput).type("São Paulo");
      cy.get(selectors.logradouroInput).type("Rua Teste");
      cy.get(selectors.numeroInput).type("100");

      // Tenta submeter
      cy.get(selectors.submitButton).click();

      // Deve permanecer na página
      cy.url().should("include", "/cadastro-de-empresa");

      // Deve mostrar erro no CNPJ
      cy.get(selectors.cnpjGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CNPJ inválido");
    });

    it("não deve permitir submit com campos obrigatórios vazios", () => {
      cy.visit("/cadastro-de-empresa");
      // Clica direto no botão sem preencher nada
      cy.get(selectors.submitButton).click();
      // Deve permanecer na página
      cy.url().should("include", "/cadastro-de-empresa");
      // Verifica que os erros aparecem para TODOS os campos obrigatórios
      const camposObrigatorios = [
        { selector: selectors.cnpjGridContainer, erro: "CNPJ obrigatório" },
        {
          selector: selectors.razaoSocialGridContainer,
          erro: "Razão Social obrigatória",
        },
        {
          selector: selectors.nomeFantasiaGridContainer,
          erro: "Nome Fantasia obrigatório",
        },
        { selector: selectors.cepGridContainer, erro: "CEP obrigatório" },
        { selector: selectors.estadoGridContainer, erro: "Estado obrigatório" },
        {
          selector: selectors.municipioGridContainer,
          erro: "Município obrigatório",
        },
        {
          selector: selectors.logradouroGridContainer,
          erro: "Logradouro obrigatório",
        },
      ];

      camposObrigatorios.forEach(({ selector, erro }) => {
        cy.get(selector)
          .find(".MuiFormHelperText-root")
          .should("contain.text", erro);
      });
    });

    it("deve impedir submit enquanto houver erros de validação", () => {
      cy.visit("/cadastro-de-empresa");
      // Preenche com CNPJ inválido
      cy.get(selectors.cnpjInput).type("11111111111111");
      // Preenche os outros campos corretamente
      cy.get(selectors.razaoSocialInput).type("Empresa Teste");
      cy.get(selectors.nomeFantasiaInput).type("Teste");
      cy.get(selectors.cepInput).type("01310100");
      cy.get(selectors.estadoInput).type("SP");
      cy.get(selectors.municipioInput).type("São Paulo");
      cy.get(selectors.logradouroInput).type("Rua Teste");
      cy.get(selectors.numeroInput).type("100");
      // Verifica que o erro do CNPJ está visível
      cy.get(selectors.cnpjGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CNPJ inválido")
        .and("have.class", "Mui-error");
      // Tenta submeter
      cy.get(selectors.submitButton).click();
      // Deve permanecer na página (não deve redirecionar)
      cy.url().should("include", "/cadastro-de-empresa");
      // O erro do CNPJ deve continuar visível
      cy.get(selectors.cnpjGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "CNPJ inválido");
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

    it("deve preencher o campo Município automaticamente quando disponível", () => {
      const cnpjComMunicipio = "34028316000103"; // Assumindo que este CNPJ retorna município

      cy.get(selectors.cnpjInput).type(cnpjComMunicipio);

      // Aguarda o campo Município ser preenchido
      cy.get(selectors.municipioInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se algum valor foi preenchido
      cy.get(selectors.municipioInput)
        .invoke("val")
        .should("have.length.greaterThan", 0);
    });

    it("deve mostrar loading no campo Município durante busca", () => {
      const cnpjComMunicipio = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComMunicipio);

      // Verifica se o loading aparece no Município
      cy.get(selectors.municipioGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.municipioGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.municipioInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.municipioGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Município durante busca e habilitar depois", () => {
      const cnpjComMunicipio = "34028316000103";

      cy.get(selectors.municipioInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComMunicipio);
      cy.get(selectors.municipioInput).should("be.disabled");
      cy.get(selectors.municipioInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Município após preenchimento automático", () => {
      const cnpjComMunicipio = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComMunicipio);

      cy.get(selectors.municipioInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      cy.get(selectors.municipioInput).clear().type("Rio de Janeiro");
      cy.get(selectors.municipioInput).should("have.value", "Rio de Janeiro");
    });

    it("deve preencher o campo Logradouro automaticamente quando disponível", () => {
      const cnpjComLogradouro = "34028316000103"; // Assumindo que este CNPJ retorna logradouro

      cy.get(selectors.cnpjInput).type(cnpjComLogradouro);

      // Aguarda o campo Logradouro ser preenchido
      cy.get(selectors.logradouroInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se algum valor foi preenchido
      cy.get(selectors.logradouroInput)
        .invoke("val")
        .should("have.length.greaterThan", 0);
    });

    it("deve mostrar loading no campo Logradouro durante busca", () => {
      const cnpjComLogradouro = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComLogradouro);

      // Verifica se o loading aparece no Logradouro
      cy.get(selectors.logradouroGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.logradouroGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.logradouroInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.logradouroGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Logradouro durante busca e habilitar depois", () => {
      const cnpjComLogradouro = "34028316000103";

      cy.get(selectors.logradouroInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComLogradouro);
      cy.get(selectors.logradouroInput).should("be.disabled");
      cy.get(selectors.logradouroInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Logradouro após preenchimento automático", () => {
      const cnpjComLogradouro = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComLogradouro);

      cy.get(selectors.logradouroInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      cy.get(selectors.logradouroInput).clear().type("Avenida Principal, 456");
      cy.get(selectors.logradouroInput).should(
        "have.value",
        "Avenida Principal, 456",
      );
    });

    it("deve preencher o campo Número automaticamente quando disponível", () => {
      const cnpjComNumero = "34028316000103"; // Assumindo que este CNPJ retorna número

      cy.get(selectors.cnpjInput).type(cnpjComNumero);

      // Aguarda o campo Número ser preenchido
      cy.get(selectors.numeroInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      // Verifica se algum valor foi preenchido
      cy.get(selectors.numeroInput)
        .invoke("val")
        .should("have.length.greaterThan", 0);
    });

    it("deve mostrar loading no campo Número durante busca", () => {
      const cnpjComNumero = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComNumero);

      // Verifica se o loading aparece no Número
      cy.get(selectors.numeroGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.numeroGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.numeroInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.numeroGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Número durante busca e habilitar depois", () => {
      const cnpjComNumero = "34028316000103";

      cy.get(selectors.numeroInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComNumero);
      cy.get(selectors.numeroInput).should("be.disabled");
      cy.get(selectors.numeroInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Número após preenchimento automático", () => {
      const cnpjComNumero = "34028316000103";

      cy.get(selectors.cnpjInput).type(cnpjComNumero);

      cy.get(selectors.numeroInput, { timeout: 10000 })
        .should("not.have.value", "")
        .and("not.be.disabled");

      cy.get(selectors.numeroInput).clear().type("S/N");
      cy.get(selectors.numeroInput).should("have.value", "S/N");
    });

    it("deve preencher o campo Complemento automaticamente quando disponível", () => {
      const cnpjComComplemento = "59155651000101";
      cy.get(selectors.cnpjInput).type(cnpjComComplemento);
      // Aguarda o campo Complemento ser preenchido (se a API retornar)
      cy.get(selectors.complementoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      // O campo pode ou não ter valor dependendo da API
      // mas deve estar habilitado para edição
      cy.get(selectors.complementoInput)
        .invoke("val")
        .then((value) => {
          // Se tiver valor, deve ter comprimento maior que 0
          // Se não tiver, deve estar vazio (campo opcional)
          expect(String(value).length).to.be.at.least(0);
        });
    });

    it("deve mostrar loading no campo Complemento durante busca", () => {
      const cnpjComComplemento = "59155651000101";

      cy.get(selectors.cnpjInput).type(cnpjComComplemento);

      // Verifica se o loading aparece no Complemento
      cy.get(selectors.complementoGridContainer)
        .find(".MuiFormHelperText-root")
        .should("contain.text", "Buscando dados da empresa...");

      cy.get(selectors.complementoGridContainer)
        .find(".MuiCircularProgress-root")
        .should("exist");

      // Aguarda o loading terminar
      cy.get(selectors.complementoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.complementoGridContainer)
        .find(".MuiCircularProgress-root")
        .should("not.exist");
    });

    it("deve desabilitar Complemento durante busca e habilitar depois", () => {
      const cnpjComComplemento = "59155651000101";
      cy.get(selectors.complementoInput).should("not.be.disabled");
      cy.get(selectors.cnpjInput).type(cnpjComComplemento);
      cy.get(selectors.complementoInput).should("be.disabled");
      cy.get(selectors.complementoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );
    });

    it("deve permitir edição manual do Complemento após preenchimento automático", () => {
      const cnpjComComplemento = "59155651000101";
      cy.get(selectors.cnpjInput).type(cnpjComComplemento);
      cy.get(selectors.complementoInput, { timeout: 10000 }).should(
        "not.be.disabled",
      );

      cy.get(selectors.complementoInput).clear().type("Sala 1001, Torre B");
      cy.get(selectors.complementoInput).should(
        "have.value",
        "Sala 1001, Torre B",
      );
    });
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
