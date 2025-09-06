import { LengthConverter } from "../core/converters/lengthConverter";

// Tests básicos para el conversor de longitud
console.log("🧪 Testing Length Converter...\n");

// Test 1: Metro a Pie
try {
  const result1 = LengthConverter.convert(1, "meter", "foot");
  console.log(`✅ 1 metro = ${result1} pies (esperado: ~3.28084)`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 2: Kilómetro a Metro
try {
  const result2 = LengthConverter.convert(1, "kilometer", "meter");
  console.log(`✅ 1 kilómetro = ${result2} metros (esperado: 1000)`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 3: Pulgada a Centímetro
try {
  const result3 = LengthConverter.convert(1, "inch", "centimeter");
  console.log(`✅ 1 pulgada = ${result3} centímetros (esperado: ~2.54)`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 4: Unidades disponibles
try {
  const units = LengthConverter.getAvailableUnits();
  console.log(`✅ Unidades disponibles: ${units.join(", ")}`);
} catch (error) {
  console.log("❌ Error:", error.message);
}

// Test 5: Error - unidad inválida
try {
  const result5 = LengthConverter.convert(1, "invalid" as any, "meter");
  console.log("❌ Debería haber fallado con unidad inválida");
} catch (error) {
  console.log(`✅ Correctamente manejado: ${error.message}`);
}

console.log("\n🧪 Tests completados!");
