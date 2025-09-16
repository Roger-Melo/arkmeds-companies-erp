import { describe, it, expect } from "vitest";
import { validateNumero } from ".";

describe("validateNumero", () => {
  describe("valores vazios (campo opcional)", () => {
    it("deve retornar true para string vazia", () => {
      expect(validateNumero("")).toBe(true);
    });

    it("deve retornar true para string com apenas espaços", () => {
      expect(validateNumero(" ")).toBe(true);
      expect(validateNumero("   ")).toBe(true);
      expect(validateNumero("\t")).toBe(true);
      expect(validateNumero("\n")).toBe(true);
    });

    it("deve rejeitar undefined convertido em string", () => {
      // String(undefined) retorna "undefined" que não é um número válido
      expect(validateNumero(String(undefined))).toBe(
        "Deve ser um número ou 'S/N'",
      );
    });
  });

  describe("validação de S/N", () => {
    it("deve aceitar S/N em maiúsculas", () => {
      expect(validateNumero("S/N")).toBe(true);
    });

    it("deve aceitar s/n em minúsculas", () => {
      expect(validateNumero("s/n")).toBe(true);
    });

    it("deve aceitar S/N com combinação de maiúsculas e minúsculas", () => {
      expect(validateNumero("s/N")).toBe(true);
      expect(validateNumero("S/n")).toBe(true);
    });

    it("não deve aceitar S/N com espaços", () => {
      expect(validateNumero("S / N")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero(" S/N")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("S/N ")).toBe("Deve ser um número ou 'S/N'");
    });

    it("não deve aceitar variações de S/N", () => {
      expect(validateNumero("SN")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("S-N")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("S\\N")).toBe("Deve ser um número ou 'S/N'");
    });
  });

  describe("números válidos", () => {
    it("deve aceitar zero", () => {
      expect(validateNumero("0")).toBe(true);
    });

    it("deve aceitar números inteiros positivos", () => {
      expect(validateNumero("1")).toBe(true);
      expect(validateNumero("10")).toBe(true);
      expect(validateNumero("100")).toBe(true);
      expect(validateNumero("999")).toBe(true);
      expect(validateNumero("1000")).toBe(true);
      expect(validateNumero("999999")).toBe(true);
    });

    it("deve aceitar números com zeros à esquerda", () => {
      expect(validateNumero("01")).toBe(true);
      expect(validateNumero("001")).toBe(true);
      expect(validateNumero("0001")).toBe(true);
      expect(validateNumero("00100")).toBe(true);
    });

    it("deve aceitar números muito grandes", () => {
      expect(validateNumero("9999999999")).toBe(true);
      expect(validateNumero("1234567890123456")).toBe(true);
    });
  });

  describe("números inválidos", () => {
    it("deve rejeitar números negativos", () => {
      expect(validateNumero("-1")).toBe("Não pode ser negativo");
      expect(validateNumero("-10")).toBe("Não pode ser negativo");
      expect(validateNumero("-100")).toBe("Não pode ser negativo");
      expect(validateNumero("-999")).toBe("Não pode ser negativo");
      expect(validateNumero("-0.1")).toBe("Não pode ser negativo");
    });

    it("deve rejeitar números decimais positivos", () => {
      expect(validateNumero("1.1")).toBe("Não pode ser decimal");
      expect(validateNumero("1.5")).toBe("Não pode ser decimal");
      expect(validateNumero("10.01")).toBe("Não pode ser decimal");
      expect(validateNumero("99.99")).toBe("Não pode ser decimal");
      expect(validateNumero("0.1")).toBe("Não pode ser decimal");
      expect(validateNumero("0.001")).toBe("Não pode ser decimal");
    });

    it("deve rejeitar números decimais com vírgula", () => {
      expect(validateNumero("1,1")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("10,5")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("99,99")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve aceitar números em notação científica quando resultam em inteiros", () => {
      expect(validateNumero("1e2")).toBe(true); // 100 - válido
      expect(validateNumero("1e-2")).toBe("Não pode ser decimal"); // 0.01
      expect(validateNumero("1.5e2")).toBe(true); // 150 - Number(1.5e2) = 150 (inteiro)
    });
  });

  describe("valores não numéricos", () => {
    it("deve rejeitar texto aleatório", () => {
      expect(validateNumero("abc")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("teste")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("número")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve rejeitar caracteres especiais", () => {
      expect(validateNumero("!@#")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("$%^")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("&*()")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve rejeitar combinações de números e letras", () => {
      expect(validateNumero("123abc")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("abc123")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("1a2b3c")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve rejeitar valores booleanos como string", () => {
      expect(validateNumero("true")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("false")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve rejeitar null como string", () => {
      expect(validateNumero("null")).toBe("Deve ser um número ou 'S/N'");
    });
  });

  describe("casos especiais com espaços", () => {
    it("deve rejeitar números com espaços", () => {
      expect(validateNumero("1 000")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("1 2 3")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve aceitar números com espaços nas extremidades", () => {
      expect(validateNumero(" 123")).toBe(true);
      expect(validateNumero("123 ")).toBe(true);
      expect(validateNumero(" 123 ")).toBe(true);
    });
  });

  describe("valores especiais JavaScript", () => {
    it("deve tratar Infinity como não sendo inteiro", () => {
      // Number("Infinity") = Infinity, que não passa no Number.isInteger()
      expect(validateNumero("Infinity")).toBe("Não pode ser decimal");
      // Number("-Infinity") = -Infinity, que é negativo (verificado primeiro)
      expect(validateNumero("-Infinity")).toBe("Não pode ser negativo");
    });

    it("deve rejeitar NaN", () => {
      expect(validateNumero("NaN")).toBe("Deve ser um número ou 'S/N'");
    });
  });

  describe("formatos numéricos alternativos", () => {
    it("deve aceitar números hexadecimais pois Number() os converte", () => {
      // Number("0x10") = 16, que é um inteiro válido
      expect(validateNumero("0x10")).toBe(true);
      expect(validateNumero("0xFF")).toBe(true);
    });

    it("deve aceitar números octais pois Number() os converte", () => {
      // Number("0o10") = 8, que é um inteiro válido
      expect(validateNumero("0o10")).toBe(true);
      expect(validateNumero("0o77")).toBe(true);
    });

    it("deve aceitar números binários pois Number() os converte", () => {
      // Number("0b10") = 2, que é um inteiro válido
      expect(validateNumero("0b10")).toBe(true);
      expect(validateNumero("0b1111")).toBe(true);
    });
  });

  describe("casos extremos", () => {
    it("deve aceitar zero negativo como zero", () => {
      expect(validateNumero("-0")).toBe(true); // -0 === 0 em JavaScript
    });

    it("deve aceitar números no limite do JavaScript", () => {
      expect(validateNumero(String(Number.MAX_SAFE_INTEGER))).toBe(true);
      expect(validateNumero("9007199254740991")).toBe(true);
    });

    it("deve rejeitar números com sinais múltiplos", () => {
      expect(validateNumero("++1")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("--1")).toBe("Deve ser um número ou 'S/N'");
      expect(validateNumero("+-1")).toBe("Deve ser um número ou 'S/N'");
    });

    it("deve aceitar números com sinal de mais", () => {
      expect(validateNumero("+1")).toBe(true);
      expect(validateNumero("+100")).toBe(true);
      expect(validateNumero("+0")).toBe(true);
    });
  });
});
