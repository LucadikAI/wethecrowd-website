export type Service = {
  /** Titel met soft hyphens (­) op de plekken waar hij mag afbreken. */
  title: string;
  image: string;
  description: string;
  /** Zet "· NIEUW" achter het nummer op de dienstenpagina. */
  isNew?: boolean;
};

/**
 * De vijf diensten, in de volgorde waarin ze op de site staan. `ServiceBlocks`
 * op /dit-doe-ik-graag toont ze voluit; `ServiceCards` op de homepage gebruikt
 * alleen de beschrijvingen, ingekort tot de eerste twee zinnen.
 */
export const services: Service[] = [
  {
    title: "Eventmanagement & productie",
    image: "/dienst-eventmanagement.jpg",
    description: "Van eerste briefing tot laatste afbouwmoment. Ik vertaal ideeën naar concrete draaiboeken, zorg voor heldere briefings richting crew en leveranciers en bewaak planning, budget en kwaliteit. Of het nu gaat om locatiecoördinatie, technische afstemming of overall productie-aansturing: ik zorg dat alle onderdelen samenkomen in één kloppend geheel."
  },
  {
    title: "Artiesten­begeleiding",
    image: "/dienst-artiestenbegeleiding.jpg",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote zalen, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Artiesten­boeking",
    image: "/dienst-artiesten.jpg",
    isNew: true,
    description: "Op zoek naar de juiste act voor je programma? Ik denk mee over de line-up, leg contact met management, onderhandel voorwaarden en regel het contract. Zo past de artiest bij je publiek én je budget."
  },
  {
    title: "Stage­management",
    image: "/dienst-stagemanagement.jpg",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    image: "/dienst-showcalling.jpg",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];
