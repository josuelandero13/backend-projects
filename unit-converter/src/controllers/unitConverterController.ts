import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { join } from "path";
import { ConversionService } from "../services/conversion/conversionService";
import { StaticFileService } from "../services/static-files/staticFileService";
import { HttpResponse } from "../utils/httpResponse";

export class UnitConverterController {
  private conversionService: ConversionService;
  private staticFileService: StaticFileService;
  private publicDir: string;

  constructor() {
    this.conversionService = new ConversionService();
    this.publicDir = join(__dirname, "../../public");
    this.staticFileService = new StaticFileService(this.publicDir);
  }

  public async handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      if (!request.url) {
        HttpResponse.sendError(response, 400, "URL not available");
        return;
      }

      if (request.method === "OPTIONS") {
        HttpResponse.handleOptionsRequest(response);
        return;
      }

      const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
      const path = parsedUrl.pathname;

      console.log(
        `[${new Date().toISOString()}] ${request.method} ${request.url}`,
      );

      await this.routeRequest(request, response, parsedUrl, path);
    } catch (error) {
      console.error("Error processing request:", error);
      HttpResponse.sendError(
        response,
        500,
        "Internal server error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  private async routeRequest(
    request: IncomingMessage,
    response: ServerResponse,
    parsedUrl: URL,
    path: string,
  ): Promise<void> {
    if (this.isStaticFileRequest(request, path)) {
      const filePath = path === "/" ? "/index.html" : decodeURIComponent(path);
      this.staticFileService.serveFile(filePath, response);
      return;
    }

    // API routes
    switch (true) {
      case request.method === "GET" && path === "/api/units":
        await this.handleGetUnits(parsedUrl, response);
        break;

      case request.method === "POST" && path === "/api/convert_units":
        await this.handleConvertUnits(request, response);
        break;

      default:
        HttpResponse.sendError(response, 404, "Route not found");
    }
  }

  private isStaticFileRequest(
    request: IncomingMessage | null,
    path: string,
  ): boolean {
    if (!request || request.method !== "GET") return false;

    return (
      path === "/" ||
      path.startsWith("/css") ||
      path.startsWith("/js") ||
      path.startsWith("/images") ||
      path.endsWith(".ico")
    );
  }

  private async handleGetUnits(
    parsedUrl: URL,
    response: ServerResponse,
  ): Promise<void> {
    const category = parsedUrl.searchParams.get("category");

    if (!category) {
      HttpResponse.sendError(
        response,
        400,
        "Parameter 'category' is required in the URL.",
      );
      return;
    }

    try {
      const units = this.conversionService.getUnits(category as any);
      HttpResponse.send(response, 200, { units });
    } catch (error) {
      HttpResponse.sendError(
        response,
        400,
        "Invalid category",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  private async handleConvertUnits(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const body = await HttpResponse.readRequestBody(request);
      const data = JSON.parse(body);

      if (!this.conversionService.validateConversionData(data)) {
        HttpResponse.sendError(response, 400, "Conversion data incomplete");
        return;
      }

      const result = this.conversionService.convertUnits(
        data.value,
        data.fromUnit,
        data.toUnit,
        data.category,
      );

      HttpResponse.send(response, 200, result);
    } catch (error) {
      HttpResponse.sendError(
        response,
        500,
        "Error processing conversion",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
}
