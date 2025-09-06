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

export type VolumeUnit = "liter" | "milliliter" | "gallon" | "quart" | "pint";

export type AreaUnit =
  | "square-meter"
  | "square-kilometer"
  | "square-mile"
  | "square-foot"
  | "hectare"
  | "acre";

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
