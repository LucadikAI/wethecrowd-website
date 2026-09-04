import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OG_IMAGE, SITE_URL, getPageMeta } from "./site";

/** Zet of maakt een <meta>-tag met een name-attribuut. */
function setMetaName(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/** Zet of maakt een <meta>-tag met een property-attribuut (Open Graph). */
function setMetaProperty(property: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Houdt de <head> gelijk aan de prerenderde HTML na een client-side navigatie.
 *
 * Crawlers lezen de statische HTML, dus deze hook is er voor bezoekers,
 * browsertabbladen, bookmarks en analytics. De waarden komen uit dezelfde
 * bron als het prerender-script, zodat ze niet uit elkaar kunnen lopen.
 */
export default function useDocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    const canonical = `${SITE_URL}${meta.path === "/" ? "" : meta.path}`;
    const afbeelding = `${SITE_URL}${meta.image ?? OG_IMAGE}`;

    document.title = meta.title;
    setMetaName("description", meta.description);
    setMetaProperty("og:title", meta.title);
    setMetaProperty("og:description", meta.description);
    setMetaProperty("og:url", canonical);
    setMetaProperty("og:image", afbeelding);
    setMetaName("twitter:title", meta.title);
    setMetaName("twitter:description", meta.description);
    setMetaName("twitter:image", afbeelding);

    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }, [pathname]);
}
