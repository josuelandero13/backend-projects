import { WeightConverter } from "../core/converters/weightConverter";

// Tests para el conversor de peso
console.log("🧪 Testing Weight Converter...\n");

// Test 1: Kilogramo a Libra
try {
  const result1 = WeightConverter.convert(1, "kilogram", "pound");
  console.log(`✅ 1 kilogramo = ${result1} libras (esperado: ~2.20462)`);
  console.log(
    `   Precisión: ${Math.abs(result1 - 2.20462) < 0.001 ? "✓ OK" : "✗ Fuera de rango"}`,
  );
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 2: Gramo a Kilogramo
try {
  const result2 = WeightConverter.convert(1000, "gram", "kilogram");
  console.log(`✅ 1000 gramos = ${result2} kilogramos (esperado: 1)`);
  console.log(`   Precisión: ${result2 === 1 ? "✓ OK" : "✗ Error"}`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 3: Libra a Onza
try {
  const result3 = WeightConverter.convert(1, "pound", "ounce");
  console.log(`✅ 1 libra = ${result3} onzas (esperado: ~16)`);
  console.log(
    `   Precisión: ${Math.abs(result3 - 16) < 0.1 ? "✓ OK" : "✗ Fuera de rango"}`,
  );
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 4: Información de unidades
try {
  const unitInfo = WeightConverter.getUnitInfo("kilogram");
  console.log(
    `✅ Información de kilogramo: ${unitInfo.name} (${unitInfo.symbol})`,
  );
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 5: Error - valor inválido
try {
  const result5 = WeightConverter.convert(NaN, "kilogram", "pound");
  console.log("❌ Debería haber fallado con valor NaN");
} catch (error) {
  console.log(`✅ Correctamente manejado: ${error.message}`);
}

// Test 6: Error - unidad inválida
try {
  const result6 = WeightConverter.convert(1, "invalid" as any, "kilogram");
  console.log("❌ Debería haber fallado con unidad inválida");
} catch (error) {
  console.log(`✅ Correctamente manejado: ${error.message}`);
}

// Test 7: Unidades disponibles
try {
  const units = WeightConverter.getAvailableUnits();
  console.log(`✅ Unidades disponibles: ${units.join(", ")}`);
  console.log(`   Total: ${units.length} unidades`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

console.log("\n🧪 Tests de peso completados!");
