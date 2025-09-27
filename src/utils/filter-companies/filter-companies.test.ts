import { describe, it, expect } from "vitest";
import { filterCompanies } from ".";
import { mockCompanies } from "./data";
import { type Companies } from "@/types";

describe("filterCompanies", () => {
  describe("busca vazia ou com espaços", () => {
    it("deve retornar todas as empresas quando searchTerm é vazio", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "",
      });
      expect(result).toEqual(mockCompanies);
      expect(result).toHaveLength(5);
    });

    it("deve retornar todas as empresas quando searchTerm contém apenas espaços", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "   ",
      });
      expect(result).toEqual(mockCompanies);
      expect(result).toHaveLength(5);
    });

    it("deve retornar todas as empresas quando searchTerm tem tabs e quebras de linha", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "\t\n  ",
      });
      expect(result).toEqual(mockCompanies);
    });
  });

  describe("busca por nome fantasia", () => {
    it("deve encontrar empresa por nome fantasia completo", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "tech solutions",
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome_fantasia).toBe("Tech Solutions");
    });

    it("deve encontrar empresa por parte do nome fantasia", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "games",
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome_fantasia).toBe("Games & CIA");
    });

    it("deve ser case-insensitive na busca por nome fantasia", () => {
      const result1 = filterCompanies({
        companies: mockCompanies,
        searchTerm: "CAFÉ",
      });
      const result2 = filterCompanies({
        companies: mockCompanies,
        searchTerm: "café",
      });
      const result3 = filterCompanies({
        companies: mockCompanies,
        searchTerm: "CaFé",
      });

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toHaveLength(1);
      expect(result1[0].nome_fantasia).toBe("Café Premium");
    });

    it("deve encontrar múltiplas empresas quando o termo aparece em várias", () => {
      const companiesWithDuplicates: Companies = [
        ...mockCompanies,
        {
          id: "6",
          cnpj: "11223344000155",
          estado: "SP",
          municipio: "São Paulo",
          nome_fantasia: "Premium Services",
          razao_social: "Serviços Premium Ltda",
        },
      ];

      const result = filterCompanies({
        companies: companiesWithDuplicates,
        searchTerm: "premium",
      });
      expect(result).toHaveLength(2);
      expect(result.map((c) => c.nome_fantasia)).toContain("Café Premium");
      expect(result.map((c) => c.nome_fantasia)).toContain("Premium Services");
    });

    it("deve lidar com caracteres especiais no nome fantasia", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "& CIA",
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome_fantasia).toBe("Games & CIA");
    });
  });

  describe("busca por razão social", () => {
    it("deve encontrar empresa por razão social completa", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "tecnologia e soluções sa",
      });
      expect(result).toHaveLength(1);
      expect(result[0].razao_social).toBe("Tecnologia e Soluções SA");
    });

    it("deve encontrar empresa por parte da razão social", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "companhia",
      });
      expect(result).toHaveLength(1);
      expect(result[0].razao_social).toBe("Games e Companhia Ltda");
    });

    it("deve ser case-insensitive na busca por razão social", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "ALIMENTOS",
      });
      expect(result).toHaveLength(1);
      expect(result[0].razao_social).toBe("Alimentos Deliciosos Ltda");
    });

    it("deve encontrar empresas com 'Ltda' na razão social", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "ltda",
      });
      expect(result).toHaveLength(3);
      expect(
        result.every((c) => c.razao_social.toLowerCase().includes("ltda")),
      ).toBe(true);
    });
  });

  describe("busca por CNPJ", () => {
    it("deve encontrar empresa por CNPJ completo sem formatação", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11222333000181",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });

    it("deve encontrar empresa por CNPJ com formatação completa", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11.222.333/0001-81",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });

    it("deve encontrar empresa por CNPJ com formatação parcial", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11.222.333",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });

    it("deve encontrar empresa por parte do CNPJ (mínimo 6 dígitos)", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "112223",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });

    it("NÃO deve encontrar empresa com menos de 6 dígitos do CNPJ", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11222",
      });
      expect(result).toHaveLength(0);
    });

    it("deve encontrar múltiplas empresas quando parte do CNPJ aparece em várias", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "000190",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("12345678000190");
    });

    it("deve ignorar caracteres não numéricos ao buscar CNPJ", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "44-556.677/0001.99",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("44556677000199");
    });

    it("deve lidar com espaços no CNPJ", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11 222 333 0001 81",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });
  });

  describe("busca mista (texto e números)", () => {
    it("NÃO deve encontrar empresas quando buscar por texto com poucos números", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "xyz123",
      });
      expect(result).toHaveLength(0);
    });

    it("NÃO deve encontrar empresas quando buscar por texto que não existe", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "empresa inexistente",
      });
      expect(result).toHaveLength(0);
    });

    it("deve encontrar empresa quando o texto misturado contém 6+ dígitos", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "abc112223def",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("11222333000181");
    });

    it("deve encontrar empresa quando buscar por palavra que existe no nome", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "mega",
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome_fantasia).toBe("MEGA STORE");
    });
  });

  describe("casos extremos", () => {
    it("deve retornar array vazio quando não há empresas", () => {
      const result = filterCompanies({
        companies: [],
        searchTerm: "qualquer",
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("deve retornar array vazio quando buscar algo que não existe", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "inexistente",
      });
      expect(result).toEqual([]);
    });

    it("deve ignorar espaços extras no termo de busca", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "   games   ",
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome_fantasia).toBe("Games & CIA");
    });

    it("deve funcionar com termos de busca muito longos", () => {
      const longTerm = "tech solutions tecnologia soluções empresa rio janeiro";
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: longTerm,
      });
      expect(result).toHaveLength(0); // Não vai encontrar o termo completo
    });

    it("deve funcionar com arrays grandes de empresas", () => {
      const largeArray: Companies = Array.from({ length: 1000 }, (_, i) => ({
        id: `id-${i}`,
        cnpj: `1122233300${String(i).padStart(4, "0")}`,
        estado: "SP",
        municipio: "São Paulo",
        nome_fantasia:
          i % 2 === 0 ? `Empresa Tipo A ${i}` : `Empresa Tipo B ${i}`,
        razao_social: `Razão Social ${i}`,
      }));

      const startTime = performance.now();
      const result = filterCompanies({
        companies: largeArray,
        searchTerm: "tipo a",
      });
      const endTime = performance.now();

      expect(result).toHaveLength(500);
      expect(endTime - startTime).toBeLessThan(50); // Deve ser rápido
    });
  });

  describe("imutabilidade", () => {
    it("não deve modificar o array original", () => {
      const originalCompanies = [...mockCompanies];
      const originalLength = originalCompanies.length;

      filterCompanies({
        companies: originalCompanies,
        searchTerm: "games",
      });

      expect(originalCompanies).toHaveLength(originalLength);
      expect(originalCompanies).toEqual(mockCompanies);
    });

    it("deve retornar um novo array", () => {
      const result1 = filterCompanies({
        companies: mockCompanies,
        searchTerm: "games",
      });
      const result2 = filterCompanies({
        companies: mockCompanies,
        searchTerm: "games",
      });

      expect(result1).not.toBe(result2); // Referências diferentes
      expect(result1).toEqual(result2); // Mesmo conteúdo
    });
  });

  describe("combinação de critérios", () => {
    it("deve encontrar empresa quando termo aparece em nome OU razão social", () => {
      const companiesWithOverlap: Companies = [
        {
          id: "1",
          cnpj: "11111111000111",
          estado: "SP",
          municipio: "SP",
          nome_fantasia: "ABC Tech",
          razao_social: "XYZ Tecnologia Ltda",
        },
        {
          id: "2",
          cnpj: "22222222000122",
          estado: "RJ",
          municipio: "RJ",
          nome_fantasia: "XYZ Solutions",
          razao_social: "ABC Soluções SA",
        },
      ];

      const result = filterCompanies({
        companies: companiesWithOverlap,
        searchTerm: "xyz",
      });
      expect(result).toHaveLength(2);
    });

    it("não deve duplicar resultados quando termo aparece em múltiplos campos", () => {
      const companiesWithDuplicateTerms: Companies = [
        {
          id: "1",
          cnpj: "99999999000199",
          estado: "SP",
          municipio: "SP",
          nome_fantasia: "Premium Premium",
          razao_social: "Premium Services Premium Ltda",
        },
      ];

      const result = filterCompanies({
        companies: companiesWithDuplicateTerms,
        searchTerm: "premium",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("validação do limite mínimo de 6 dígitos para CNPJ", () => {
    it("deve buscar com exatamente 6 dígitos", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "112223",
      });
      expect(result).toHaveLength(1);
    });

    it("não deve buscar com 5 dígitos", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "11222",
      });
      expect(result).toHaveLength(0);
    });

    it("não deve buscar quando texto com números resulta em menos de 6 dígitos", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "abc12def34",
      });
      expect(result).toHaveLength(0);
    });

    it("deve buscar quando texto com números resulta em 6+ dígitos", () => {
      const result = filterCompanies({
        companies: mockCompanies,
        searchTerm: "abc123456def",
      });
      expect(result).toHaveLength(1);
      expect(result[0].cnpj).toBe("12345678000190");
    });
  });
});
