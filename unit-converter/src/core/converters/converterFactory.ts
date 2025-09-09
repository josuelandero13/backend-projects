import { LengthConverter } from "./lengthConverter";
import { WeightConverter } from "./weightConverter";
import { TemperatureConverter } from "./temperatureConverter";
import { UnitCategory, UnitInfo } from "../types/units";

export class ConverterFactory {
  private static converters = {
    length: LengthConverter,
    weight: WeightConverter,
    temperature: TemperatureConverter,
  };

  static getConverter(category: UnitCategory): any {
    if (!this.converters[category]) {
      throw new Error(`No converter available for the category: ${category}`);
    }

    return this.converters[category];
  }

  static convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory,
  ): number {
    try {
      const converter = this.getConverter(category);

      return converter.convert(value, fromUnit, toUnit);
    } catch (error: any) {
      throw new Error(`Error on convert ${category}: ${error.message}`);
    }
  }

  static getAvailableCategories(): UnitCategory[] {
    return Object.keys(this.converters) as UnitCategory[];
  }

  static getAvailableUnits(category: UnitCategory): string[] {
    try {
      const converter = this.getConverter(category);

      return converter.getAvailableUnits();
    } catch (error: any) {
      throw new Error(`Error getting available units: ${error.message}`);
    }
  }

  static getUnitInfo(unit: string, category: UnitCategory): UnitInfo {
    try {
      const converter = this.getConverter(category);

      return converter.getUnitInfo(unit as any);
    } catch (error: any) {
      throw new Error(`Error obteniendo información: ${error.message}`);
    }
  }

  static getAllUnitsInfo(): Record<UnitCategory, Record<string, UnitInfo>> {
    const allInfo: Record<UnitCategory, Record<string, UnitInfo>> = {} as any;

    this.getAvailableCategories().forEach((category) => {
      try {
        const converter = this.getConverter(category);

        allInfo[category] = converter.getAllUnitsInfo();
      } catch (error: any) {
        console.warn(`Error getting info for ${category}:`, error.message);
      }
    });

    return allInfo;
  }

  static detectCategoryFromUnit(unit: string): UnitCategory | null {
    const categories = this.getAvailableCategories();

    for (const category of categories) {
      const units = this.getAvailableUnits(category);
      if (units.includes(unit)) {
        return category;
      }
    }

    return null;
  }
}
