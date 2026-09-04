import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Photo = { src: string; alt: string; position?: string };

type Chapter = {
  /** Eerste deel van de zin, in zwart. */
  lead: string;
  /** Laatste woord, in het accentblauw. */
  accent: string;
  photos: Photo[];
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

function StoryPhoto({ photo, index }: { photo: Photo; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const frameScale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1]);

  return (
    <div ref={ref} className="px-4 md:px-8 py-3 md:py-5">
      <motion.figure
        style={prefersReducedMotion ? {} : { scale: frameScale }}
        className="relative h-[70svh] md:h-[88svh] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-2xl"
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          style={prefersReducedMotion ? {} : { y: imageY }}
          className={`absolute inset-0 h-[120%] w-full -top-[10%] object-cover ${photo.position ?? "object-center"}`}
        />
        <figcaption className="sr-only">{photo.alt}</figcaption>
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-6 text-xs font-bold uppercase tracking-widest text-white/80 mix-blend-difference"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.figure>
    </div>
  );
}

function StoryChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <div ref={ref} className="relative">
      {/* De zin blijft plakken; de foto's schuiven er vervolgens overheen. */}
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-white px-6 text-center">
        <motion.p
          style={prefersReducedMotion ? {} : { scale, opacity, y }}
          className="font-bold uppercase leading-[0.9] tracking-tighter text-gray-900 text-[15vw] md:text-[9vw]"
        >
          {chapter.lead}{" "}
          <span className="text-brand-accent">{chapter.accent}</span>
        </motion.p>
        <motion.span
          style={prefersReducedMotion ? {} : { opacity }}
          aria-hidden="true"
          className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gray-400"
        >
          {String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
        </motion.span>
      </div>

      <div className="relative z-10">
        {chapter.photos.map((photo, i) => (
          <StoryPhoto key={photo.src} photo={photo} index={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Scrollverhaal onder de hero: de drie kernzinnen komen één voor één naar
 * voren, telkens gevolgd door drie grote foto's die eroverheen schuiven.
 */
export default function ScrollStory() {
  return (
    <section aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact" className="bg-white">
      {chapters.map((chapter, i) => (
        <StoryChapter key={chapter.accent} chapter={chapter} index={i} />
      ))}
      <div className="h-8 md:h-16 bg-white" />
    </section>
  );
}
