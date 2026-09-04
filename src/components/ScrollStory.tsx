import {
  motion,
  motionValue,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMemo, useRef } from "react";
import Hero, { HeroCopy } from "./Hero";

type Photo = { src: string; alt: string };

type Chapter = {
  /** Eerste deel van de zin, in zwart. */
  lead: string;
  /** Laatste woord, in het accentblauw. */
  accent: string;
  /** Instellingen van de lopende regel in de hero. */
  marquee: { duration: number; reverse?: boolean; highlightWord: string };
  photos: [Photo, Photo, Photo];
};

const chapters: Chapter[] = [
  {
    lead: "Creatieve",
    accent: "oplossingen",
    marquee: { duration: 60, highlightWord: "Creatieve" },
    photos: [
      { src: "/indische-buurt-run-2026.jpg", alt: "Start van de Indische Buurt Run 2026 onder de boog van Diversiteitsland" },
      { src: "/home-luca-en-tim-laptop.jpg", alt: "Luca en Tim lachend achter hun laptops tijdens een werksessie" },
      { src: "/fairspace-gallery-1.jpg", alt: "Bezoeker met VR-bril tijdens Fairspace #DoeMeeMet5D" },
    ],
  },
  {
    lead: "Strakke",
    accent: "uitvoering",
    marquee: { duration: 80, reverse: true, highlightWord: "uitvoering" },
    photos: [
      { src: "/dienst-stagemanagement.jpg", alt: "Podiumopbouw van bovenaf gezien tijdens de productie" },
      { src: "/nationale-viering-bevrijding.jpg", alt: "Crewlid met headset achter de schermen bij de Nationale Viering van de Bevrijding" },
      { src: "/dienst-showcalling.jpg", alt: "Showcalling vanaf de regieplek met laptop en lichttafel" },
    ],
  },
  {
    lead: "Blijvende",
    accent: "impact",
    marquee: { duration: 70, highlightWord: "impact" },
    photos: [
      { src: "/eo-jongerdag.jpg", alt: "Volle zaal met lichtjes tijdens de EO-Jongerendag" },
      { src: "/crown-events.jpg", alt: "Publiek met handen in de lucht bij Crown Events" },
      { src: "/luca-werk-6.jpg", alt: "Kerk in blauw en groen licht tijdens een avondvullend evenement" },
    ],
  },
];

/**
 * Plek, formaat en rotatie van de drie foto's. Dezelfde opstelling voor elk
 * hoofdstuk, zodat de speelsheid consequent is. Ze overlappen bewust.
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
      "left-[36vw] top-[44svh] w-[58vw] aspect-[4/3] md:left-[35vw] md:top-[22svh] md:w-[31vw]",
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
const COPIES = 10;

/** Zet een tijdstip binnen hoofdstuk `i` (0..1) om naar de globale scrollvoortgang. */
const at = (i: number, local: number) => (i + local) / CHAPTER_COUNT;

/**
 * Tijdlijn per hoofdstuk (lokaal 0..1). In hoofdstuk 0 staat de hero al in
 * beeld; in latere hoofdstukken komen de lopende regels eerst kort terug.
 */
const timeline = (i: number) => {
  const first = i === 0;
  const grabStart = first ? 0.05 : 0.06;
  const photosStart = grabStart + 0.3;
  return {
    grab: [grabStart, grabStart + 0.26],
    /** De lopende regels vervagen terwijl de eerste zin groeit (alleen hoofdstuk 0). */
    linesOut: [grabStart, grabStart + 0.2],
    lift: [grabStart + 0.28, grabStart + 0.38],
    photosStart,
    exit: [0.86, 1],
  } as const;
};

/**
 * Tijdens het oppakken van de eerste zin staan de regels stil, zodat de zin
 * exact op de plek van zijn kopie kan beginnen. Daarna zijn ze weg.
 */
const isFrozen = (p: number) => {
  const l = p * CHAPTER_COUNT;
  const tl = timeline(0);
  return l >= tl.grab[0] - 0.01;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type LineHandle = {
  x: MotionValue<number>;
  /** Zichtbaarheid per kopie; de opgepakte kopie wordt verborgen. */
  copyOpacity: MotionValue<number>[];
};

function ScenePhoto({
  photo,
  slot,
  chapterIndex,
  photoIndex,
  progress,
}: {
  photo: Photo;
  slot: (typeof photoSlots)[number];
  chapterIndex: number;
  photoIndex: number;
  progress: MotionValue<number>;
}) {
  const i = chapterIndex;
  const tl = timeline(i);
  const isLast = i === CHAPTER_COUNT - 1;
  const start = tl.photosStart + photoIndex * 0.09;
  const end = start + 0.14;
  const exitStart = isLast ? 2 : at(i, tl.exit[0]);
  const exitEnd = isLast ? 3 : at(i, tl.exit[1]);

  const opacity = useTransform(progress, [at(i, start), at(i, end), exitStart, exitEnd], [0, 1, 1, 0]);
  const scale = useTransform(progress, [at(i, start), at(i, end), exitStart, exitEnd], [0.4, 1, 1, 1.12]);
  const y = useTransform(progress, [at(i, start), at(i, end)], ["45svh", "0svh"]);
  const rotate = useTransform(progress, [at(i, start), at(i, end)], [slot.rotate * 3, slot.rotate]);

  return (
    <motion.figure
      style={{ opacity, scale, y, rotate }}
      className={`absolute overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 shadow-2xl ${slot.className} ${slot.z}`}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </motion.figure>
  );
}

/**
 * De grote zin. Tijdens de 'grab' start hij exact op de plek en het formaat
 * van de kopie in de lopende regel die het dichtst bij het midden staat, en
 * groeit van daaruit naar het midden van het scherm.
 */
function Phrase({
  chapter,
  index,
  progress,
  stageRef,
  line,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  line: LineHandle;
}) {
  const i = index;
  const tl = timeline(i);
  const isLast = i === CHAPTER_COUNT - 1;
  const ref = useRef<HTMLParagraphElement>(null);
  const source = useRef<{ dx: number; dy: number; scale: number; copy: number } | null>(null);

  const measure = () => {
    const stage = stageRef.current;
    const self = ref.current;
    if (!stage || !self) return;
    // Latere zinnen komen niet uit de lopende tekst, maar zelf van rechts.
    if (i > 0) {
      source.current = { dx: stage.clientWidth * 0.35, dy: 0, scale: 0.45, copy: -1 };
      return;
    }
    const copies = stage.querySelectorAll<HTMLElement>(`[data-line="${i}"] [data-phrase]`);
    if (!copies.length) return;
    const stageRect = stage.getBoundingClientRect();
    const cx = stageRect.left + stageRect.width / 2;
    const cy = stageRect.top + stageRect.height / 2;
    let best: { el: HTMLElement; copy: number; d: number } | null = null;
    copies.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - cx);
      if (!best || d < best.d) best = { el, copy: idx, d };
    });
    if (!best) return;
    const b = best as { el: HTMLElement; copy: number; d: number };
    const r = b.el.getBoundingClientRect();
    const srcFont = parseFloat(getComputedStyle(b.el).fontSize);
    const bigFont = parseFloat(getComputedStyle(self).fontSize);
    source.current = {
      dx: r.left + r.width / 2 - cx,
      dy: r.top + r.height / 2 - cy,
      scale: srcFont / bigFont,
      copy: b.copy,
    };
  };

  /** Lokale voortgang (0..1) binnen dit hoofdstuk. */
  const local = (p: number) => p * CHAPTER_COUNT - i;

  const grabT = (p: number) => clamp01((local(p) - tl.grab[0]) / (tl.grab[1] - tl.grab[0]));
  const liftT = (p: number) => clamp01((local(p) - tl.lift[0]) / (tl.lift[1] - tl.lift[0]));
  const exitT = (p: number) => (isLast ? 0 : clamp01((local(p) - tl.exit[0]) / (tl.exit[1] - tl.exit[0])));

  const wasFrozen = useRef(false);

  const update = (p: number) => {
    const l = local(p);
    // Meten op het moment dat de regels bevriezen (vanuit beide scrollrichtingen).
    const frozen = l >= tl.grab[0] - 0.01 && l < tl.linesOut[1];
    if (frozen && !wasFrozen.current) measure();
    wasFrozen.current = frozen;
    // De opgepakte kopie is verborgen tot de regels weer (onzichtbaar) terugkomen.
    const grabbing = l >= tl.grab[0] && l < tl.photosStart;
    line.copyOpacity.forEach((mv, idx) =>
      mv.set(grabbing && source.current && idx === source.current.copy ? 0 : 1)
    );
  };

  const x = useTransform(progress, (p) => {
    update(p);
    const s = source.current;
    return s ? lerp(s.dx, 0, ease(grabT(p))) : 0;
  });
  const y = useTransform(progress, (p) => {
    const s = source.current;
    const stageH = stageRef.current?.clientHeight ?? 0;
    const fromGrab = s ? lerp(s.dy, 0, ease(grabT(p))) : 0;
    return fromGrab + lerp(0, -0.32 * stageH, liftT(p));
  });
  const scale = useTransform(progress, (p) => {
    const s = source.current;
    const grabbed = s ? lerp(s.scale, 1, ease(grabT(p))) : 1;
    return grabbed * lerp(1, 0.72, liftT(p)) * lerp(1, 1.1, exitT(p));
  });
  const opacity = useTransform(progress, (p) => {
    const l = local(p);
    if (l < tl.grab[0] || l >= tl.exit[1]) return 0;
    // De eerste zin is meteen zichtbaar (hij vervangt zijn kopie); de andere faden in.
    const fadeIn = i === 0 ? 1 : clamp01(grabT(p) / 0.4);
    return fadeIn * (1 - exitT(p));
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.p
        ref={ref}
        style={{ x, y, scale, opacity }}
        className="whitespace-nowrap text-center font-bold uppercase leading-none tracking-tighter text-gray-900 text-[8vw] md:text-[7.5vw]"
      >
        {chapter.lead} <span className="text-brand-accent">{chapter.accent}</span>
      </motion.p>
    </div>
  );
}

/** Eén lopende regel uit de hero, aangestuurd door een MotionValue in procenten. */
function MarqueeLine({
  chapter,
  index,
  line,
  opacity,
}: {
  chapter: Chapter;
  index: number;
  line: LineHandle;
  opacity: MotionValue<number>;
}) {
  const xPercent = useTransform(line.x, (v) => `${v}%`);
  const text = `${chapter.lead} ${chapter.accent}`;
  const { highlightWord } = chapter.marquee;

  const renderText = (copy: number) => {
    if (copy % 3 !== 1) return text;
    const parts = text.split(new RegExp(`(${highlightWord})`, "gi"));
    return parts.map((part, k) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={k} className="text-brand-accent">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div style={{ opacity }} data-line={index} className="flex overflow-hidden whitespace-nowrap py-1">
      <motion.div
        style={{ x: xPercent }}
        className="flex text-[16vw] md:text-[7vw] font-bold uppercase tracking-tighter text-gray-900 leading-none"
      >
        {[...Array(COPIES)].map((_, copy) => (
          <span key={copy} className="inline-block px-4">
            <motion.span data-phrase style={{ opacity: line.copyOpacity[copy] }} className="inline-block">
              {renderText(copy)}
            </motion.span>
            {" • "}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/**
 * De hero-laag: de drie lopende regels plus intro-tekst en knoppen. De regels
 * lopen zolang je bovenaan staat en bevriezen zodra je scrolt, zodat een zin
 * eruit 'opgepakt' kan worden. Bij hoofdstuk 2 en 3 komen ze kort terug.
 */
function HeroLayer({
  progress,
  lines,
}: {
  progress: MotionValue<number>;
  lines: LineHandle[];
}) {
  const prefersReducedMotion = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isFrozen(progress.get())) return;
    lines.forEach((line, i) => {
      const { duration, reverse } = chapters[i].marquee;
      const step = (delta / (duration * 1000)) * 50;
      let v = line.x.get() + (reverse ? step : -step);
      if (v <= -50) v += 50;
      if (v > 0) v -= 50;
      line.x.set(v);
    });
  });

  // De lopende regels vervagen terwijl de eerste zin eruit groeit en komen
  // daarna niet meer terug.
  const tl0 = timeline(0);
  const linesOpacity = useTransform(progress, [0, at(0, tl0.linesOut[0]), at(0, tl0.linesOut[1])], [1, 1, 0]);
  const copyOpacity = useTransform(progress, [0, at(0, 0.1)], [1, 0]);
  const copyY = useTransform(progress, [0, at(0, 0.1)], ["0svh", "-4svh"]);
  const pointerEvents = useTransform(copyOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <section className="absolute inset-0 flex flex-col items-center overflow-hidden bg-white">
      <div className="h-[16vh] md:hidden" />
      <div className="hidden md:block md:flex-1" />

      <h1 className="sr-only">
        WE THE CROWD: creatieve oplossingen, strakke uitvoering en blijvende impact
      </h1>

      <div aria-hidden="true" className="relative z-10 w-full flex flex-col">
        {chapters.map((chapter, i) => (
          <MarqueeLine key={chapter.accent} chapter={chapter} index={i} line={lines[i]} opacity={linesOpacity} />
        ))}
      </div>

      <motion.div style={{ opacity: copyOpacity, y: copyY, pointerEvents }} className="w-full">
        <HeroCopy />
      </motion.div>

      <div className="hidden md:block md:flex-1" />
    </section>
  );
}

function useLineHandles(): LineHandle[] {
  // Eén x-positie (in procenten) per regel en één opaciteit per kopie.
  const x0 = useMotionValue(0);
  const x1 = useMotionValue(-50);
  const x2 = useMotionValue(0);
  return useMemo(
    () =>
      [x0, x1, x2].map((x) => ({
        x,
        copyOpacity: [...Array(COPIES)].map(() => motionValue(1)),
      })),
    [x0, x1, x2]
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
              <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Vastgepind openingsscherm van de homepage. Eerst de hero met de lopende
 * zinnen; zodra je scrolt blijft de pagina staan, wordt een zin uit de
 * lopende tekst opgepakt en uitvergroot, en vallen er drie foto's speels
 * over elkaar. Dat herhaalt zich voor de drie zinnen.
 */
export default function ScrollStory() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lines = useLineHandles();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (prefersReducedMotion) {
    return (
      <>
        <Hero />
        <section aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact" className="bg-white">
          <StaticStory />
        </section>
      </>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact"
      className="relative bg-white"
      style={{ height: `${CHAPTER_COUNT * 180}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroLayer progress={scrollYProgress} lines={lines} />
        {chapters.map((chapter, i) => (
          <div key={chapter.accent} className="absolute inset-0 pointer-events-none">
            <Phrase chapter={chapter} index={i} progress={scrollYProgress} stageRef={stageRef} line={lines[i]} />
            {chapter.photos.map((photo, p) => (
              <ScenePhoto
                key={photo.src}
                photo={photo}
                slot={photoSlots[p]}
                chapterIndex={i}
                photoIndex={p}
                progress={scrollYProgress}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
