import http from "node:http";
import { ConversionResult } from "./core/types/units";
import { LengthConverter } from "./core/converters/lengthConverter";

const convert = (
  value: number,
  fromUnit: string,
  toUnit: string,
): ConversionResult => {
  try {
    const convertedValue = LengthConverter.convert(
      value,
      fromUnit as any,
      toUnit as any,
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
    console.log(`❌ Error converting:`, error.message);
    throw error;
  }
};

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/convert_units") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const resultado = convert(datos.value, datos.fromUnit, datos.toUnit);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(resultado.convertedValue));
      } catch (error) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("No encontrado");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
