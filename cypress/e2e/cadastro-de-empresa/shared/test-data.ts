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
