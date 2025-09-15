import { describe, it, expect } from "vitest";
import { applyCEPMask } from ".";

describe("applyCEPMask", () => {
  it("deve retornar string vazia quando receber string vazia", () => {
    expect(applyCEPMask("")).toBe("");
  });

  it("deve retornar apenas números quando houver menos de 6 dígitos", () => {
    expect(applyCEPMask("1")).toBe("1");
    expect(applyCEPMask("12")).toBe("12");
    expect(applyCEPMask("123")).toBe("123");
    expect(applyCEPMask("1234")).toBe("1234");
    expect(applyCEPMask("12345")).toBe("12345");
  });

  it("deve adicionar hífen após 5 dígitos", () => {
    expect(applyCEPMask("123456")).toBe("12345-6");
    expect(applyCEPMask("1234567")).toBe("12345-67");
    expect(applyCEPMask("12345678")).toBe("12345-678");
  });

  it("deve formatar CEP completo corretamente", () => {
    expect(applyCEPMask("01310100")).toBe("01310-100");
    expect(applyCEPMask("12345678")).toBe("12345-678");
    expect(applyCEPMask("08090284")).toBe("08090-284");
  });

  it("deve remover caracteres não numéricos da entrada", () => {
    expect(applyCEPMask("12345-678")).toBe("12345-678");
    expect(applyCEPMask("abc123def45")).toBe("12345");
    expect(applyCEPMask("!@#12$%^345&*()-678")).toBe("12345-678");
  });

  it("deve limitar a entrada a 8 dígitos", () => {
    expect(applyCEPMask("123456789")).toBe("12345-678");
    expect(applyCEPMask("999999999999")).toBe("99999-999");
    expect(applyCEPMask("12345678901234")).toBe("12345-678");
  });

  it("deve lidar com entrada já formatada", () => {
    expect(applyCEPMask("12345-678")).toBe("12345-678");
    expect(applyCEPMask("01310-100")).toBe("01310-100");
  });

  it("deve aplicar máscara progressivamente durante digitação", () => {
    // Simulando digitação caractere por caractere
    expect(applyCEPMask("0")).toBe("0");
    expect(applyCEPMask("01")).toBe("01");
    expect(applyCEPMask("013")).toBe("013");
    expect(applyCEPMask("0131")).toBe("0131");
    expect(applyCEPMask("01310")).toBe("01310");
    expect(applyCEPMask("013101")).toBe("01310-1");
    expect(applyCEPMask("0131010")).toBe("01310-10");
    expect(applyCEPMask("01310100")).toBe("01310-100");
  });

  it("deve lidar com espaços em branco", () => {
    expect(applyCEPMask("  01310 100  ")).toBe("01310-100");
    expect(applyCEPMask("1 2 3 4 5 6 7 8")).toBe("12345-678");
  });

  it("deve processar corretamente quando usuário cola CEP", () => {
    // Simulando colar CEP sem formatação
    expect(applyCEPMask("01310100")).toBe("01310-100");

    // Simulando colar CEP com formatação
    expect(applyCEPMask("01310-100")).toBe("01310-100");

    // Simulando colar CEP com pontos (formato antigo)
    expect(applyCEPMask("01.310-100")).toBe("01310-100");
  });

  it("deve lidar com CEPs iniciados com zero", () => {
    expect(applyCEPMask("01000000")).toBe("01000-000");
    expect(applyCEPMask("00000000")).toBe("00000-000");
    expect(applyCEPMask("09999999")).toBe("09999-999");
  });

  it("deve remover letras e manter apenas números", () => {
    expect(applyCEPMask("CEP12345678")).toBe("12345-678");
    expect(applyCEPMask("12A34B56C78")).toBe("12345-678");
  });
});
