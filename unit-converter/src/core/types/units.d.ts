export type LengthUnit =
  | "meter"
  | "kilometer"
  | "centimeter"
  | "millimeter"
  | "mile"
  | "yard"
  | "foot"
  | "inch";

export type WeightUnit = "kilogram" | "gram" | "milligram" | "pound" | "ounce";

export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin";

export type UnitCategory = "length" | "weight" | "temperature";

export interface ConversionInput {
  value: number;
  fromUnit: string;
  toUnit: string;
}

export interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  convertedValue: number;
  timestamp: Date;
}

export interface UnitInfo {
  name: string;
  symbol: string;
  category: UnitCategory;
}
