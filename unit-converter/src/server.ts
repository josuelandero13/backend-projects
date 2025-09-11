import http from "node:http";
import { PORT } from "./config/const";
import { UnitConverterController } from "./controllers/UnitConverterController";

const controller = new UnitConverterController();
const server = http.createServer((request, response) =>
  controller.handleRequest(request, response),
);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
