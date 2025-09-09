import { TemperatureConverter } from "../core/converters/temperatureConverter";

console.log("🌡️ Testing Temperature Converter...\n");

// Tests básicos
const testCases = [
  { value: 0, from: "celsius", to: "fahrenheit", expected: 32 },
  { value: 100, from: "celsius", to: "fahrenheit", expected: 212 },
  { value: 32, from: "fahrenheit", to: "celsius", expected: 0 },
  { value: 212, from: "fahrenheit", to: "celsius", expected: 100 },
  { value: 0, from: "celsius", to: "kelvin", expected: 273.15 },
  { value: 273.15, from: "kelvin", to: "celsius", expected: 0 },
  { value: -40, from: "celsius", to: "fahrenheit", expected: -40 },
];

testCases.forEach((test, index) => {
  try {
    const result = TemperatureConverter.convert(
      test.value,
      test.from as any,
      test.to as any,
    );
    const passed = Math.abs(result - test.expected) < 0.01;
    console.log(
      `${passed ? "✅" : "❌"} Test ${index + 1}: ${test.value}° ${test.from} → ${test.to} = ${result}° (esperado: ${test.expected})`,
    );
  } catch (error) {
    console.log(`❌ Test ${index + 1} falló:`, error.message);
  }
});

// Test de unidades disponibles
try {
  const units = TemperatureConverter.getAvailableUnits();
  console.log(`\n✅ Unidades disponibles: ${units.join(", ")}`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test de información de unidades
try {
  const unitInfo = TemperatureConverter.getUnitInfo("celsius");
  console.log(`✅ Info Celsius: ${unitInfo.name} (${unitInfo.symbol})`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test de validación - Kelvin negativo
try {
  const result = TemperatureConverter.convert(-1, "kelvin", "celsius");
  console.log("❌ Debería haber fallado con Kelvin negativo");
} catch (error) {
  console.log(`✅ Correcto: ${error.message}`);
}

console.log("\n🌡️ Tests de temperatura completados!");
