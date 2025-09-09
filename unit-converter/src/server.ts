import http from "node:http";
import converter from "./main";
import { PORT } from "./config/const";
import { ConversionResult } from "./core/types/units";

const server = http.createServer((request, response) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);

  if (request.method === "POST" && request.url === "/convert_units") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log(data);
        const resultado: ConversionResult = converter(
          data.value,
          data.fromUnit,
          data.toUnit,
          data.unitOfMeasurement,
        );

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(resultado));
      } catch {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("No encontrado");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
