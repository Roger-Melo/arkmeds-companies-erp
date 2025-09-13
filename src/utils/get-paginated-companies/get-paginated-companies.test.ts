import { describe, it, expect } from "vitest";
import { getPaginatedCompanies } from ".";
import { realData } from "./real-data";
import { Companies } from "@/types";

describe("getPaginatedCompanies", () => {
  // Dados de teste - cria um array mock com 25 empresas
  const getMockCompanies = (length: number = 25): Companies =>
    Array.from({ length }, (_, i) => ({
      id: `id-${i + 1}`,
      cnpj: `cnpj-${i + 1}`,
      estado: "SP",
      municipio: "São Paulo",
      nome_fantasia: `Empresa ${i + 1}`,
      razao_social: `Razão Social ${i + 1}`,
    }));

  describe("Paginação básica", () => {
    it("deve retornar os primeiros 10 itens na primeira página", () => {
      const result = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe("id-1");
      expect(result[result.length - 1].id).toBe("id-10");
    });

    it("deve retornar os itens 11-20 na segunda página", () => {
      const result = getPaginatedCompanies({
        currentPage: 2,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe("id-11");
      expect(result[result.length - 1].id).toBe("id-20");
    });

    it("deve retornar os itens restantes na última página", () => {
      const result = getPaginatedCompanies({
        currentPage: 3,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(5);
      expect(result[0].id).toBe("id-21");
      expect(result[result.length - 1].id).toBe("id-25");
    });
  });

  describe("Casos extremos", () => {
    it("deve retornar array vazio quando a página está além do limite", () => {
      const result = getPaginatedCompanies({
        currentPage: 4,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("deve funcionar com diferentes tamanhos de página", () => {
      const result = getPaginatedCompanies({
        currentPage: 2,
        perPage: 5,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(5);
      expect(result[0].id).toBe("id-6");
      expect(result[result.length - 1].id).toBe("id-10");
    });

    it("deve retornar array vazio quando recebe array vazio", () => {
      const result = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: [],
      });

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it("deve retornar todos os itens quando o array é menor que perPage", () => {
      const smallArray = getMockCompanies().slice(0, 3);
      const result = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: smallArray,
      });

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe("id-1");
      expect(result[2].id).toBe("id-3");
    });

    it("deve funcionar com perPage = 1", () => {
      const result = getPaginatedCompanies({
        currentPage: 5,
        perPage: 1,
        validatedCompanies: getMockCompanies(),
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("id-5");
    });
  });

  describe("Dados reais", () => {
    it("deve paginar corretamente com estrutura de dados real", () => {
      const resultPage1 = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: realData,
      });

      const resultPage2 = getPaginatedCompanies({
        currentPage: 2,
        perPage: 10,
        validatedCompanies: realData,
      });

      expect(resultPage1).toHaveLength(10);
      expect(resultPage2).toHaveLength(2);
      expect(resultPage1[0].cnpj).toBe("11828067831111");
      expect(resultPage1[0].nome_fantasia).toBe("Fino Pão do Paulo");
      expect(resultPage2[1].cnpj).toBe("57379088356567");
      expect(resultPage2[1].nome_fantasia).toBe("Fresco Café da Maria");
    });
  });

  describe("Imutabilidade", () => {
    it("não deve modificar o array original", () => {
      const originalArray = [...getMockCompanies()];
      const originalLength = originalArray.length;
      const firstItemId = originalArray[0].id;

      getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: originalArray,
      });

      expect(originalArray).toHaveLength(originalLength);
      expect(originalArray[0].id).toBe(firstItemId);
      expect(originalArray).toEqual(getMockCompanies());
    });
  });

  describe("Validação de comportamento", () => {
    it("deve retornar um novo array a cada chamada", () => {
      const result1 = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      const result2 = getPaginatedCompanies({
        currentPage: 1,
        perPage: 10,
        validatedCompanies: getMockCompanies(),
      });

      expect(result1).not.toBe(result2); // Referências diferentes
      expect(result1).toEqual(result2); // Mas mesmo conteúdo
    });

    it("deve retornar resultados consistentes para os mesmos parâmetros", () => {
      const params = {
        currentPage: 2,
        perPage: 5,
        validatedCompanies: getMockCompanies(),
      };

      const result1 = getPaginatedCompanies(params);
      const result2 = getPaginatedCompanies(params);
      expect(result1).toEqual(result2);
    });
  });

  describe("Testes de performance", () => {
    it("deve lidar eficientemente com arrays grandes", () => {
      const largeArray = getMockCompanies(10000);
      const startTime = performance.now();
      const result = getPaginatedCompanies({
        currentPage: 500,
        perPage: 10,
        validatedCompanies: largeArray,
      });

      const endTime = performance.now();
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe("id-4991");
      expect(endTime - startTime).toBeLessThan(10); // Deve executar em menos de 10ms
    });
  });
});
