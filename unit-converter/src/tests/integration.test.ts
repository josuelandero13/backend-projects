import { LengthConverter } from "../core/converters/lengthConverter";
import { WeightConverter } from "../core/converters/weightConverter";

console.log("🧪🧪 Tests de Integración - Múltiples Convertidores\n");

// Tests de longitud
console.log("📏 PRUEBAS DE LONGITUD:");
const lengthTests = [
  { value: 1, from: "meter", to: "foot", expected: 3.28084 },
  { value: 1000, from: "meter", to: "kilometer", expected: 1 },
  { value: 12, from: "inch", to: "centimeter", expected: 30.48 },
];

lengthTests.forEach((test, index) => {
  try {
    const result = LengthConverter.convert(
      test.value,
      test.from as any,
      test.to as any,
    );
    const passed = Math.abs(result - test.expected) < 0.001;
    console.log(
      `${passed ? "✅" : "❌"} Test ${index + 1}: ${test.value} ${test.from} → ${test.to} = ${result} ${passed ? "(OK)" : "(ERROR)"}`,
    );
  } catch (error) {
    console.log(`❌ Test ${index + 1} falló:`, error.message);
  }
});

// Tests de peso
console.log("\n⚖️ PRUEBAS DE PESO:");
const weightTests = [
  { value: 1, from: "kilogram", to: "pound", expected: 2.20462 },
  { value: 1000, from: "gram", to: "kilogram", expected: 1 },
  { value: 1, from: "pound", to: "ounce", expected: 16 },
];

weightTests.forEach((test, index) => {
  try {
    const result = WeightConverter.convert(
      test.value,
      test.from as any,
      test.to as any,
    );
    const passed = Math.abs(result - test.expected) < 0.01;
    console.log(
      `${passed ? "✅" : "❌"} Test ${index + 1}: ${test.value} ${test.from} → ${test.to} = ${result} ${passed ? "(OK)" : "(ERROR)"}`,
    );
  } catch (error) {
    console.log(`❌ Test ${index + 1} falló:`, error.message);
  }
});

// Información de unidades
console.log("\n📋 INFORMACIÓN DE UNIDADES:");
try {
  const lengthUnits = LengthConverter.getAvailableUnits();
  const weightUnits = WeightConverter.getAvailableUnits();

  console.log(`📏 Unidades de longitud: ${lengthUnits.length} unidades`);
  console.log(`⚖️ Unidades de peso: ${weightUnits.length} unidades`);
  console.log(
    `🎯 Total de unidades implementadas: ${lengthUnits.length + weightUnits.length}`,
  );
} catch (error) {
  console.log("❌ Error obteniendo información:", error.message);
}

console.log("\n🎉 Tests de integración completados!");
