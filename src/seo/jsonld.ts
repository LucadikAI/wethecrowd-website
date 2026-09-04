/**
 * De sitebrede structured data. Deze graph staat op elke pagina, zodat
 * zoekmachines en AI-assistenten op elk instappunt weten wie WE THE CROWD is.
 */
import { CONTACT, SITE_NAME, SITE_URL } from "./site";

const diensten = [
  {
    naam: "Eventmanagement en productie",
    omschrijving:
      "Van eerste briefing tot laatste afbouwmoment. Ideeën vertalen naar concrete draaiboeken, heldere briefings richting crew en leveranciers, en bewaking van planning, budget en kwaliteit.",
  },
  {
    naam: "Artiestenbegeleiding",
    omschrijving:
      "Vast aanspreekpunt voor artiest en management, van riders en hospitality tot repetities en showflow, in kleine settings en in grote zalen.",
  },
  {
    naam: "Stagemanagement",
    omschrijving:
      "Bewaken van de planning op de vloer, aansturen van crew en zorgen dat wissels, cues en technische momenten naadloos in elkaar overlopen.",
  },
  {
    naam: "Showcalling",
    omschrijving:
      "Totaaloverzicht tijdens de show. Cues geven aan licht, geluid, video en artiesten, zodat het programma volgens planning verloopt.",
  },
];

const organisatie = {
  "@type": ["LocalBusiness", "Organization"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.telefoon,
  identifier: {
    "@type": "PropertyValue",
    propertyID: "KVK",
    value: CONTACT.kvk,
  },
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/wtc-logo.png`,
    caption: SITE_NAME,
  },
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "WE THE CROWD is het eventbureau van Luca Dik in Amersfoort. Van creatieve conceptontwikkeling tot productie, artiestenbegeleiding, stagemanagement en showcalling.",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.straat,
    postalCode: CONTACT.postcode,
    addressLocality: CONTACT.plaats,
    addressCountry: CONTACT.land,
  },
  areaServed: { "@type": "Country", name: "Nederland" },
  founder: { "@id": `${SITE_URL}/#luca` },
  knowsAbout: [
    "Eventmanagement",
    "Evenementenproductie",
    "Artiestenbegeleiding",
    "Stagemanagement",
    "Showcalling",
    "Festivalproductie",
    "Corporate events",
    "Jubileumevenementen",
  ],
  sameAs: [
    CONTACT.linkedin,
    "https://jubileumevenement.nl",
    "https://oneticketleft.com",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Diensten van WE THE CROWD",
    itemListElement: diensten.map((dienst) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: dienst.naam,
        description: dienst.omschrijving,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Nederland" },
      },
    })),
  },
};

const luca = {
  "@type": "Person",
  "@id": `${SITE_URL}/#luca`,
  name: "Luca Dik",
  jobTitle: "Eventprofessional",
  url: `${SITE_URL}/over-luca`,
  email: CONTACT.email,
  telephone: CONTACT.telefoon,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  sameAs: [CONTACT.linkedin],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "nl-NL",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [organisatie, luca, website],
};
