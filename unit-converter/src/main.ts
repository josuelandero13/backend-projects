import { ConversionResult } from "./core/types/units";
import { ConverterFactory } from "./core/converters/converterFactory";
import { UnitCategory } from "./core/types/units";

export const unitCategories = (category: UnitCategory) => {
  return ConverterFactory.getAvailableUnits(category);
};

export const converter = (
  value: number,
  fromUnit: string,
  toUnit: string,
  unitOfMeasurement: UnitCategory,
): ConversionResult => {
  try {
    const convertedValue = ConverterFactory.convert(
      value,
      fromUnit,
      toUnit,
      unitOfMeasurement,
    );

    const result: ConversionResult = {
      value,
      fromUnit,
      toUnit,
      convertedValue,
      timestamp: new Date(),
    };

    return result;
  } catch (error) {
    console.error(`❌ Error converting:`, (error as Error).message);
    throw error;
  }
};
