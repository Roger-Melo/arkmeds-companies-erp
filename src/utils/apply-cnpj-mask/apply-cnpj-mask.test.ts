import { describe, it, expect } from "vitest";
import { applyCNPJMask } from ".";

describe("applyCNPJMask", () => {
  it("deve retornar string vazia quando receber string vazia", () => {
    expect(applyCNPJMask("")).toBe("");
  });

  it("deve retornar apenas números quando houver menos de 3 dígitos", () => {
    expect(applyCNPJMask("1")).toBe("1");
    expect(applyCNPJMask("12")).toBe("12");
  });

  it("deve adicionar primeiro ponto após 2 dígitos", () => {
    expect(applyCNPJMask("123")).toBe("12.3");
    expect(applyCNPJMask("12345")).toBe("12.345");
  });

  it("deve adicionar segundo ponto após 5 dígitos", () => {
    expect(applyCNPJMask("123456")).toBe("12.345.6");
    expect(applyCNPJMask("12345678")).toBe("12.345.678");
  });

  it("deve adicionar barra após 8 dígitos", () => {
    expect(applyCNPJMask("123456789")).toBe("12.345.678/9");
    expect(applyCNPJMask("123456789012")).toBe("12.345.678/9012");
  });

  it("deve adicionar hífen após 12 dígitos", () => {
    expect(applyCNPJMask("1234567890123")).toBe("12.345.678/9012-3");
    expect(applyCNPJMask("12345678901234")).toBe("12.345.678/9012-34");
  });

  it("deve formatar CNPJ completo corretamente", () => {
    expect(applyCNPJMask("11222333000181")).toBe("11.222.333/0001-81");
    expect(applyCNPJMask("11444777000161")).toBe("11.444.777/0001-61");
  });

  it("deve remover caracteres não numéricos da entrada", () => {
    expect(applyCNPJMask("12.345.678/9012-34")).toBe("12.345.678/9012-34");
    expect(applyCNPJMask("abc123def456")).toBe("12.345.6");
    expect(applyCNPJMask("!@#11$%^222&*(333)0001-81")).toBe(
      "11.222.333/0001-81",
    );
  });

  it("deve limitar a entrada a 14 dígitos", () => {
    expect(applyCNPJMask("123456789012345678")).toBe("12.345.678/9012-34");
    expect(applyCNPJMask("999999999999999999999")).toBe("99.999.999/9999-99");
  });

  it("deve lidar com entrada já formatada", () => {
    expect(applyCNPJMask("11.222.333/0001-81")).toBe("11.222.333/0001-81");
    expect(applyCNPJMask("11.222.333")).toBe("11.222.333");
  });

  it("deve aplicar máscara progressivamente durante digitação", () => {
    // Simulando digitação caractere por caractere
    expect(applyCNPJMask("1")).toBe("1");
    expect(applyCNPJMask("11")).toBe("11");
    expect(applyCNPJMask("112")).toBe("11.2");
    expect(applyCNPJMask("1122")).toBe("11.22");
    expect(applyCNPJMask("11222")).toBe("11.222");
    expect(applyCNPJMask("112223")).toBe("11.222.3");
    expect(applyCNPJMask("1122233")).toBe("11.222.33");
    expect(applyCNPJMask("11222333")).toBe("11.222.333");
    expect(applyCNPJMask("112223330")).toBe("11.222.333/0");
    expect(applyCNPJMask("1122233300")).toBe("11.222.333/00");
    expect(applyCNPJMask("11222333000")).toBe("11.222.333/000");
    expect(applyCNPJMask("112223330001")).toBe("11.222.333/0001");
    expect(applyCNPJMask("1122233300018")).toBe("11.222.333/0001-8");
    expect(applyCNPJMask("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("deve lidar com espaços em branco", () => {
    expect(applyCNPJMask("  11 222 333 0001 81  ")).toBe("11.222.333/0001-81");
    expect(applyCNPJMask("1 1 2 2 2")).toBe("11.222");
  });

  it("deve processar corretamente quando usuário cola CNPJ", () => {
    // Simulando colar CNPJ sem formatação
    expect(applyCNPJMask("11222333000181")).toBe("11.222.333/0001-81");

    // Simulando colar CNPJ com formatação parcial
    expect(applyCNPJMask("11222333/000181")).toBe("11.222.333/0001-81");

    // Simulando colar CNPJ com formatação completa
    expect(applyCNPJMask("11.222.333/0001-81")).toBe("11.222.333/0001-81");
  });
});
