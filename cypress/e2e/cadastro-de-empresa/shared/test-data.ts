import { selectors } from "./selectors";

// CNPJs válidos para teste
export const validCNPJs = {
  formatted: "11.222.333/0001-81",
  unformatted: "11222333000181",
  realCompany: "34028316000103",
};

export const invalidCNPJs = {
  allSameDigits: "11111111111111",
  wrongCheckDigit: "11222333000180",
  incomplete: "112223330001",
  tooMany: "112223330001811",
};

export const validCEPs = {
  formatted: "01310-100",
  unformatted: "01310100",
  realCEP: "04567000",
};

export const invalidCEPs = {
  incomplete: "0131010",
  tooMany: "013101000",
  invalidFormat: "12345678",
};

export const cnpjTeste = {
  numero: "59155651000101",
  razaoSocialEsperada: "59.155.651 ROGER WATERS ALVES DE MELO",
};

// CNPJ que retorna nome fantasia preenchido
export const cnpjComNomeFantasia = { numero: "34028316000103" };
export const cnpjComComplemento = { numero: "59155651000101" };

export const formFields = [
  {
    name: "Nome Fantasia",
    selector: selectors.nomeFantasiaInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "non-empty",
  },
  {
    name: "Razão Social",
    selector: selectors.razaoSocialInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "non-empty",
  },
  {
    name: "CEP",
    selector: selectors.cepInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "have-hyphen",
  },
  {
    name: "Estado",
    selector: selectors.estadoInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "exact-length",
    expectedLength: 2,
  },
  {
    name: "Município",
    selector: selectors.municipioInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "non-empty",
  },
  {
    name: "Logradouro",
    selector: selectors.logradouroInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "non-empty",
  },
  {
    name: "Número",
    selector: selectors.numeroInput,
    cnpjToTest: cnpjComNomeFantasia.numero,
    expectedValueType: "non-empty",
  },
  {
    name: "Complemento",
    selector: selectors.complementoInput,
    cnpjToTest: cnpjComComplemento.numero,
    expectedValueType: "non-empty",
  },
];
