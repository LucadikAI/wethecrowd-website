export interface Project {
  id: number;
  slug: string;
  title: string;
  role: string;
  client: string;
  impact: string;
  description: string;
  image: string;
  photoCredit?: string;
  gallery?: string[];
  galleryCredits?: (string | null)[];
  year: string;
  location: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "eo-jongerendag",
    title: "EO-Jongerendag",
    role: "Artiestenbegeleider- en boeker",
    client: "Oneticketleft",
    impact: "Het grootste feest van het jaar in Rotterdam Ahoy met artiesten als; Typhoon, Lecrae, Elevation Rhythm, Marc Floor, Rend Collective en Pjotr.",
    description: "Voor de EO-Jongerendag ben ik in het voortraject druk bezig met het ondersteunen van het boekingsproces van de artiesten. Dit houdt in dat ik, samen met een team, kijk naar de juiste invulling van de line-up op basis van optredens, doelgroep en de juiste mix. Daarnaast ben ik betrokken bij het contact met management en agencies. Tijdens de EO-Jongerendag ben ik met het team van Oneticketleft verantwoordelijk voor de internationale artiesten, van transport tot soundcheck en van show tot meet and greet.",
    image: "/eo-jongerdag.jpg",
    year: "2024-heden",
    location: "Rotterdam Ahoy",
    gallery: [
      "/eo-gallery-1.jpg",
      "/eo-gallery-2.jpg",
      "/eo-gallery-3.jpg"
    ]
  },
  {
    id: 2,
    slug: "discovereu-learning-cycle",
    title: "DiscoverEU Learning Cycle",
    role: "Producer",
    client: "Bureau Spruit / NJI",
    impact: "Tweejaarlijkse meet-ups, een knallende kick-off en een afterparty voor jongeren die met een Interrail-pas Europa induiken.",
    description: "Jaarlijks organiseren we meet-up's voor Europese jongeren die een interrail pas hebben gewonnen. Het doel is om een community-gevoel te creëren en reizigers te inspireren. Buiten de meet-up's is er ook elk jaar een kick-off en afterparty voor de Nederlandse reizigers. Ik ben verantwoordelijk voor de logistieke planning, afstemming met locaties en on-site coördinatie van deze evenementen.",
    image: "/discovereu.jpg",
    photoCredit: "Atacan Tutulmazay",
    year: "2024-heden",
    location: "Diverse locaties NL",
    gallery: [
      "/deu-gallery-1.jpg",
      "/deu-gallery-2.jpg",
      "/deu-gallery-3.jpg"
    ]
  },
  {
    id: 3,
    slug: "fairspace-doemeemet5d",
    title: "Fairspace #DoeMeeMet5D",
    role: "Eventmanager",
    client: "Fairspace",
    impact: "Een inspirerend slotevent van #DoeMeeMet5D, met als doel grensoverschrijdend en seksueel ongewenst gedrag te herkennen, bespreekbaar te maken en tegen te gaan.",
    description: "Voor de campagne #DoeMeeMet5D van Fairspace nam ik de organisatie van het afsluitende evenement op me. De campagne richt zich op het trainen van omstanders om in te grijpen bij straatintimidatie. Het programma bestond uit een mix van workshops, keynotes, een VR-ervaring en een borrel. Ook Regeringscommissaris Mariëtte Hamer sprak over het belang van optreden tegen grensoverschrijdend gedrag in het openbaar. Ik was verantwoordelijk voor de volledige productie, van drukwerk en locatiekeuze tot het draaiboek en de on-site uitvoering.",
    image: "/fairspace.jpg",
    year: "2025",
    location: "Microlab Rotterdam",
    gallery: [
      "/fairspace-gallery-1.jpg",
      "/fairspace-gallery-2.jpg",
      "/fairspace-gallery-3.jpg"
    ]
  },
  {
    id: 4,
    slug: "the-paper-kites-tourcoordinatie",
    title: "The Paper Kites — Tourtransport coördinator",
    role: "Tourtransport coördinator",
    client: "410 MGMT Co.",
    impact: "Volledige coördinatie van het transport voor de Australische indie-folk band The Paper Kites tijdens hun bezoek aan Amsterdam.",
    description: "Volledige coördinatie van het transport voor de Australische indie-folk band The Paper Kites tijdens hun bezoek aan Amsterdam.",
    image: "/paper-kites-cover.jpg",
    year: "2025",
    location: "Amsterdam",
    gallery: []
  },
  {
    id: 8,
    slug: "postnl-sinterklaasviering",
    title: "Post-NL Sinterklaasviering",
    role: "Eventmanager op locatie",
    client: "The Groundbreakers",
    impact: "Een groot en geslaagd kinderfeest voor PostNL in Assen, met twee shows op één dag.",
    description: "Voor The Groundbreakers was ik als eventmanager aanwezig in Assen. Ik zorgde dat de op- en afbouw strak verliep, dat de twee shows volgens planning werden gedraaid en dat hosts en techniek goed werden aangestuurd. Daarnaast deed ik de afstemming met de enige echte Sinterklaas, zodat alles achter de schermen soepel liep. Het resultaat was een groot en geslaagd kinderfeest.",
    image: "/postnl-sinterklaas.jpg",
    year: "2025",
    location: "Assen",
    gallery: []
  },
  {
    id: 9,
    slug: "oud-en-nieuw-utrecht",
    title: "Oud & Nieuw Utrecht",
    role: "Artiestenbegeleider",
    client: "The Groundbreakers",
    impact: "Begeleiding van sprekers en artiesten tijdens twee shows op Domplein Utrecht op oudjaarsdag.",
    description: "In opdracht van The Groundbreakers was ik op oudjaarsdag verantwoordelijk voor de begeleiding van sprekers en artiesten. Met twee shows op één dag was het een druk en gevarieerd programma, waarin ik onder andere Andries Tunru, World of Afro, Brassa, Motie van Wantrouwen, The Recipe en Tom Strik begeleidde.",
    image: "/oud-nieuw-utrecht.jpg",
    photoCredit: "Caitlin Sloot",
    year: "2025",
    location: "Domplein Utrecht",
    gallery: [
      "/oud-nieuw-gallery-1.jpg",
      "/oud-nieuw-gallery-2.jpg",
      "/oud-nieuw-gallery-3.jpg"
    ],
    galleryCredits: ["The Arrows", null, null]
  },
  {
    id: 10,
    slug: "theatertour-rauw",
    title: "Theatertour RAUW",
    role: "Showcaller",
    client: "Stichting Go and Tell",
    impact: "Showcalling tijdens zes theatervoorstellingen van David de Vos, auteur van het boek Rauw.",
    description: "Voor David de Vos, auteur van het veelbesproken boek Rauw, mocht ik als showcaller tijdens zes theatervoorstellingen de regie voeren. Ik stuurde licht, geluid en video aan en zorgde samen met het team voor een zo soepel mogelijke voorstelling. De show in Veenendaal werd bovendien live geregistreerd.",
    image: "/theatertour-rauw.jpg",
    year: "2024",
    location: "Almelo, Hoorn, Veenendaal, Drachten, Nunspeet & Hoogeveen",
    gallery: [
      "/rauw-gallery-1.jpg",
      "/rauw-gallery-2.jpg",
      "/rauw-gallery-3.jpg"
    ]
  },
  {
    id: 11,
    slug: "crown-events",
    title: "Crown Events",
    role: "Artiestenbegeleider & Stagemanager",
    client: "Oneticketleft",
    impact: "Artiestenbegeleiding en stagemanagement voor een event met meer dan 1600 bezoekers en zes acts.",
    description: "Crown Events is een evenement met meer dan 1600 bezoekers en een line-up van zes artiesten, bands en dansers. Als eindverantwoordelijke voor de artiestenbegeleiding heb ik ervoor gezorgd dat alles soepel verliep voor de optredende artiesten. Van soundchecks tot timings, en van technische checks tot het uiteindelijke stagemanagement.",
    image: "/crown-events.jpg",
    photoCredit: "Vineyard Pictures",
    year: "2025",
    location: "Hardinxveld",
    gallery: [
      "/crown-gallery-1.jpg",
      "/crown-gallery-2.jpg",
      "/crown-gallery-3.jpg"
    ],
    galleryCredits: ["Vineyard Pictures", null, "Vineyard Pictures"]
  },
  {
    id: 12,
    slug: "tot-heil-des-volks-kerst",
    title: "Tot Heil des Volks Kerst",
    role: "Uitvoerend Producer",
    client: "Tot Heil des Volks",
    impact: "Een mooie kerstviering in een volle Noorderkerk in Amsterdam.",
    description: "Als uitvoerend producer was ik verantwoordelijk voor een vlotte opbouw, de juiste zaalopstelling, het begeleiden van soundchecks en de afstemming met alle betrokken partijen, zoals techniek, sprekers en muzikanten. Dit alles leidde tot een mooie kerstviering in een volle Noorderkerk.",
    image: "/tot-heil-kerst.jpg",
    year: "2025",
    location: "Amsterdam",
    gallery: []
  }
];
