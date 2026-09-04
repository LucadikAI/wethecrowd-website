/**
 * Statische previewserver voor dist/.
 *
 * `vite preview` stuurt elke onbekende URL door naar index.html, waardoor je
 * op /jubileum de homepage te zien krijgt en de prerender dus niet echt kunt
 * controleren. Deze server doet wat Vercel doet: mappen serveren via hun
 * index.html, en voor een onbekende URL 404.html met een echte 404-status.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const distMap = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const poort = Number(process.env.PORT ?? 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

async function zoekBestand(pad) {
  try {
    const info = await stat(pad);
    if (info.isDirectory()) return zoekBestand(join(pad, "index.html"));
    return pad;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const pad = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  // normalize() haalt ../ eruit, zodat niemand buiten dist kan lezen.
  const doel = join(distMap, normalize(pad).replace(/^(\.\.[/\\])+/, ""));

  const bestand = (await zoekBestand(doel)) ?? null;

  if (bestand) {
    res.writeHead(200, { "content-type": types[extname(bestand)] ?? "application/octet-stream" });
    createReadStream(bestand).pipe(res);
    return;
  }

  const pagina404 = await zoekBestand(join(distMap, "404.html"));
  res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
  if (pagina404) createReadStream(pagina404).pipe(res);
  else res.end("404");
});

server.listen(poort, () => {
  console.log(`Preview van dist/ draait op http://localhost:${poort}`);
});
