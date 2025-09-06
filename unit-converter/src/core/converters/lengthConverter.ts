import { LengthUnit } from "../types/units";

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

export class LengthConverter {
  static convert(
    value: number,
    fromUnit: LengthUnit,
    toUnit: LengthUnit,
  ): number {
    if (
      !(fromUnit in lengthConversionFactors) ||
      !(toUnit in lengthConversionFactors)
    ) {
      throw new Error("Invalid units");
    }

    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Value must be a number");
    }

    const valueInMeters = value * lengthConversionFactors[fromUnit];
    const convertedValue = valueInMeters / lengthConversionFactors[toUnit];

    return this.roundToDecimal(convertedValue, 6);
  }

  static getAvailableUnits(): LengthUnit[] {
    return Object.keys(lengthConversionFactors) as LengthUnit[];
  }

  private static roundToDecimal(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
