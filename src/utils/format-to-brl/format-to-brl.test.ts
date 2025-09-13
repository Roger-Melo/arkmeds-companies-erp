import { describe, it, expect } from "vitest";
import { formatToBRL } from ".";

describe("formatToBRL", () => {
  /*
    Helper para normalizar espaços para comparação. 
    Necessário por que Intl.NumberFormat usa um espaço não-separável 
    (non-breaking space, Unicode U+00A0) entre "R$" e o valor.
  */
  const normalizeSpaces = (str: string) => str.replace(/\s/g, " ");

  it("deve formatar valores inteiros corretamente", () => {
    expect(normalizeSpaces(formatToBRL(1000))).toBe("R$ 1.000,00");
    expect(normalizeSpaces(formatToBRL(50))).toBe("R$ 50,00");
    expect(normalizeSpaces(formatToBRL(1000000))).toBe("R$ 1.000.000,00");
  });

  it("deve formatar valores decimais corretamente", () => {
    expect(normalizeSpaces(formatToBRL(1234.56))).toBe("R$ 1.234,56");
    expect(normalizeSpaces(formatToBRL(99.99))).toBe("R$ 99,99");
    expect(normalizeSpaces(formatToBRL(0.5))).toBe("R$ 0,50");
  });

  it("deve arredondar valores com mais de 2 casas decimais", () => {
    expect(normalizeSpaces(formatToBRL(12489326.7605922))).toBe(
      "R$ 12.489.326,76",
    );
    expect(normalizeSpaces(formatToBRL(3548420.3493333))).toBe(
      "R$ 3.548.420,35",
    );
    expect(normalizeSpaces(formatToBRL(14227467.9818304))).toBe(
      "R$ 14.227.467,98",
    );
    expect(normalizeSpaces(formatToBRL(99.999))).toBe("R$ 100,00");
    expect(normalizeSpaces(formatToBRL(1.234))).toBe("R$ 1,23");
    expect(normalizeSpaces(formatToBRL(1.235))).toBe("R$ 1,24");
  });

  it("deve formatar valores grandes corretamente", () => {
    expect(normalizeSpaces(formatToBRL(16055168.7393411))).toBe(
      "R$ 16.055.168,74",
    );
    expect(normalizeSpaces(formatToBRL(16297414.3252773))).toBe(
      "R$ 16.297.414,33",
    );
    expect(normalizeSpaces(formatToBRL(27215169.7969464))).toBe(
      "R$ 27.215.169,80",
    );
    expect(normalizeSpaces(formatToBRL(24037423.9545582))).toBe(
      "R$ 24.037.423,95",
    );
  });

  it("deve formatar valores pequenos corretamente", () => {
    expect(normalizeSpaces(formatToBRL(0.01))).toBe("R$ 0,01");
    expect(normalizeSpaces(formatToBRL(0.1))).toBe("R$ 0,10");
    expect(normalizeSpaces(formatToBRL(0.99))).toBe("R$ 0,99");
  });

  it("deve formatar zero corretamente", () => {
    expect(normalizeSpaces(formatToBRL(0))).toBe("R$ 0,00");
    expect(normalizeSpaces(formatToBRL(0.0))).toBe("R$ 0,00");
  });

  it("deve formatar valores negativos corretamente", () => {
    expect(normalizeSpaces(formatToBRL(-100))).toBe("-R$ 100,00");
    expect(normalizeSpaces(formatToBRL(-1234.56))).toBe("-R$ 1.234,56");
    expect(normalizeSpaces(formatToBRL(-0.5))).toBe("-R$ 0,50");
  });

  it("deve lidar com edge cases numéricos", () => {
    expect(normalizeSpaces(formatToBRL(Number.MIN_SAFE_INTEGER))).toBe(
      "-R$ 9.007.199.254.740.991,00",
    );
    expect(normalizeSpaces(formatToBRL(Number.MAX_SAFE_INTEGER))).toBe(
      "R$ 9.007.199.254.740.991,00",
    );
  });

  it("deve lidar com valores especiais", () => {
    expect(normalizeSpaces(formatToBRL(Infinity))).toBe("R$ ∞");
    expect(normalizeSpaces(formatToBRL(-Infinity))).toBe("-R$ ∞");
    expect(normalizeSpaces(formatToBRL(NaN))).toBe("R$ NaN");
  });

  describe("testes com valores da API", () => {
    const apiValues = [
      { input: 12489326.7605922, expected: "R$ 12.489.326,76" },
      { input: 3548420.3493333, expected: "R$ 3.548.420,35" },
      { input: 14227467.9818304, expected: "R$ 14.227.467,98" },
      { input: 16055168.7393411, expected: "R$ 16.055.168,74" },
      { input: 16297414.3252773, expected: "R$ 16.297.414,33" },
      { input: 8825009.1992757, expected: "R$ 8.825.009,20" },
      { input: 27215169.7969464, expected: "R$ 27.215.169,80" },
      { input: 18120644.5611201, expected: "R$ 18.120.644,56" },
      { input: 15614573.223168, expected: "R$ 15.614.573,22" },
      { input: 24037423.9545582, expected: "R$ 24.037.423,95" },
    ];

    it.each(apiValues)(
      "deve formatar $input para $expected",
      ({ input, expected }) => {
        expect(normalizeSpaces(formatToBRL(input))).toBe(expected);
      },
    );
  });
});
