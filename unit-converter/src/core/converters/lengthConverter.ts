import { LengthUnit, UnitInfo } from "../types/units";

const lengthConversionFactors: Record<LengthUnit, number> = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.34,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
};

export const lengthUnitInfo: Record<LengthUnit, UnitInfo> = {
  meter: { name: "Metro", symbol: "m", category: "length" },
  kilometer: { name: "Kilómetro", symbol: "km", category: "length" },
  centimeter: { name: "Centímetro", symbol: "cm", category: "length" },
  millimeter: { name: "Milímetro", symbol: "mm", category: "length" },
  mile: { name: "Milla", symbol: "mi", category: "length" },
  yard: { name: "Yarda", symbol: "yd", category: "length" },
  foot: { name: "Pie", symbol: "ft", category: "length" },
  inch: { name: "Pulgada", symbol: "in", category: "length" },
};

export class LengthConverter {
  static convert(
    value: number,
    fromUnit: LengthUnit,
    toUnit: LengthUnit,
  ): number {
    this.validateInput(value, fromUnit, toUnit);

    const valueInMeters = value * lengthConversionFactors[fromUnit];

    const convertedValue = valueInMeters / lengthConversionFactors[toUnit];

    return this.roundToDecimal(convertedValue, 6);
  }

  static getAvailableUnits(): LengthUnit[] {
    return Object.keys(lengthConversionFactors) as LengthUnit[];
  }

  static getUnitInfo(unit: LengthUnit): UnitInfo {
    if (!lengthUnitInfo[unit]) {
      throw new Error(`Información no disponible para la unidad: ${unit}`);
    }

    return lengthUnitInfo[unit];
  }

  static getAllUnitsInfo(): Record<LengthUnit, UnitInfo> {
    return { ...lengthUnitInfo };
  }

  private static validateInput(
    value: number,
    fromUnit: string,
    toUnit: string,
  ): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("El valor debe ser un número válido");
    }

    if (!isFinite(value)) {
      throw new Error("El valor debe ser un número finito");
    }

    const availableUnits = this.getAvailableUnits();
    if (!availableUnits.includes(fromUnit as LengthUnit)) {
      throw new Error(
        `Unidad de origen no válida: ${fromUnit}. Unidades disponibles: ${availableUnits.join(", ")}`,
      );
    }

    if (!availableUnits.includes(toUnit as LengthUnit)) {
      throw new Error(
        `Unidad de destino no válida: ${toUnit}. Unidades disponibles: ${availableUnits.join(", ")}`,
      );
    }
  }

  private static roundToDecimal(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
  }
}
