import { describe, it, expect } from "vitest";
import { formatCNPJ } from ".";

describe("formatCNPJ", () => {
  describe("quando recebe um CNPJ válido", () => {
    it("deve formatar CNPJ com 14 dígitos numéricos", () => {
      const cnpj = "12345678000190";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve formatar CNPJ que já possui formatação parcial", () => {
      const cnpj = "12.345.678000190";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve formatar CNPJ que já está totalmente formatado", () => {
      const cnpj = "12.345.678/0001-90";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve formatar CNPJ com caracteres especiais misturados", () => {
      const cnpj = "12-345.678/0001.90";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve formatar CNPJ com espaços", () => {
      const cnpj = "12 345 678 0001 90";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve formatar diferentes CNPJs válidos", () => {
      const casos = [
        { entrada: "11222333000181", esperado: "11.222.333/0001-81" },
        { entrada: "99999999999999", esperado: "99.999.999/9999-99" },
        { entrada: "00000000000000", esperado: "00.000.000/0000-00" },
      ];

      casos.forEach(({ entrada, esperado }) => {
        expect(formatCNPJ(entrada)).toBe(esperado);
      });
    });
  });

  describe("quando recebe um CNPJ inválido", () => {
    it("deve retornar o valor original se tiver menos de 14 dígitos", () => {
      const cnpj = "1234567890";
      const result = formatCNPJ(cnpj);
      expect(result).toBe(cnpj);
    });

    it("deve retornar o valor original se tiver mais de 14 dígitos", () => {
      const cnpj = "123456780001901234";
      const result = formatCNPJ(cnpj);
      expect(result).toBe(cnpj);
    });

    it("deve retornar o valor original se for uma string vazia", () => {
      const cnpj = "";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("");
    });

    it("deve retornar o valor original se contiver apenas letras", () => {
      const cnpj = "abcdefghijklmn";
      const result = formatCNPJ(cnpj);
      expect(result).toBe(cnpj);
    });

    it("deve retornar o valor original se tiver letras e números mas não formar 14 dígitos", () => {
      const cnpj = "abc123def456";
      const result = formatCNPJ(cnpj);
      expect(result).toBe(cnpj);
    });
  });

  describe("casos extremos", () => {
    it("deve lidar com CNPJ que tem exatamente 14 caracteres mas com letras", () => {
      const cnpj = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/9012-34");
    });

    it("deve lidar com caracteres unicode", () => {
      const cnpj = "1234567★8000190";
      const result = formatCNPJ(cnpj);
      expect(result).toBe("12.345.678/0001-90");
    });

    it("deve lidar com null convertido para string", () => {
      const cnpj = String(null);
      const result = formatCNPJ(cnpj);
      expect(result).toBe("null");
    });

    it("deve lidar com undefined convertido para string", () => {
      const cnpj = String(undefined);
      const result = formatCNPJ(cnpj);
      expect(result).toBe("undefined");
    });
  });

  describe("performance", () => {
    it("deve formatar múltiplos CNPJs rapidamente", () => {
      const cnpjs = Array(1000).fill("12345678000190");
      const inicio = performance.now();

      cnpjs.forEach((cnpj) => formatCNPJ(cnpj));

      const fim = performance.now();
      const tempo = fim - inicio;

      // Espera que 1000 formatações levem menos de 50ms
      expect(tempo).toBeLessThan(50);
    });
  });
});
