import { WeightUnit, UnitInfo } from "../types/units";

const weightConversionFactors: Record<WeightUnit, number> = {
  kilogram: 1,
  gram: 0.001,
  milligram: 0.000001,
  pound: 0.453592,
  ounce: 0.0283495,
};

export const weightUnitInfo: Record<WeightUnit, UnitInfo> = {
  kilogram: { name: "Kilogramo", symbol: "kg", category: "weight" },
  gram: { name: "Gramo", symbol: "g", category: "weight" },
  milligram: { name: "Miligramo", symbol: "mg", category: "weight" },
  pound: { name: "Libra", symbol: "lb", category: "weight" },
  ounce: { name: "Onza", symbol: "oz", category: "weight" },
};

export class WeightConverter {
  static convert(
    value: number,
    fromUnit: WeightUnit,
    toUnit: WeightUnit,
  ): number {
    this.validateInput(value, fromUnit, toUnit);

    // Convertir a kilogramos primero (unidad base)
    const valueInKilograms = value * weightConversionFactors[fromUnit];

    // Convertir de kilogramos a la unidad destino
    const convertedValue = valueInKilograms / weightConversionFactors[toUnit];

    return this.roundToDecimal(convertedValue, 6);
  }

  static getAvailableUnits(): WeightUnit[] {
    return Object.keys(weightConversionFactors) as WeightUnit[];
  }

  static getUnitInfo(unit: WeightUnit): UnitInfo {
    if (!weightUnitInfo[unit]) {
      throw new Error(`Información no disponible para la unidad: ${unit}`);
    }
    return weightUnitInfo[unit];
  }

  static getAllUnitsInfo(): Record<WeightUnit, UnitInfo> {
    return { ...weightUnitInfo };
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
    if (!availableUnits.includes(fromUnit as WeightUnit)) {
      throw new Error(
        `Unidad de origen no válida: ${fromUnit}. Unidades disponibles: ${availableUnits.join(", ")}`,
      );
    }

    if (!availableUnits.includes(toUnit as WeightUnit)) {
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
