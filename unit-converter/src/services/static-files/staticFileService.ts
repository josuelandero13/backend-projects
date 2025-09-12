import { ServerResponse } from "node:http";
import { existsSync, statSync, readFile } from "fs";
import { extname, join, normalize } from "path";

type MimeTypes = Record<string, string>;

export class StaticFileService {
  private mimeTypes: MimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  constructor(private publicDir: string) {}

  public serveFile(filePath: string, response: ServerResponse): void {
    const safePath = this.getSafePath(filePath);
    const fullPath = join(this.publicDir, safePath);

    if (!this.fileExists(fullPath)) {
      this.sendNotFound(response);
      return;
    }

    this.readAndSendFile(fullPath, response);
  }

  private getSafePath(filePath: string): string {
    return normalize(filePath).replace(/^(?:\/|\\)?(\.\.(?:\/|\\))*/, "");
  }

  private fileExists(path: string): boolean {
    try {
      return existsSync(path) && !statSync(path).isDirectory();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Error checking if file exists at ${path}:`, errorMessage);
      return false;
    }
  }

  private getContentType(filePath: string): string {
    const ext = extname(filePath).toLowerCase();

    return this.mimeTypes[ext] || "application/octet-stream";
  }

  private readAndSendFile(filePath: string, response: ServerResponse): void {
    readFile(filePath, (error, data) => {
      if (error) {
        this.sendError(response);
        return;
      }

      const contentType = this.getContentType(filePath);

      response.writeHead(200, { "Content-Type": contentType });
      response.end(data);
    });
  }

  private sendNotFound(response: ServerResponse): void {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found");
  }

  private sendError(response: ServerResponse): void {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("500 Internal Server Error");
  }
}
