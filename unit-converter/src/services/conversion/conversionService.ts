import { ConversionResult, UnitCategory } from "../../core/types/units";
import { unitCategories, converter } from "../../main";

export class ConversionService {
  public getUnits(category: UnitCategory): string[] {
    try {
      return unitCategories(category);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `Error getting units for category ${category}:`,
        errorMessage,
      );
      throw new Error(`Invalid category: ${category}`);
    }
  }

  public convertUnits(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory,
  ): ConversionResult {
    try {
      const result = converter(value, fromUnit, toUnit, category);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error converting units:", errorMessage);
      throw new Error(`Failed to convert units: ${errorMessage}`);
    }
  }

  public validateConversionData(data: any): data is {
    value: number;
    fromUnit: string;
    toUnit: string;
    category: UnitCategory;
  } {
    return (
      data.value !== undefined &&
      data.fromUnit !== undefined &&
      data.toUnit !== undefined &&
      data.category !== undefined
    );
  }
}
