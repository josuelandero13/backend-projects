import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { ConversionResult, UnitCategory } from "../core/types/units";
import { converter, unitCategories } from "../main";

export class UnitConverterController {
  private static readonly ALLOWED_ORIGIN = "*";
  private static readonly ALLOWED_METHODS = "GET, POST, OPTIONS";
  private static readonly ALLOWED_HEADERS = "Content-Type";

  public async handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      if (!request.url) {
        this.sendResponse(response, 400, { error: "URL not available" });
        return;
      }

      if (request.method === "OPTIONS") {
        this.handleOptionsRequest(response);
        return;
      }

      const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
      const path = parsedUrl.pathname;

      console.log(
        `[${new Date().toISOString()}] ${request.method} ${request.url}`,
      );

      switch (true) {
        case request.method === "GET" && path === "/api/units":
          await this.handleGetUnits(parsedUrl, response);
          break;
        case request.method === "POST" && path === "/api/convert_units":
          await this.handleConvertUnits(request, response);
          break;
        default:
          this.sendResponse(response, 404, { error: "Route not found" });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      this.sendResponse(response, 500, {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private handleOptionsRequest(response: ServerResponse): void {
    this.setCorsHeaders(response);
    response.writeHead(204);
    response.end();
  }

  private async handleGetUnits(
    parsedUrl: URL,
    response: ServerResponse,
  ): Promise<void> {
    const category = parsedUrl.searchParams.get("category") as UnitCategory;

    if (!category) {
      this.sendResponse(response, 400, {
        error: "Parameter 'category' is required in the URL.",
      });
      return;
    }

    try {
      const units = unitCategories(category);
      this.sendResponse(response, 200, { units });
    } catch (error) {
      this.sendResponse(response, 400, {
        error: "Invalid category",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async handleConvertUnits(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const body = await this.readRequestBody(request);
      const data = JSON.parse(body);

      if (!this.isValidConversionData(data)) {
        this.sendResponse(response, 400, {
          error: "Conversion data incomplete",
        });
        return;
      }

      const result: ConversionResult = converter(
        data.value,
        data.fromUnit,
        data.toUnit,
        data.category,
      );

      this.sendResponse(response, 200, result);
    } catch (error) {
      this.sendResponse(response, 500, {
        error: "Error processing conversion",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private isValidConversionData(data: any): data is {
    value: number;
    fromUnit: string;
    toUnit: string;
    category: UnitCategory;
  } {
    return (
      data.value !== undefined &&
      data.fromUnit !== undefined &&
      data.toUnit !== undefined &&
      data.category !== undefined
    );
  }

  private readRequestBody(request: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = "";
      request.on("data", (chunk) => (body += chunk.toString()));
      request.on("end", () => resolve(body));
      request.on("error", reject);
    });
  }

  private setCorsHeaders(response: ServerResponse): void {
    response.setHeader(
      "Access-Control-Allow-Origin",
      UnitConverterController.ALLOWED_ORIGIN,
    );
    response.setHeader(
      "Access-Control-Allow-Methods",
      UnitConverterController.ALLOWED_METHODS,
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      UnitConverterController.ALLOWED_HEADERS,
    );
  }

  private sendResponse(
    response: ServerResponse,
    statusCode: number,
    data: Record<string, any>,
  ): void {
    this.setCorsHeaders(response);
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  }
}
