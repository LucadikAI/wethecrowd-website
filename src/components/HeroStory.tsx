import {
  animate,
  motion,
  motionValue,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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
      { src: "/dienst-stagemanagement.jpg", alt: "Stagemanager met headset tijdens de show in de kerk" },
      { src: "/luca-werk-8.jpg", alt: "Backstage, vijf minuten voor doors" },
      { src: "/dienst-showcalling.jpg", alt: "Uitzicht op de lege zaal vanaf de regieplek, vlak voor doors" },
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
 * De zin komt bovenin te staan; de drie foto's spelen daaronder en vallen
 * speels over elkaar heen. Vaste plekken, zodat de opstelling voor elke zin
 * hetzelfde aanvoelt en de prerender dezelfde pagina oplevert als de browser.
 */
const photoSlots = [
  {
    className: "left-[4vw] top-[32svh] w-[58vw] aspect-[4/3] md:left-[5vw] md:top-[34svh] md:w-[34vw]",
    rotate: -6,
    z: "z-10",
  },
  {
    className: "left-[36vw] top-[46svh] w-[58vw] aspect-[4/3] md:left-[35vw] md:top-[25svh] md:w-[31vw]",
    rotate: 4,
    z: "z-30",
  },
  {
    className: "left-[10vw] top-[62svh] w-[60vw] aspect-[4/3] md:left-[60vw] md:top-[41svh] md:w-[34vw]",
    rotate: -3,
    z: "z-20",
  },
];

/** Zo hoog boven het midden van het scherm komt de opgepakte zin te staan. */
const PHRASE_LIFT = 0.3;

const COPIES = 10;
const SPRING = { type: "spring" as const, stiffness: 210, damping: 26 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Waar de opgepakte zin vandaan komt: de kopie in de lopende regel die het dichtst bij het midden staat. */
type Source = { dx: number; dy: number; scale: number; copy: number };

type LineHandle = {
  /** Horizontale stand van de regel, in procenten. */
  x: MotionValue<number>;
  /** Zichtbaarheid per kopie; de opgepakte kopie wordt verborgen. */
  copyOpacity: MotionValue<number>[];
};

function useLineHandles(): LineHandle[] {
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

/**
 * De grote zin. Hij begint exact op de plek en het formaat van zijn kopie in de
 * lopende regel en gaat van daaruit naar zijn plek bovenin, waar de foto's
 * eronder kunnen spelen. De voortgang is één veer van 0 naar 1, zodat hij bij
 * het loslaten dezelfde weg terugloopt.
 */
function Phrase({
  chapter,
  open,
  source,
  reduce,
  stageRef,
  phraseRef,
}: {
  chapter: Chapter;
  open: boolean;
  source: { current: Source | null };
  reduce: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
  phraseRef: (el: HTMLParagraphElement | null) => void;
}) {
  const t = useMotionValue(0);

  useEffect(() => {
    if (reduce) {
      t.set(open ? 1 : 0);
      return;
    }
    const controls = animate(t, open ? 1 : 0, SPRING);
    return () => controls.stop();
  }, [open, reduce, t]);

  // De bron wordt vlak voor het openen gemeten; op t = 0 valt de zin dus precies
  // over zijn kopie heen en is de wissel niet te zien.
  const x = useTransform(t, (v) => lerp(source.current?.dx ?? 0, 0, v));
  const y = useTransform(t, (v) => {
    const lift = -PHRASE_LIFT * (stageRef.current?.clientHeight ?? 0);
    return lerp(source.current?.dy ?? 0, lift, v);
  });
  const scale = useTransform(t, (v) => lerp(source.current?.scale ?? 0.85, 1, v));
  const opacity = useTransform(t, [0, 0.3], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.p
        ref={phraseRef}
        style={{ x, y, scale, opacity }}
        className="whitespace-nowrap text-center font-bold uppercase leading-none tracking-tighter text-gray-900 text-[7vw] md:text-[6.5vw]"
      >
        {chapter.lead} <span className="text-brand-accent">{chapter.accent}</span>
      </motion.p>
    </div>
  );
}

/** Eén lopende regel, aangestuurd door een MotionValue in procenten. */
function MarqueeLine({
  chapter,
  index,
  line,
  dimmed,
  reduce,
  onOpen,
  onClose,
  onToggle,
}: {
  chapter: Chapter;
  index: number;
  line: LineHandle;
  dimmed: boolean;
  reduce: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
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
    <motion.div
      data-line={index}
      // Alleen een echte muis opent op hover; op een aanraakscherm bestaat hover
      // niet en is de tik de schakelaar.
      onPointerEnter={(e: ReactPointerEvent) => { if (e.pointerType === "mouse") onOpen(); }}
      onPointerLeave={(e: ReactPointerEvent) => { if (e.pointerType === "mouse") onClose(); }}
      onClick={(e) => {
        if ((e.nativeEvent as PointerEvent).pointerType === "mouse") return;
        onToggle();
      }}
      animate={{ opacity: dimmed ? 0 : 1 }}
      initial={false}
      transition={reduce ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
      className="flex cursor-pointer overflow-hidden whitespace-nowrap py-1"
    >
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
 * De hero: drie lopende regels die blijven lopen zolang je er niet bij bent.
 * Ga je met de muis over een regel (of tik je erop), dan wordt die zin uit de
 * lopende tekst opgepakt, groeit hij naar het midden en vallen er drie foto's
 * omheen. Haal je de muis weg, dan gaat alles terug en lopen de regels verder.
 * Scrollen doet niets bijzonders: de pagina scrolt gewoon door.
 */
function InteractiveHero() {
  const reduce = useReducedMotion() === true;
  const lines = useLineHandles();
  const [active, setActive] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  // Eén vast ref-object per zin: Phrase leest de bron pas tijdens het animeren,
  // dus het object moet tussen renders hetzelfde blijven.
  const sources = useRef<{ current: Source | null }[]>(chapters.map(() => ({ current: null })));
  const activeRef = useRef<number | null>(null);

  // De regels lopen door zolang er geen zin openstaat. Staat er één open, dan
  // staan ze stil: anders schuift de kopie weg onder de zin die eruit groeit.
  useAnimationFrame((_, delta) => {
    if (reduce || activeRef.current !== null) return;
    lines.forEach((line, i) => {
      const { duration, reverse } = chapters[i].marquee;
      const step = (delta / (duration * 1000)) * 50;
      let v = line.x.get() + (reverse ? step : -step);
      if (v <= -50) v += 50;
      if (v > 0) v -= 50;
      line.x.set(v);
    });
  });

  /** Meet welke kopie van regel `i` het dichtst bij het midden staat, en hoe groot die is. */
  const measure = (i: number) => {
    const stage = stageRef.current;
    const self = phraseRefs.current[i];
    if (!stage || !self) return;
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
    sources.current[i].current = {
      dx: r.left + r.width / 2 - cx,
      dy: r.top + r.height / 2 - cy,
      scale: srcFont / bigFont,
      copy: b.copy,
    };
  };

  const open = (i: number) => {
    if (activeRef.current === i) return;
    measure(i);
    // De opgepakte kopie verdwijnt, zodat je de zin geen twee keer ziet staan.
    lines.forEach((line, l) =>
      line.copyOpacity.forEach((mv, c) => mv.set(l === i && c === sources.current[i].current?.copy ? 0 : 1))
    );
    activeRef.current = i;
    setActive(i);
  };

  const close = () => {
    if (activeRef.current === null) return;
    activeRef.current = null;
    setActive(null);
    // Pas terugzetten als de zin weer op zijn kopie ligt; anders knippert hij.
    window.setTimeout(() => {
      if (activeRef.current === null) {
        lines.forEach((line) => line.copyOpacity.forEach((mv) => mv.set(1)));
      }
    }, 320);
  };

  // Escape en een tik buiten de regels sluiten de zin ook; op een aanraakscherm
  // is dat de enige manier om er weer uit te komen.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest?.("[data-line]")) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = active !== null;

  return (
    <section
      aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-white"
    >
      <div className="h-[16vh] md:hidden" />
      <div className="hidden md:block md:flex-1" />

      {/*
        De H1 van de homepage. De lopende regels zijn bewegend en decoratief, dus
        de leesbare kop staat als sr-only tekst.
      */}
      <h1 className="sr-only">
        WE THE CROWD: creatieve oplossingen, strakke uitvoering en blijvende impact
      </h1>

      <div aria-hidden="true" className="relative z-10 flex w-full flex-col">
        {chapters.map((chapter, i) => (
          <MarqueeLine
            key={chapter.accent}
            chapter={chapter}
            index={i}
            line={lines[i]}
            dimmed={busy}
            reduce={reduce}
            onOpen={() => open(i)}
            onClose={close}
            onToggle={() => (active === i ? close() : open(i))}
          />
        ))}
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: busy ? 0 : 1, y: busy ? -12 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
        style={{ pointerEvents: busy ? "none" : "auto" }}
        className="w-full"
      >
        <HeroCopy />
      </motion.div>

      <div className="hidden md:block md:flex-1" />

      {/* Toneel: de opgepakte zin met zijn foto's. Ligt over de regels heen en
          vangt geen muis, zodat de hover op de regel blijft staan. */}
      <div ref={stageRef} className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[100svh]">
        {chapters.map((chapter, i) => (
          <div key={chapter.accent} className="absolute inset-0">
            {chapter.photos.map((photo, p) => (
              <motion.figure
                key={photo.src}
                initial={false}
                animate={
                  active === i
                    ? { opacity: 1, scale: 1, y: 0, rotate: photoSlots[p].rotate }
                    : { opacity: 0, scale: 0.55, y: 60, rotate: photoSlots[p].rotate * 2.5 }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { ...SPRING, delay: active === i ? 0.05 + p * 0.09 : 0 }
                }
                className={`absolute overflow-hidden rounded-2xl bg-gray-100 shadow-2xl md:rounded-3xl ${photoSlots[p].className} ${photoSlots[p].z}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </motion.figure>
            ))}

            <div className="absolute inset-0 z-0">
              <Phrase
                chapter={chapter}
                open={active === i}
                source={sources.current[i]}
                reduce={reduce}
                stageRef={stageRef}
                phraseRef={(el) => {
                  phraseRefs.current[i] = el;
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Rustige variant: de hero met daaronder de drie zinnen en hun foto's op een rij. */
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
 * Openingsscherm van de homepage. Wie minder beweging wil krijgt de stilstaande
 * hero met de drie zinnen eronder; de rest krijgt de interactieve versie.
 */
export default function HeroStory() {
  const prefersReducedMotion = useReducedMotion();
  // De prerender bevat altijd de interactieve versie. Pas na het mounten
  // omschakelen, anders klopt de HTML bij hydration niet.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (prefersReducedMotion && mounted) {
    return (
      <>
        <Hero />
        <section aria-label="Creatieve oplossingen, strakke uitvoering en blijvende impact" className="bg-white">
          <StaticStory />
        </section>
      </>
    );
  }

  return <InteractiveHero />;
}
