import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { jubileum } from "../data/jubileum";

/**
 * Hoe vaak de tickertekst per helft wordt herhaald. De strook toont de reeks
 * twee keer achter elkaar; de animatie schuift precies één helft op, waardoor
 * de tekst naadloos blijft doorlopen in plaats van halverwege te stoppen.
 */
const TICKER_HERHALINGEN = 8;

/**
 * De schuifdeur van de jubileumpagina: rechts staat de showreel, en die schuift
 * met de scroll weg en legt de foto van Luca en Tim eronder bloot.
 *
 * De verschuiving loopt via een MotionValue, dus zonder een render per
 * scrollframe. Bij `prefers-reduced-motion` staat het paneel meteen opzij, staat
 * de video stil en vervalt de scrollspoel.
 */
export default function JubileumReveal() {
  const spoelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: spoelRef,
    offset: ["start start", "end end"],
  });

  // De spoel is langer dan de beweging: bij 70% van de spoel staat het paneel
  // al helemaal opzij, zodat de onthulde foto nog even blijft staan.
  const slide = useTransform(scrollYProgress, [0, 0.7], ["0%", "102%"]);

  return (
    <div ref={spoelRef} className={`relative w-full ${prefersReducedMotion ? "" : "md:min-h-[170vh]"}`}>
      <div className={`container mx-auto px-6 ${prefersReducedMotion ? "" : "md:sticky md:top-28"}`}>
        {/* Op mobiel is er geen ruimte voor twee panelen naast elkaar. Daar staat
            alles onder elkaar, zonder schuifdeur en zonder scrollspoel — je ziet
            de video en de foto allebei meteen. */}
        <div className="space-y-6 md:hidden">
          <TekstPaneel className="rounded-[2rem]" />

          <div className="relative h-[50vh] max-h-[380px] min-h-[240px] w-full overflow-hidden rounded-[2rem] bg-black shadow-2xl">
            <ShowreelPaneel />
          </div>

          <div className="relative h-[80vh] max-h-[560px] min-h-[420px] w-full overflow-hidden rounded-[2rem] bg-brand-accent shadow-2xl">
            <OnthuldPaneel />
          </div>
        </div>

        <div className="relative hidden h-[calc(100vh-9rem)] max-h-[660px] min-h-[460px] w-full select-none overflow-hidden rounded-[2.5rem] bg-brand-accent shadow-2xl md:block">
          {/* Laag 0: wat wordt onthuld. */}
          <div className="absolute right-0 top-0 z-0 h-full w-[43%] overflow-hidden bg-brand-accent">
            <OnthuldPaneel />
          </div>

          {/* Laag 1: het vaste zwarte vlak links. */}
          <TekstPaneel className="absolute left-0 top-0 z-10 w-[57%] border-r border-white/10" />

          {/* Laag 2: de showreel, die met de scroll wegschuift. */}
          <motion.div
            style={{ x: prefersReducedMotion ? "102%" : slide }}
            className="absolute right-0 top-0 z-20 h-full w-[43%] overflow-hidden bg-black shadow-2xl"
          >
            <ShowreelPaneel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * De foto van Luca en Tim met de verwijzing naar jubileumevenement.nl. Vult zijn
 * ouder, dus die bepaalt de maat. De tekst staat onderin zodat hij niet over hun
 * gezichten valt.
 */
function OnthuldPaneel() {
  return (
    <>
      <img
        src={jubileum.foto}
        alt={jubileum.fotoAlt}
        className="absolute inset-0 h-full w-full object-cover object-[30%_20%]"
        draggable={false}
      />

      {/* Verloop van onderaf: onderin dekkend blauw voor de tekst, bovenin open
          zodat de foto zelf goed zichtbaar blijft. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-accent from-[42%] via-brand-accent/65 via-[52%] to-brand-accent/0 to-[68%]"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 text-white lg:p-10">
        <span className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
          {jubileum.paneel.eyebrow}
        </span>

        <h2 className="text-2xl font-bold leading-tight lg:text-3xl">{jubileum.paneel.titel}</h2>

        <p className="text-sm leading-relaxed text-white/85 lg:text-base">{jubileum.paneel.tekst}</p>

        <div className="pt-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-block"
          >
            <a
              href={jubileum.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-accent shadow-xl transition-colors hover:brightness-95"
            >
              <span>{jubileum.paneel.knop}</span>
              <ExternalLink
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}

/**
 * Het zwarte vlak met de kop en de intro. `className` bepaalt waar het staat:
 * op mobiel gewoon in de stroom, op groot scherm absoluut links.
 */
function TekstPaneel({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-full flex-col justify-between overflow-hidden bg-brand-primary p-10 text-white shadow-2xl lg:p-14 ${className ?? ""}`}
    >
      <div className="max-w-[520px] space-y-8">
        <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-brand-accent">
          {jubileum.eyebrow}
        </span>

        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
          {jubileum.titelDeel1}
          <span className="inline-block rounded-2xl bg-brand-accent px-3 pb-1 text-white">
            {jubileum.titelAccent}
          </span>
          {jubileum.titelDeel2}
        </h1>

        <p className="max-w-[400px] text-base leading-relaxed text-gray-400 lg:text-lg">
          {jubileum.intro}
        </p>
      </div>

      <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/10 pt-8">
        <a
          href={jubileum.site}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <img
            src={jubileum.partnerLogo}
            alt={jubileum.partnerLogoAlt}
            className="h-[26px] w-auto object-contain"
            draggable={false}
          />
          <span className="sr-only">Naar {jubileum.partnerLogoAlt}</span>
        </a>

        <span className="hidden shrink-0 font-display text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:block">
          {jubileum.samenMet}
        </span>
      </div>
    </div>
  );
}

/** De showreel met de balk naar jubileumevenement.nl. Vult zijn ouder. */
function ShowreelPaneel() {
  return (
    <>
      <VerticaleTicker />

      <div className="relative h-full w-full bg-black">
        <Showreel />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
        />

        <a
          href={jubileum.site}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute bottom-0 left-0 right-0 z-30 flex h-[56px] items-center justify-between bg-brand-accent px-8 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:brightness-110"
        >
          <span>{jubileum.balkTekst}</span>
          <ArrowRight
            className="h-[18px] w-[18px] shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * De showreel. Hij laadt pas als het paneel in beeld komt, want het bestand is
 * fors, en hij staat stil bij `prefers-reduced-motion`; dan blijft het
 * posterframe staan.
 */
function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(videoRef, { margin: "200px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView && !prefersReducedMotion) {
      // `play()` geeft een promise die afketst als de browser het weigert.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, prefersReducedMotion]);

  return (
    <video
      ref={videoRef}
      src={jubileum.showreel}
      poster={jubileum.showreelPoster}
      aria-label={jubileum.showreelAlt}
      muted
      loop
      playsInline
      preload="none"
      className="h-full w-full object-cover brightness-95"
    />
  );
}

/**
 * De verticale strook langs de linkerrand van het paneel. De reeks staat er twee
 * keer; de animatie schuift precies één helft op, zodat de tekst naadloos blijft
 * doorlopen.
 */
function VerticaleTicker() {
  const reeks = Array.from({ length: TICKER_HERHALINGEN * 2 }, (_, index) => index);

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 top-0 z-30 flex w-[28px] flex-col border-r border-white/10 bg-black/90"
    >
      <div className="h-[22px] w-full shrink-0 border-b border-white/10 bg-black" />

      <div className="relative w-full flex-1 overflow-hidden">
        <div className="animate-vertical-ticker absolute left-1/2 top-0 -translate-x-1/2">
          <span className="block whitespace-nowrap font-display text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent [writing-mode:vertical-rl]">
            {reeks.map((index) => (
              <span key={index}>{jubileum.tickerTekst}&nbsp;&nbsp;</span>
            ))}
          </span>
        </div>
      </div>

      <div className="h-[22px] w-full shrink-0 border-t border-white/10 bg-black" />
    </div>
  );
}
