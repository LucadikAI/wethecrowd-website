/**
 * Prerendert elke route naar statische HTML.
 *
 * Draait na `vite build` (client) en `vite build --ssr` (server). Het resultaat
 * is dat /projecten/eo-jongerendag een echt bestand is met een eigen title,
 * description, canonical, Open Graph en JSON-LD, in plaats van een lege shell.
 * Crawlers die geen JavaScript uitvoeren, zoals GPTBot en ClaudeBot, zien
 * daarmee de volledige pagina.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const wortel = join(dirname(fileURLToPath(import.meta.url)), "..");
const distMap = join(wortel, "dist");

const {
  render,
  pages,
  notFoundPage,
  siteJsonLd,
  SITE_URL,
  OG_IMAGE,
} = await import(join(distMap, "..", "dist-ssr", "entry-server.js"));

/** Maakt tekst veilig voor gebruik in een HTML-attribuut. */
function esc(waarde) {
  return String(waarde)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Voorkomt dat </script> in JSON-LD de scripttag vroegtijdig sluit. */
function jsonLdVeilig(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * React 19 genereert automatisch een <link rel="preload"> voor elke afbeelding
 * die tijdens het renderen langskomt en zet die vooraan in de body. Op de
 * homepage zijn dat er 28, die dan allemaal tegelijk met hoge prioriteit
 * geladen worden en zo de LCP vertragen. We knippen ze weg en laten de browser
 * de afbeeldingen gewoon ontdekken tijdens het parsen.
 */
function stripReactPreloads(html) {
  return html.replace(/^(?:<link\b[^>]*>)+/, "");
}

function bouwHead(meta, { noindex = false } = {}) {
  const canonical = `${SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
  const afbeelding = `${SITE_URL}${meta.image ?? OG_IMAGE}`;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const tags = [
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="author" content="WE THE CROWD" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="WE THE CROWD" />`,
    `<meta property="og:locale" content="nl_NL" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(afbeelding)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(afbeelding)}" />`,
    `<script type="application/ld+json">${jsonLdVeilig(siteJsonLd)}</script>`,
  ];

  if (meta.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${jsonLdVeilig(meta.jsonLd)}</script>`
    );
  }

  return tags.join("\n    ");
}

/**
 * Zonder JavaScript blijven de intro-animaties van motion op opacity:0 staan.
 * Deze regel geldt alleen als er geen JavaScript draait, zodat er geen
 * hydration-mismatch ontstaat bij bezoekers die wel JavaScript hebben.
 */
const noscriptStijl = `<noscript><style>[style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>`;

async function schrijf(bestandspad, inhoud) {
  await mkdir(dirname(bestandspad), { recursive: true });
  await writeFile(bestandspad, inhoud, "utf8");
}

function paginaNaarBestand(pad) {
  return pad === "/" ? join(distMap, "index.html") : join(distMap, pad, "index.html");
}

async function main() {
  const sjabloon = await readFile(join(distMap, "index.html"), "utf8");

  if (!sjabloon.includes('<div id="root"></div>')) {
    throw new Error("dist/index.html bevat geen lege <div id=\"root\"></div>");
  }

  const teRenderen = [
    ...pages.map((meta) => ({ meta, bestand: paginaNaarBestand(meta.path), noindex: false })),
    { meta: notFoundPage, bestand: join(distMap, "404.html"), noindex: true },
  ];

  for (const { meta, bestand, noindex } of teRenderen) {
    const body = stripReactPreloads(render(meta.path));

    const html = sjabloon
      .replace(
        /<title>[^<]*<\/title>/,
        `<title>${esc(meta.title)}</title>\n    ${bouwHead(meta, { noindex })}`
      )
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace("</head>", `  ${noscriptStijl}\n  </head>`);

    await schrijf(bestand, html);
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((meta) => {
      const loc = `${SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
      const prioriteit = meta.path === "/" ? "1.0" : meta.path.startsWith("/projecten/") ? "0.7" : "0.8";
      return `  <url>\n    <loc>${esc(loc)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${prioriteit}</priority>\n  </url>`;
    }),
    "</urlset>",
    "",
  ].join("\n");

  await schrijf(join(distMap, "sitemap.xml"), sitemap);

  console.log(
    `Prerender klaar: ${teRenderen.length} HTML-bestanden en een sitemap met ${pages.length} URL's.`
  );
}

await main();
