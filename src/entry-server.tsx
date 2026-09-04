/**
 * Server-entry voor het prerenderen. Wordt door scripts/prerender.mjs gebruikt
 * om elke route naar statische HTML te schrijven, zodat crawlers die geen
 * JavaScript uitvoeren toch de volledige pagina zien.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppContent } from "./App";

export { pages, notFoundPage, SITE_URL, OG_IMAGE } from "./seo/site";
export { siteJsonLd } from "./seo/jsonld";

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
}
