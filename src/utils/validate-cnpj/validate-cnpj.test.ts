import { describe, it, expect } from "vitest";
import { validateCNPJ } from ".";

describe("validateCNPJ", () => {
  describe("validação de tamanho", () => {
    it("deve retornar erro quando CNPJ tem menos de 14 dígitos", () => {
      expect(validateCNPJ("123")).toBe("O CNPJ deve ter 14 dígitos");
      expect(validateCNPJ("1234567890123")).toBe("O CNPJ deve ter 14 dígitos");
      expect(validateCNPJ("11.222.333/0001-8")).toBe(
        "O CNPJ deve ter 14 dígitos",
      );
    });

    it("deve retornar erro quando CNPJ tem mais de 14 dígitos", () => {
      expect(validateCNPJ("123456789012345")).toBe(
        "O CNPJ deve ter 14 dígitos",
      );
      expect(validateCNPJ("12345678901234567890")).toBe(
        "O CNPJ deve ter 14 dígitos",
      );
    });

    it("deve retornar erro para string vazia", () => {
      expect(validateCNPJ("")).toBe("O CNPJ deve ter 14 dígitos");
    });
  });

  describe("validação de dígitos repetidos", () => {
    it("deve retornar erro quando todos os dígitos são iguais", () => {
      expect(validateCNPJ("00000000000000")).toBe("CNPJ inválido");
      expect(validateCNPJ("11111111111111")).toBe("CNPJ inválido");
      expect(validateCNPJ("22222222222222")).toBe("CNPJ inválido");
      expect(validateCNPJ("33333333333333")).toBe("CNPJ inválido");
      expect(validateCNPJ("44444444444444")).toBe("CNPJ inválido");
      expect(validateCNPJ("55555555555555")).toBe("CNPJ inválido");
      expect(validateCNPJ("66666666666666")).toBe("CNPJ inválido");
      expect(validateCNPJ("77777777777777")).toBe("CNPJ inválido");
      expect(validateCNPJ("88888888888888")).toBe("CNPJ inválido");
      expect(validateCNPJ("99999999999999")).toBe("CNPJ inválido");
    });

    it("deve retornar erro para dígitos repetidos com formatação", () => {
      expect(validateCNPJ("11.111.111/1111-11")).toBe("CNPJ inválido");
      expect(validateCNPJ("00.000.000/0000-00")).toBe("CNPJ inválido");
    });
  });

  describe("validação de dígitos verificadores", () => {
    it("deve retornar erro quando o primeiro dígito verificador está incorreto", () => {
      // CNPJ com primeiro dígito verificador errado (deveria ser 8, não 7)
      expect(validateCNPJ("11222333000171")).toBe("CNPJ inválido");
      expect(validateCNPJ("11444777000151")).toBe("CNPJ inválido");
    });

    it("deve retornar erro quando o segundo dígito verificador está incorreto", () => {
      // CNPJ com segundo dígito verificador errado (deveria ser 1, não 2)
      expect(validateCNPJ("11222333000182")).toBe("CNPJ inválido");
      expect(validateCNPJ("11444777000162")).toBe("CNPJ inválido");
    });

    it("deve retornar erro quando ambos os dígitos verificadores estão incorretos", () => {
      expect(validateCNPJ("11222333000199")).toBe("CNPJ inválido");
      expect(validateCNPJ("11444777000100")).toBe("CNPJ inválido");
    });
  });

  describe("CNPJs válidos", () => {
    it("deve retornar true para CNPJs válidos conhecidos", () => {
      // CNPJs válidos reais para teste
      expect(validateCNPJ("11222333000181")).toBe(true);
      expect(validateCNPJ("11444777000161")).toBe(true);
      expect(validateCNPJ("82373077000171")).toBe(true);
      expect(validateCNPJ("06990590000123")).toBe(true);
      expect(validateCNPJ("00000000000191")).toBe(true);
    });

    it("deve retornar true para CNPJs válidos com formatação", () => {
      expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
      expect(validateCNPJ("11.444.777/0001-61")).toBe(true);
      expect(validateCNPJ("82.373.077/0001-71")).toBe(true);
      expect(validateCNPJ("06.990.590/0001-23")).toBe(true);
    });

    it("deve retornar true para CNPJs válidos com formatação parcial", () => {
      expect(validateCNPJ("11222333/0001-81")).toBe(true);
      expect(validateCNPJ("11.222.333/000181")).toBe(true);
      expect(validateCNPJ("11 222 333 0001 81")).toBe(true);
    });
  });

  describe("tratamento de formatação", () => {
    it("deve ignorar caracteres não numéricos na validação", () => {
      expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
      expect(validateCNPJ("11-222-333-0001-81")).toBe(true);
      expect(validateCNPJ("11 222 333 0001 81")).toBe(true);
      expect(validateCNPJ("(11)222.333/0001-81")).toBe(true);
    });

    it("deve validar corretamente com espaços em branco", () => {
      expect(validateCNPJ("  11222333000181  ")).toBe(true);
      expect(validateCNPJ("  11.222.333/0001-81  ")).toBe(true);
    });

    it("deve validar corretamente com caracteres especiais misturados", () => {
      expect(validateCNPJ("!11@222#333$0001%81")).toBe(true);
      expect(validateCNPJ("abc11def222ghi333jkl0001mno81")).toBe(true);
    });
  });

  describe("casos especiais", () => {
    it("deve validar CNPJ de matriz (terminado em 0001)", () => {
      expect(validateCNPJ("11222333000181")).toBe(true);
      expect(validateCNPJ("11444777000161")).toBe(true);
    });

    it("deve validar CNPJ de filial", () => {
      expect(validateCNPJ("11222333000262")).toBe(true);
      expect(validateCNPJ("11222333000343")).toBe(true);
      expect(validateCNPJ("11222333000424")).toBe(true);
    });

    it("deve retornar erro para entrada que não é string de números após limpeza", () => {
      expect(validateCNPJ("abcdefghijklmn")).toBe("O CNPJ deve ter 14 dígitos");
      expect(validateCNPJ("!@#$%^&*()")).toBe("O CNPJ deve ter 14 dígitos");
    });
  });
});
