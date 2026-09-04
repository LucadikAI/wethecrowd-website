import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type Photo = { src: string; alt: string };

type Chapter = {
  /** Eerste deel van de zin, in zwart. */
  lead: string;
  /** Laatste woord, in het accentblauw. */
  accent: string;
  photos: [Photo, Photo, Photo];
};

const chapters: Chapter[] = [
  {
    lead: "Creatieve",
    accent: "oplossingen",
    photos: [
      { src: "/tgb-badeendjesbaai.jpg", alt: "Badeendjesbaai met een reusachtige gele badeend in Hoog Catharijne" },
      { src: "/veronica-cheersquad.jpg", alt: "Cheersquad van Veronica op het Jaarbeursplein in Utrecht" },
      { src: "/fairspace-gallery-1.jpg", alt: "Bezoeker met VR-bril tijdens Fairspace #DoeMeeMet5D" },
    ],
  },
  {
    lead: "Strakke",
    accent: "uitvoering",
    photos: [
      { src: "/dienst-stagemanagement.jpg", alt: "Podiumopbouw van bovenaf gezien tijdens de productie" },
      { src: "/nationale-viering-bevrijding.jpg", alt: "Crewlid met headset achter de schermen bij de Nationale Viering van de Bevrijding" },
      { src: "/dienst-showcalling.jpg", alt: "Showcalling vanaf de regieplek met laptop en lichttafel" },
    ],
  },
  {
    lead: "Blijvende",
    accent: "impact",
    photos: [
      { src: "/eo-jongerdag.jpg", alt: "Volle zaal met lichtjes tijdens de EO-Jongerendag" },
      { src: "/crown-events.jpg", alt: "Publiek met handen in de lucht bij Crown Events" },
      { src: "/luca-werk-6.jpg", alt: "Kerk in blauw en groen licht tijdens een avondvullend evenement" },
    ],
  },
];

/**
 * Plek, formaat en rotatie van de drie foto's. Ze overlappen bewust een
 * beetje, zodat het speels oogt. Mobiel staan ze meer onder elkaar.
 */
const photoSlots = [
  {
    className:
      "left-[4vw] top-[30svh] w-[58vw] aspect-[4/3] md:left-[5vw] md:top-[33svh] md:w-[34vw]",
    rotate: -6,
    z: "z-10",
  },
  {
    className:
      "left-[38vw] top-[44svh] w-[56vw] aspect-[3/4] md:left-[36vw] md:top-[26svh] md:w-[27vw]",
    rotate: 4,
    z: "z-30",
  },
  {
    className:
      "left-[10vw] top-[64svh] w-[60vw] aspect-[4/3] md:left-[60vw] md:top-[40svh] md:w-[34vw]",
    rotate: -3,
    z: "z-20",
  },
];

const CHAPTER_COUNT = chapters.length;

/** Zet een tijdstip binnen hoofdstuk `i` (0..1) om naar de globale scrollvoortgang. */
const at = (i: number, local: number) => (i + local) / CHAPTER_COUNT;

function ScenePhoto({
  photo,
  slot,
  chapterIndex,
  photoIndex,
  isLast,
  progress,
}: {
  photo: Photo;
  slot: (typeof photoSlots)[number];
  chapterIndex: number;
  photoIndex: number;
  isLast: boolean;
  progress: MotionValue<number>;
}) {
  const start = 0.26 + photoIndex * 0.09;
  const end = start + 0.14;
  const i = chapterIndex;
  const exitStart = isLast ? 2 : at(i, 0.86);
  const exitEnd = isLast ? 3 : at(i, 1);

  const opacity = useTransform(
    progress,
    [at(i, start), at(i, end), exitStart, exitEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [at(i, start), at(i, end), exitStart, exitEnd],
    [0.4, 1, 1, 1.12]
  );
  const y = useTransform(progress, [at(i, start), at(i, end)], ["45svh", "0svh"]);
  const rotate = useTransform(
    progress,
    [at(i, start), at(i, end)],
    [slot.rotate * 3, slot.rotate]
  );

  return (
    <motion.figure
      style={{ opacity, scale, y, rotate }}
      className={`absolute overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 shadow-2xl ${slot.className} ${slot.z}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </motion.figure>
  );
}

function Scene({
  chapter,
  index,
  progress,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
}) {
  const i = index;
  const isLast = index === CHAPTER_COUNT - 1;
  const exitStart = isLast ? 2 : at(i, 0.86);
  const exitEnd = isLast ? 3 : at(i, 1);

  // De zin schuift in marquee-formaat binnen, groeit uit tot groot, en
  // schuift daarna omhoog om ruimte te maken voor de foto's.
  const opacity = useTransform(
    progress,
    [at(i, 0), at(i, 0.12), exitStart, exitEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [at(i, 0), at(i, 0.22), at(i, 0.26), at(i, 0.36), exitStart, exitEnd],
    [0.45, 1, 1, 0.72, 0.72, 0.8]
  );
  const x = useTransform(progress, [at(i, 0), at(i, 0.22)], ["35vw", "0vw"]);
  const y = useTransform(
    progress,
    [at(i, 0.26), at(i, 0.36)],
    ["0svh", "-32svh"]
  );
  const counterOpacity = useTransform(
    progress,
    [at(i, 0.1), at(i, 0.2), exitStart, exitEnd],
    [0, 1, 1, 0]
  );

  return (
    <div className="absolute inset-0">
      <motion.p
        style={{ opacity, scale, x, y }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-bold uppercase leading-[0.9] tracking-tighter text-gray-900 text-[13vw] md:text-[7.5vw] md:whitespace-nowrap"
      >
        {chapter.lead} <span className="text-brand-accent">{chapter.accent}</span>
      </motion.p>

      {chapter.photos.map((photo, p) => (
        <ScenePhoto
          key={photo.src}
          photo={photo}
          slot={photoSlots[p]}
          chapterIndex={index}
          photoIndex={p}
          isLast={isLast}
          progress={progress}
        />
      ))}

      <motion.span
        style={{ opacity: counterOpacity }}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400"
      >
        {String(index + 1).padStart(2, "0")} / {String(CHAPTER_COUNT).padStart(2, "0")}
      </motion.span>
    </div>
  );
}

/** Rustige variant zonder pin voor wie minder beweging wil. */
function StaticStory() {
  return (
    <div className="container mx-auto px-6 py-24 space-y-24">
      {chapters.map((chapter) => (
        <div key={chapter.accent}>
          <p className="mb-8 text-center font-bold uppercase leading-[0.9] tracking-tighter text-gray-900 text-[12vw] md:text-[7vw]">
            {chapter.lead} <span className="text-brand-accent">{chapter.accent}</span>
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {chapter.photos.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Vastgepind scrollverhaal onder de hero. De pagina blijft staan terwijl je
 * scrolt; de drie kernzinnen groeien één voor één uit tot groot, met telkens
 * drie foto's die speels over elkaar heen vallen.
 */
export default function ScrollStory() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (prefersReducedMotion) {
    return (
      <section aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact" className="bg-white">
        <StaticStory />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact"
      className="relative bg-white"
      style={{ height: `${CHAPTER_COUNT * 170}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {chapters.map((chapter, i) => (
          <Scene key={chapter.accent} chapter={chapter} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
