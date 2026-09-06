/**
 * Eén bron van waarheid voor alles wat in de <head> terechtkomt.
 *
 * Zowel het prerender-script (scripts/prerender.mjs) als de client-side hook
 * (useDocumentMeta) lezen hieruit, zodat een statisch gegenereerde pagina en
 * dezelfde pagina na een client-side navigatie exact dezelfde titel,
 * beschrijving en canonical hebben.
 */
import { projects } from "../data/projects";

/** Canonieke host. wethecrowd.nl stuurt met een 307 door naar www. */
export const SITE_URL = "https://www.wethecrowd.nl";

export const SITE_NAME = "WE THE CROWD";

/** Standaard deelafbeelding, 1200x630. */
export const OG_IMAGE = "/og-image.jpg";

export const CONTACT = {
  email: "luca@wethecrowd.nl",
  /** E.164, zoals schema.org het wil. */
  telefoon: "+31646964338",
  /** Leesbare weergave voor in de interface. */
  telefoonWeergave: "+31 6 46 96 43 38",
  kvk: "92394469",
  straat: "Mozartweg 56h",
  postcode: "3816 LT",
  plaats: "Amersfoort",
  land: "NL",
  linkedin: "https://www.linkedin.com/in/luca-dik-78390b1b5/",
} as const;

export interface PageMeta {
  /** Pad zonder trailing slash, bijvoorbeeld "/projecten". */
  path: string;
  title: string;
  description: string;
  /** Afwijkende deelafbeelding, standaard OG_IMAGE. */
  image?: string;
  /** Extra JSON-LD naast de sitebrede graph. */
  jsonLd?: unknown;
}

/** De zes vaste routes. */
const staticPages: PageMeta[] = [
  {
    path: "/",
    title: "WE THE CROWD | Eventproductie en stagemanagement",
    // Precies de zin die ook op de homepage staat, zodat de omschrijving in de
    // zoekresultaten hetzelfde zegt als de pagina zelf.
    description:
      "WE THE CROWD vertaalt visie naar uitvoering. Van creatieve conceptontwikkeling tot strakke productie en stagemanagement.",
  },
  {
    path: "/over-luca",
    title: "Over Luca Dik | WE THE CROWD",
    description:
      "Luca Dik is de eventprofessional achter WE THE CROWD. Lees hoe hij van creatieve conceptontwikkeling tot uitvoering op de vloer werkt.",
    image: "/luca-portret.jpg",
  },
  {
    path: "/dit-doe-ik-graag",
    title: "WE THE CROWD - Events met impact",
    description:
      "Eventmanagement en productie, artiestenbegeleiding, stagemanagement en showcalling. Gerichte ondersteuning voor jullie evenement, van briefing tot afbouw.",
    image: "/dienst-eventmanagement.jpg",
  },
  {
    path: "/projecten",
    title: "Projecten | WE THE CROWD",
    description:
      "Een selectie van projecten waar creativiteit en uitvoering samenkwamen, van de EO-Jongerendag in Rotterdam Ahoy tot brand experiences voor The Groundbreakers.",
  },
  {
    path: "/jubileum",
    title: "Jubileum organiseren, samen met ONETICKETLEFT | WE THE CROWD",
    description:
      "Een jubileum organiseert WE THE CROWD niet alleen, maar samen met ONETICKETLEFT. Van intiem bedrijfsjubileum tot grootschalig festival.",
    image: "/jubileum-tim-en-luca.jpg",
  },
  {
    path: "/contact",
    title: "Contact | WE THE CROWD",
    description:
      "Nieuwe samenwerkingen, sparsessies of complexe productievraagstukken? Neem contact op met WE THE CROWD in Amersfoort. Reactie binnen 24 uur.",
  },
];

const SUFFIX = " | WE THE CROWD";

/** Maximale titellengte voordat Google hem in de resultaten afkapt. */
const MAX_TITEL = 65;

/**
 * Bouwt de titel van een projectpagina.
 *
 * Sommige projecttitels bevatten de rol al ("The Paper Kites: Tourtransport
 * coordinator"). Die plakken we er dan niet nog eens achter. De rol valt ook
 * weg zodra de titel daardoor over de 60 tekens gaat en in de zoekresultaten
 * zou worden afgekapt.
 */
function projectTitel(titel: string, rol: string): string {
  const schoon = titel.replace(/\s*[—–]\s*/g, ": ");
  const basis = schoon + SUFFIX;
  if (schoon.toLowerCase().includes(rol.toLowerCase())) return basis;

  const metRol = `${schoon}, ${rol.toLowerCase()}${SUFFIX}`;
  return metRol.length <= MAX_TITEL ? metRol : basis;
}

/** Knipt een omschrijving af op een woordgrens, voor de meta description. */
function inkorten(tekst: string, max = 158): string {
  const plat = tekst.replace(/\s+/g, " ").trim();
  if (plat.length <= max) return plat;
  const geknipt = plat.slice(0, max - 1);
  return geknipt.slice(0, geknipt.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

/** Eén detailpagina per project, afgeleid uit data/projects.ts. */
const projectPages: PageMeta[] = projects.map((project) => ({
  path: `/projecten/${project.slug}`,
  title: projectTitel(project.title, project.role),
  description: inkorten(project.impact),
  image: project.image,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: `${SITE_URL}/projecten/${project.slug}`,
    description: inkorten(project.impact, 300),
    image: `${SITE_URL}${project.image}`,
    inLanguage: "nl-NL",
    locationCreated: { "@type": "Place", name: project.location },
    author: { "@id": `${SITE_URL}/#organization` },
    about: project.role,
  },
}));

/** De 404-pagina wordt wel gegenereerd, maar staat niet in de sitemap. */
export const notFoundPage: PageMeta = {
  path: "/404",
  title: "Pagina niet gevonden | WE THE CROWD",
  description: "Deze pagina bestaat niet of is verplaatst.",
};

/** Alle pagina's die in de sitemap horen. */
export const pages: PageMeta[] = [...staticPages, ...projectPages];

export function getPageMeta(path: string): PageMeta {
  const genormaliseerd = path !== "/" ? path.replace(/\/+$/, "") : "/";
  return pages.find((page) => page.path === genormaliseerd) ?? notFoundPage;
}
