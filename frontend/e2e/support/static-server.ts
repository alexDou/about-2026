import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, join, normalize, resolve } from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".map": "application/json",
};

export type StaticServer = { url: string; close: () => Promise<void> };

/** Serves the Rspack production build (`dist/`) on a random port, with SPA fallback. */
export async function startStaticServer(dir = "dist"): Promise<StaticServer> {
  const root = resolve(dir);
  const server: Server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname));
    let file = join(root, path);
    if (!file.startsWith(root) || path.endsWith("/") || !extname(file))
      file = join(root, "index.html");
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () => new Promise((done) => server.close(() => done())),
  };
}
