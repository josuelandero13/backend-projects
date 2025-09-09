import { TemperatureUnit, UnitInfo } from "../types/units";

export const temperatureUnitInfo: Record<TemperatureUnit, UnitInfo> = {
  celsius: { name: "Celsius", symbol: "°C", category: "temperature" },
  fahrenheit: { name: "Fahrenheit", symbol: "°F", category: "temperature" },
  kelvin: { name: "Kelvin", symbol: "K", category: "temperature" },
};

export class TemperatureConverter {
  static convert(
    value: number,
    fromUnit: TemperatureUnit,
    toUnit: TemperatureUnit,
  ): number {
    this.validateInput(value, fromUnit, toUnit);

    let valueInCelsius: number;

    switch (fromUnit) {
      case "celsius":
        valueInCelsius = value;
        break;
      case "fahrenheit":
        valueInCelsius = ((value - 32) * 5) / 9;
        break;
      case "kelvin":
        valueInCelsius = value - 273.15;
        break;
      default:
        throw new Error(`Source unit not supported: ${fromUnit}`);
    }

    let convertedValue: number;

    switch (toUnit) {
      case "celsius":
        convertedValue = valueInCelsius;
        break;
      case "fahrenheit":
        convertedValue = (valueInCelsius * 9) / 5 + 32;
        break;
      case "kelvin":
        convertedValue = valueInCelsius + 273.15;
        break;
      default:
        throw new Error(`Destination unit not supported: ${toUnit}`);
    }

    return this.roundToDecimal(convertedValue, 6);
  }

  static getAvailableUnits(): TemperatureUnit[] {
    return Object.keys(temperatureUnitInfo) as TemperatureUnit[];
  }

  static getUnitInfo(unit: TemperatureUnit): UnitInfo {
    if (!temperatureUnitInfo[unit]) {
      throw new Error(`Information not available for the unit: ${unit}`);
    }

    return temperatureUnitInfo[unit];
  }

  static getAllUnitsInfo(): Record<TemperatureUnit, UnitInfo> {
    return { ...temperatureUnitInfo };
  }

  private static validateInput(
    value: number,
    fromUnit: string,
    toUnit: string,
  ): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("The value must be a valid number");
    }

    if (!isFinite(value)) {
      throw new Error("The value must be a finite number");
    }

    if (fromUnit === "kelvin" && value < 0) {
      throw new Error("The temperature in Kelvin cannot be less than 0");
    }

    const availableUnits = this.getAvailableUnits();
    if (!availableUnits.includes(fromUnit as TemperatureUnit)) {
      throw new Error(
        `Source unit not supported: ${fromUnit}. Available units: ${availableUnits.join(", ")}`,
      );
    }

    if (!availableUnits.includes(toUnit as TemperatureUnit)) {
      throw new Error(
        `Destination unit not supported: ${toUnit}. Available units: ${availableUnits.join(", ")}`,
      );
    }
  }

  private static roundToDecimal(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
  }
}
