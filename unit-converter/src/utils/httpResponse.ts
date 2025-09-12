import { ServerResponse } from "node:http";

export class HttpResponse {
  private static readonly ALLOWED_ORIGIN = "*";
  private static readonly ALLOWED_METHODS = "GET, POST, OPTIONS";
  private static readonly ALLOWED_HEADERS = "Content-Type";

  public static send(
    response: ServerResponse,
    statusCode: number,
    data: any,
  ): void {
    this.setCorsHeaders(response);
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  }

  public static sendError(
    response: ServerResponse,
    statusCode: number,
    error: string,
    details?: any,
  ): void {
    this.send(response, statusCode, { error, ...(details && { details }) });
  }

  public static handleOptionsRequest(response: ServerResponse): void {
    this.setCorsHeaders(response);
    response.writeHead(204);
    response.end();
  }

  private static setCorsHeaders(response: ServerResponse): void {
    response.setHeader("Access-Control-Allow-Origin", this.ALLOWED_ORIGIN);
    response.setHeader("Access-Control-Allow-Methods", this.ALLOWED_METHODS);
    response.setHeader("Access-Control-Allow-Headers", this.ALLOWED_HEADERS);
  }

  public static async readRequestBody(request: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = "";

      request.on("data", (chunk: Buffer) => (body += chunk.toString()));
      request.on("end", () => resolve(body));
      request.on("error", reject);
    });
  }
}
