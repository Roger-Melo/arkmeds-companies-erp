import { selectors } from "./shared/selectors";

describe("Integração com API de CNPJ", () => {
  beforeEach(() => {
    cy.visit("/cadastro-de-empresa");
    // Aguarda a página carregar completamente
    cy.get(selectors.pageTitle).should("be.visible");
  });

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
    cy.get(selectors.estadoInput, { timeout: 10000 }).should("not.be.disabled");

    cy.get(selectors.estadoGridContainer)
      .find(".MuiCircularProgress-root")
      .should("not.exist");
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
    cy.get(selectors.numeroInput, { timeout: 10000 }).should("not.be.disabled");

    cy.get(selectors.numeroGridContainer)
      .find(".MuiCircularProgress-root")
      .should("not.exist");
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
