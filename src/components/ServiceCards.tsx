import { motion, animate, easeIn, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "../data/services";
import Mountains from "./Mountains";

const spring = { type: "spring" as const, stiffness: 200, damping: 20 };

/** Boven deze pointerverplaatsing (px) telt een gebaar als slepen, niet als klik. */
const DRAG_THRESHOLD = 6;
/** Zoveel px schuift een open kaart omhoog, zodat hij uit het landschap komt. */
const OPEN_LIFT = 70;
/**
 * De rij is precies 100vw breed, het venster door de scrollbar een paar px minder.
 * Tot dit verschil telt de rij nog als passend en blijft hij gecentreerd.
 */
const FIT_TOLERANCE = 12;
const SERVICES_PATH = "/dit-doe-ik-graag";

/** Donker verloop over de foto. Dieper zodra de kaart open staat en er ook tekst onder de titel komt. */
const SHADE_CLOSED = "linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,0) 70%)";
const SHADE_OPEN = "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.75) 55%, rgba(0,0,0,.15) 100%)";

/**
 * De open kaart is 560px hoog; daar past de volledige dienstentekst van de
 * dienstenpagina niet in. Op de homepage tonen we daarom de eerste twee
 * zinnen, precies zoals de mockup. De volledige tekst staat op /dit-doe-ik-graag.
 */
function opening(text: string, sentences = 2): string {
  return text.split(/(?<=[.!?])\s+/).slice(0, sentences).join(" ");
}

const [eventmanagement, artiestenbegeleiding, artiestenboeking, stagemanagement, showcalling] = services;

/** Zweefbeweging in rust: x en y hebben elk een eigen tempo, zodat het niet mechanisch loopt. */
type Float = { x: number[]; y: number[]; xDuration: number; yDuration: number };

type Card = {
  /** Titel, met soft hyphens (­) op de plekken waar hij mag afbreken. */
  title: string;
  cta: string;
  description: string;
  /** null = foto volgt nog; dan tonen we een placeholder in brand-accent. */
  image: string | null;
  /** Uitsnede van de foto. Standaard "center"; per kaart bij te stellen als de titel op een druk deel valt. */
  objectPosition?: string;
  rotate: number;
  y: number;
  float: Float;
};

const cards: Card[] = [
  {
    title: "Event­management & productie",
    cta: "Meer over productie",
    description: opening(eventmanagement.description),
    image: "/dienst-eventmanagement.jpg",
    objectPosition: "center 42%",
    rotate: -5,
    y: 22,
    float: { x: [0, 9, -6, 0], y: [0, -14, 5, 0], xDuration: 7.4, yDuration: 5.6 },
  },
  {
    title: "Artiesten­begeleiding",
    cta: "Meer over begeleiding",
    description: opening(artiestenbegeleiding.description),
    image: "/dienst-artiestenbegeleiding.jpg",
    objectPosition: "center 38%",
    rotate: 3,
    y: -12,
    float: { x: [0, -8, 7, 0], y: [0, 10, -12, 0], xDuration: 6.3, yDuration: 7.1 },
  },
  {
    title: "Artiesten­boeking",
    cta: "Meer over boeking",
    // Voluit, niet ingekort: deze tekst is kort genoeg voor de open kaart.
    description: artiestenboeking.description,
    image: "/dienst-artiesten.jpg",
    objectPosition: "78% center",
    rotate: -2,
    y: 30,
    float: { x: [0, 7, -9, 0], y: [0, -16, 4, 0], xDuration: 8.2, yDuration: 6.4 },
  },
  {
    title: "Stage­management",
    cta: "Meer over stagemanagement",
    description: opening(stagemanagement.description),
    image: "/dienst-stagemanagement.jpg",
    objectPosition: "42% center",
    rotate: 4,
    y: 0,
    float: { x: [0, -10, 5, 0], y: [0, -8, 12, 0], xDuration: 6.9, yDuration: 7.8 },
  },
  {
    title: "Showcalling",
    cta: "Meer over showcalling",
    description: opening(showcalling.description),
    image: "/dienst-showcalling.jpg",
    objectPosition: "64% center",
    rotate: -4,
    y: 18,
    float: { x: [0, 6, -8, 0], y: [0, -12, 6, 0], xDuration: 7.7, yDuration: 5.9 },
  },
];

/** Zoveel px zakken de kaarten maximaal in de bergen terwijl de sectie uit beeld scrolt. */
const SINK_DEPTH = 420;

type Bounds = { left: number; right: number };

const clampTo = (value: number, b: Bounds) => Math.min(b.right, Math.max(b.left, value));

/**
 * Vijf scheve dienstenkaarten in een sleepbare rij, half verzonken in een
 * berglandschap. Eén kaart tegelijk kan open: die draait recht, groeit en
 * schuift naar het midden. De maatvoering staat als CSS-variabelen op
 * `.service-cards` in index.css.
 */
export default function ServiceCards() {
  const reduce = useReducedMotion() === true;
  const baseId = useId();

  const [active, setActive] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState<Bounds>({ left: 0, right: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeRef = useRef<number | null>(null);
  const boundsRef = useRef<Bounds>(bounds);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0);

  // Terwijl de sectie naar boven uit beeld scrolt, zakken de kaarten steeds
  // dieper in de bergen (die vóór de kaarten staan). Begint zodra de bovenkant
  // van de sectie de bovenkant van het venster raakt.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const sinkY = useTransform(scrollYProgress, [0, 1], [0, SINK_DEPTH], { ease: easeIn });

  /**
   * Sleepgrenzen: passen alle kaarten in het venster, dan staat de rij vast
   * in het midden (en veert hij na slepen terug). Anders sleep je vrij tussen
   * de linker- en rechterrand.
   */
  const measure = (): Bounds => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return boundsRef.current;
    const vw = vp.clientWidth;
    const tw = track.offsetWidth;
    const next: Bounds =
      tw - vw <= FIT_TOLERANCE
        ? { left: Math.round((vw - tw) / 2), right: Math.round((vw - tw) / 2) }
        : { left: Math.round(vw - tw), right: 0 };
    if (next.left !== boundsRef.current.left || next.right !== boundsRef.current.right) {
      boundsRef.current = next;
      setBounds(next);
    }
    return next;
  };

  /**
   * Positie van de rij waarbij de open kaart in het midden staat. Gerekend
   * met de eindmaten, want op het moment van klikken is de kaart nog aan het
   * groeien. Zolang de rij in het venster past mag hij daarvoor uit het
   * midden; anders blijft hij binnen de randen.
   */
  const centerTarget = (index: number): number => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!vp || !track || !section) return x.get();

    const trackStyle = getComputedStyle(track);
    const padL = parseFloat(trackStyle.paddingLeft) || 0;
    const padR = parseFloat(trackStyle.paddingRight) || 0;
    const gap = parseFloat(trackStyle.columnGap) || 0;
    // De kaarten vallen over elkaar via een negatieve linkermarge op elke li na de eerste.
    const secondSlot = track.children[1] as HTMLElement | undefined;
    const overlap = secondSlot ? -(parseFloat(getComputedStyle(secondSlot).marginLeft) || 0) : 0;
    const openW = parseFloat(getComputedStyle(section).getPropertyValue("--card-w-open")) || 0;
    // Breedte van een dichte kaart: de kleinste van de andere kaarten, zodat een
    // kaart die nog aan het dichtklappen is niet meetelt.
    const closedWidths = cardRefs.current
      .filter((el, i): el is HTMLDivElement => el !== null && i !== index)
      .map((el) => el.offsetWidth);
    const cardW = closedWidths.length ? Math.min(...closedWidths) : 0;

    const vw = vp.clientWidth;
    const n = cards.length;
    const step = cardW + gap - overlap;
    const trackW = padL + padR + (n - 1) * step + openW;
    const slotLeft = padL + index * step;
    const target = vw / 2 - (slotLeft + openW / 2);
    return trackW <= vw ? target : clampTo(target, { left: vw - trackW, right: 0 });
  };

  /** Zet de rij op zijn plek: open kaart gecentreerd, anders binnen de grenzen. */
  const settle = (instant = false) => {
    const b = measure();
    const idx = activeRef.current;
    const target = idx === null ? clampTo(x.get(), b) : centerTarget(idx);
    if (instant || reduce) {
      x.stop();
      x.set(target);
    } else {
      animate(x, target, spring);
    }
  };
  const settleRef = useRef(settle);
  settleRef.current = settle;

  const setOpen = (next: number | null) => {
    activeRef.current = next;
    setActive(next);
    settle();
  };
  const close = () => {
    if (activeRef.current !== null) setOpen(null);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  // Eerste positie meteen goed zetten en meebewegen met venster- en baanbreedte
  // (de baan wordt breder terwijl een kaart opent).
  useLayoutEffect(() => {
    settleRef.current(true);
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const observer = new ResizeObserver(() => settleRef.current());
    observer.observe(vp);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Horizontaal scrollen met trackpad. Native listener, want React registreert
  // wheel passief en dan werkt preventDefault niet.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x.stop();
      x.set(clampTo(x.get() - e.deltaX, boundsRef.current));
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [x]);

  // Sluiten met Escape of met een klik buiten de kaarten.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    const onDocumentClick = (e: MouseEvent) => {
      const vp = viewportRef.current;
      if (activeRef.current !== null && vp && !vp.contains(e.target as Node)) closeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  const onPointerDownCapture = (e: ReactPointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  /** Klik of sleep? Toetsenbordklikken (detail 0) tellen altijd als klik. */
  const movedSinceDown = (e: ReactMouseEvent) => {
    const down = pointerDown.current;
    if (!down || e.detail === 0) return false;
    return Math.hypot(e.clientX - down.x, e.clientY - down.y) > DRAG_THRESHOLD;
  };

  const onViewportClick = (e: ReactMouseEvent) => {
    if (movedSinceDown(e)) return;
    const target = e.target as Element;
    const hit = cardRefs.current.findIndex((el) => el?.contains(target));
    if (hit === -1) {
      close();
      return;
    }
    if (target.closest("a")) return; // de link "Meer over ..." mag gewoon navigeren
    setOpen(activeRef.current === hit ? null : hit);
  };

  const onCtaClick = (e: ReactMouseEvent) => {
    if (movedSinceDown(e)) e.preventDefault();
  };

  const cardTransition = reduce ? { duration: 0 } : spring;

  return (
    <section ref={sectionRef} className="service-cards relative overflow-hidden bg-white pt-[72px]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={spring}
        className="flex flex-col items-center gap-2 px-[6vw] text-center"
      >
        <h2 className="text-[length:clamp(40px,5.6vw,76px)] leading-none tracking-[-0.03em]">
          Dit doe ik <span className="text-brand-accent">graag</span>
        </h2>
        <Link
          to={SERVICES_PATH}
          className="group inline-flex items-center gap-2 text-[15px] font-bold text-brand-accent"
        >
          Bekijk alle diensten
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Podium: groeit mee als er een kaart open staat. */}
      <div
        className={`relative mt-[10px] transition-[height] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
          active === null ? "h-[calc(var(--card-h)_+_120px)]" : "h-[calc(var(--card-h-open)_+_120px)]"
        }`}
      >
        <div
          ref={viewportRef}
          onPointerDownCapture={onPointerDownCapture}
          onClick={onViewportClick}
          className={`absolute inset-0 overflow-hidden select-none [touch-action:pan-y] ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <motion.ul
            ref={trackRef}
            drag="x"
            dragConstraints={bounds}
            dragElastic={0.3}
            dragTransition={{ power: 0.35, timeConstant: 250, bounceStiffness: 200, bounceDamping: 25 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            style={{ x, y: reduce ? 0 : sinkY }}
            className="absolute bottom-[44px] left-0 flex w-max items-end px-(--track-pad)"
          >
            {cards.map((card, i) => {
              const isOpen = active === i;
              const dimmed = active !== null && !isOpen;
              const bobbing = !reduce && active === null;
              const titleId = `${baseId}-title-${i}`;
              const descId = `${baseId}-desc-${i}`;

              const rest = isOpen
                ? { y: -OPEN_LIFT, rotate: 0, scale: 1, opacity: 1, filter: "saturate(1)" }
                : dimmed
                  ? { y: card.y + 14, rotate: card.rotate, scale: 0.95, opacity: 0.65, filter: "saturate(0.7)" }
                  : { y: card.y, rotate: card.rotate, scale: 1, opacity: 1, filter: "saturate(1)" };
              // Altijd een hover-target meegeven (ook als dat gelijk is aan rust), anders
              // mist motion een pointerleave en blijft een kaart in hover-pose hangen.
              const hover = isOpen || dragging
                ? rest
                : dimmed
                  ? { ...rest, y: card.y - 6, scale: 0.97, opacity: 1, filter: "saturate(1)" }
                  : { ...rest, y: card.y - 14, rotate: card.rotate * 0.45 };

              return (
                /* Zweef-wrapper: los van de kaart, zodat het zweven niet botst met rotatie en open-transforms. */
                <motion.li
                  key={card.title}
                  initial={{ x: 0, y: 0 }}
                  animate={bobbing ? { x: card.float.x, y: card.float.y } : { x: 0, y: 0 }}
                  transition={
                    bobbing
                      ? {
                          x: { duration: card.float.xDuration, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
                          y: { duration: card.float.yDuration, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 },
                        }
                      : cardTransition
                  }
                  className={`shrink-0 [&:not(:first-child)]:-ml-(--card-overlap) ${isOpen ? "relative z-30" : ""}`}
                >
                  <motion.div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    initial={false}
                    animate={rest}
                    whileHover={hover}
                    transition={cardTransition}
                    className={`group relative cursor-pointer overflow-hidden rounded-[22px] bg-[#111] text-white transition-[width,height,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-accent has-[:focus-visible]:outline-offset-4 ${
                      isOpen
                        ? "h-(--card-h-open) w-(--card-w-open) shadow-[0_50px_80px_-28px_rgba(0,0,0,0.45),0_0_0_6px_#fff]"
                        : "h-(--card-h) w-(--card-w) shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35),0_1px_0_rgba(0,0,0,0.05)]"
                    }`}
                  >
                    {/* De hele kaart is een knop; de inhoud ligt erbovenop en laat klikken door. */}
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-labelledby={titleId}
                      aria-describedby={isOpen ? descId : undefined}
                      className="absolute inset-0 z-0 cursor-pointer rounded-[22px] outline-none"
                    />

                    <div className="pointer-events-none absolute inset-0 z-[1]">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt=""
                          draggable={false}
                          style={{ objectPosition: card.objectPosition ?? "center" }}
                          className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-linear-160 from-brand-accent to-brand-deep text-[13px] font-semibold uppercase tracking-[0.08em] text-white/60">
                          foto volgt
                        </div>
                      )}

                      {/* Donker verloop over de foto, zodat de tekst leesbaar blijft. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 transition-[background] duration-500 motion-reduce:transition-none"
                        style={{ background: isOpen ? SHADE_OPEN : SHADE_CLOSED }}
                      />

                      <span className="absolute left-4 top-[14px] z-[1] rounded-full bg-black/35 px-[9px] py-[5px] font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-[6px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Tekst staat op de foto; de 76px onderpadding houdt hem boven de bergen.
                          Rechts komt de overlap er nog bij: de volgende kaart ligt over deze heen,
                          en zonder die ruimte schuift een lange titel eronder weg. */}
                      <div
                        className={`absolute inset-x-0 bottom-0 flex flex-col gap-[10px] transition-[padding] duration-500 motion-reduce:transition-none ${
                          isOpen
                            ? "px-[26px] pt-[22px] pb-(--open-pad-b)"
                            : "pl-[18px] pr-[calc(18px_+_var(--card-overlap))] pt-[18px] pb-[76px]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-[3px] w-9 shrink-0 rounded-full bg-brand-accent transition-[width] duration-500 group-hover:w-16 motion-reduce:transition-none"
                        />
                        <h3
                          id={titleId}
                          className={`shrink-0 leading-none tracking-[-0.02em] [overflow-wrap:anywhere] transition-[font-size] duration-[400ms] motion-reduce:transition-none ${
                            isOpen ? "text-[34px]" : "text-[length:clamp(22px,2.1vw,30px)]"
                          }`}
                        >
                          {card.title}
                        </h3>
                        <p
                          id={descId}
                          aria-hidden={!isOpen}
                          className={`min-h-0 text-(length:--open-text) leading-[1.55] text-white/82 [transition:max-height_.5s,opacity_.35s] motion-reduce:transition-none ${
                            isOpen ? "pointer-events-auto max-h-[240px] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"
                          }`}
                        >
                          {card.description}
                        </p>
                        <Link
                          to={SERVICES_PATH}
                          draggable={false}
                          tabIndex={isOpen ? 0 : -1}
                          aria-hidden={!isOpen}
                          onClick={onCtaClick}
                          className={`inline-flex shrink-0 items-center gap-2 self-start overflow-hidden text-sm font-bold text-white [transition:max-height_.5s,opacity_.35s_.1s] motion-reduce:transition-none ${
                            isOpen ? "pointer-events-auto max-h-[240px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
                          }`}
                        >
                          {card.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <span
                          aria-hidden="true"
                          className={`flex shrink-0 items-center gap-2 text-xs text-white opacity-85 ${isOpen ? "hidden" : ""}`}
                        >
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/22 font-bold text-white">
                            +
                          </span>
                          tik om te openen
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <Mountains className="absolute inset-x-0 bottom-0 z-10 h-(--mountain-h)" />
      </div>

      {/* Overgang naar wit: de opdrachtgeversbalk hoort op een witte achtergrond
          te staan, dus het blauw van de bergen lost hier op in wit. */}
      <div aria-hidden="true" className="h-[90px] bg-linear-to-b from-brand-accent to-white" />
    </section>
  );
}
