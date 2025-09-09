import { ConverterFactory } from "../core/converters/converterFactory";

console.log("🏭 Testing Converter Factory...\n");

// Test 1: Conversiones a través del factory
console.log("🔄 PRUEBAS DE CONVERSIÓN:");
const conversionTests = [
  {
    value: 1,
    from: "meter",
    to: "foot",
    category: "length",
    expected: 3.28084,
  },
  {
    value: 1,
    from: "kilogram",
    to: "pound",
    category: "weight",
    expected: 2.20462,
  },
  {
    value: 0,
    from: "celsius",
    to: "fahrenheit",
    category: "temperature",
    expected: 32,
  },
];

conversionTests.forEach((test, index) => {
  try {
    const result = ConverterFactory.convert(
      test.value,
      test.from,
      test.to,
      test.category as any,
    );
    const passed = Math.abs(result - test.expected) < 0.01;
    console.log(
      `${passed ? "✅" : "❌"} Test ${index + 1}: ${test.value} ${test.from} → ${test.to} = ${result} ${passed ? "(OK)" : "(ERROR)"}`,
    );
  } catch (error) {
    console.log(`❌ Test ${index + 1} falló:`, error.message);
  }
});

// Test 2: Categorías disponibles
console.log("\n📋 CATEGORÍAS DISPONIBLES:");
try {
  const categories = ConverterFactory.getAvailableCategories();
  console.log(`✅ Categorías: ${categories.join(", ")}`);
  console.log(`   Total: ${categories.length} categorías`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 3: Detección automática de categoría
console.log("\n🔍 DETECCIÓN AUTOMÁTICA:");
const detectionTests = ["meter", "kilogram", "celsius", "invalidUnit"];
detectionTests.forEach((unit) => {
  try {
    const category = ConverterFactory.detectCategoryFromUnit(unit);
    console.log(`✅ "${unit}" → ${category || "No detectado"}`);
  } catch (error) {
    console.log(`❌ Detección falló para "${unit}":`, error.message);
  }
});

// Test 4: Información de todas las unidades
console.log("\n📊 INFORMACIÓN COMPLETA:");
try {
  const allInfo = ConverterFactory.getAllUnitsInfo();
  const totalUnits = Object.values(allInfo).reduce(
    (total, category) => total + Object.keys(category).length,
    0,
  );

  console.log(`✅ Total de unidades: ${totalUnits}`);
  Object.entries(allInfo).forEach(([category, units]) => {
    console.log(`   ${category}: ${Object.keys(units).length} unidades`);
  });
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 5: Manejo de errores
console.log("\n🚨 PRUEBAS DE ERROR:");
const errorTests = [
  { value: 1, from: "invalid", to: "meter", category: "length" },
  { value: 1, from: "meter", to: "invalid", category: "length" },
  { value: 1, from: "meter", to: "foot", category: "invalidCategory" },
];

errorTests.forEach((test, index) => {
  try {
    const result = ConverterFactory.convert(
      test.value,
      test.from,
      test.to,
      test.category as any,
    );
    console.log(`❌ Test error ${index + 1} debería haber fallado`);
  } catch (error) {
    console.log(`✅ Error manejado correctamente: ${error.message}`);
  }
});

console.log("\n🏭 Tests de factory completados!");
