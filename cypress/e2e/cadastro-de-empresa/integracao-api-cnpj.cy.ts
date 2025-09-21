import { selectors } from "./shared/selectors";
import {
  formFields,
  cnpjTeste,
  cnpjComNomeFantasia,
  cnpjComComplemento,
} from "./shared/test-data";

describe("Integração com API de CNPJ", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

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

  describe("Preenchimento automático de campos", () => {
    formFields.forEach((field) => {
      it(`deve preencher o campo ${field.name} automaticamente quando disponível`, () => {
        // Preenche o campo de CNPJ
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);

        // Aguarda o campo em questão ser preenchido
        cy.get(field.selector, { timeout: 10000 })
          .should("not.have.value", "")
          .and("not.be.disabled");

        // Validação específica baseada no tipo de campo
        if (field.expectedValueType === "non-empty") {
          cy.get(field.selector)
            .invoke("val")
            .should("have.length.greaterThan", 0);
        } else if (field.expectedValueType === "have-hyphen") {
          cy.get(field.selector).invoke("val").should("include", "-");
        } else if (field.expectedValueType === "exact-length") {
          cy.get(field.selector)
            .invoke("val")
            .should("have.length", field.expectedLength);
        }
      });
    });
  });

  describe("Indicadores de loading", () => {
    formFields.forEach((field) => {
      it(`deve mostrar loading no campo ${field.name} durante busca`, () => {
        cy.get(selectors.cnpjInput).type(field.cnpjToTest);

        // Verifica loading text
        cy.get(field.containerSelector)
          .find(".MuiFormHelperText-root")
          .should("contain.text", "Buscando dados da empresa...");

        // Verifica spinner
        cy.get(field.containerSelector)
          .find(".MuiCircularProgress-root")
          .should("exist");

        // Aguarda loading terminar
        cy.get(field.selector, { timeout: 10000 }).should("not.be.disabled");

        // Verifica que loading sumiu
        cy.get(field.containerSelector)
          .find(".MuiCircularProgress-root")
          .should("not.exist");
      });
    });
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

  it("deve desabilitar Estado durante busca e habilitar depois", () => {
    const cnpjComEstado = "34028316000103";

    cy.get(selectors.estadoInput).should("not.be.disabled");
    cy.get(selectors.cnpjInput).type(cnpjComEstado);
    cy.get(selectors.estadoInput).should("be.disabled");
    cy.get(selectors.estadoInput, { timeout: 10000 }).should("not.be.disabled");
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

  it("deve desabilitar Número durante busca e habilitar depois", () => {
    const cnpjComNumero = "34028316000103";

    cy.get(selectors.numeroInput).should("not.be.disabled");
    cy.get(selectors.cnpjInput).type(cnpjComNumero);
    cy.get(selectors.numeroInput).should("be.disabled");
    cy.get(selectors.numeroInput, { timeout: 10000 }).should("not.be.disabled");
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

  it("deve desabilitar Complemento durante busca e habilitar depois", () => {
    cy.get(selectors.complementoInput).should("not.be.disabled");
    cy.get(selectors.cnpjInput).type(cnpjComComplemento.numero);
    cy.get(selectors.complementoInput).should("be.disabled");
    cy.get(selectors.complementoInput, { timeout: 10000 }).should(
      "not.be.disabled",
    );
  });

  it("deve permitir edição manual do Complemento após preenchimento automático", () => {
    cy.get(selectors.cnpjInput).type(cnpjComComplemento.numero);
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
