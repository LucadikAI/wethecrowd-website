import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/projects";

const springCard = { type: "spring" as const, stiffness: 200, damping: 20 };

/** Zes projecten in de schijnwerper; de rest staat op /projecten. */
const featuredProjects = projects.slice(0, 6);

/** Zolang staat een project in beeld voordat het volgende komt (ms). Ook de duur van het balkje. */
const SLIDE_MS = 6000;
/** Springt de teller na een tabwissel verder dan dit (ms), dan tellen we die tijd niet mee. */
const MAX_FRAME_MS = 250;
/** Vanaf deze horizontale verplaatsing (px) telt een veeg op de spot als bladeren. */
const SWIPE_THRESHOLD = 50;

/** Verloop van links naar rechts, zodat de tekst linksonder op elke foto leesbaar blijft. */
const SPOT_SHADE = "linear-gradient(to right, rgba(0,0,0,.78), rgba(0,0,0,.35) 50%, rgba(0,0,0,.05))";

/**
 * Eén project beeldvullend in de schijnwerper, met een strip van zes thumbnails
 * eronder. Wisselt vanzelf elke zes seconden; hover met de muis op de spot
 * pauzeert, hover of klik op een thumbnail springt er direct heen. Bij
 * verminderde beweging staat alles stil en blader je alleen met een klik.
 */
export default function FeaturedProjects() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduce = prefersReducedMotion === true;
  const touchStartX = useRef<number | null>(null);

  const total = featuredProjects.length;
  const go = (next: number) => setActive((next + total) % total);

  // Het balkje en het doorschakelen lopen op dezelfde teller. Eerder was dat
  // een setTimeout naast een losse CSS-animatie: pauzeerde de timer, dan liep
  // het balkje gewoon vol zonder dat er iets wisselde.
  const progress = useMotionValue(0);
  const barWidth = useTransform(progress, (p) => `${p * 100}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || paused) return;
    // Na een tabwissel levert de eerste frame een sprong van seconden op; die
    // zou meteen een slide doorspoelen.
    if (delta > MAX_FRAME_MS) return;
    const next = progress.get() + delta / SLIDE_MS;
    if (next < 1) {
      progress.set(next);
      return;
    }
    progress.set(0);
    setActive((i) => (i + 1) % total);
  });

  // Handmatig bladeren zet de zes seconden opnieuw op nul.
  useEffect(() => {
    progress.set(0);
  }, [active, progress]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const delta = start - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(active + (delta > 0 ? 1 : -1));
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={springCard}
          >
            <h2 className="text-4xl md:text-5xl font-bold">Knallers van projecten</h2>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/projecten"
              className="text-brand-accent font-bold flex items-center gap-2 group"
            >
              Bekijk alle projecten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* De spot zelf: alle zes de slides liggen op elkaar, alleen de actieve is zichtbaar. */}
        <div
          className="relative h-[clamp(460px,54vw,640px)] overflow-hidden rounded-[36px] bg-[#111] text-white"
          onPointerEnter={(e) => { if (e.pointerType === "mouse") setPaused(true); }}
          onPointerLeave={(e) => { if (e.pointerType === "mouse") setPaused(false); }}
          onPointerCancel={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {featuredProjects.map((project, i) => {
            const isActive = i === active;

            return (
              <div
                key={project.slug}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-[800ms] motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  // Ken Burns via motion-safe: de prerender weet niet of de bezoeker
                  // beweging beperkt, dus die keuze hoort in CSS en niet in de render.
                  className={`absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[6000ms] motion-safe:ease-linear ${
                    isActive ? "motion-safe:scale-100" : "motion-safe:scale-[1.06]"
                  }`}
                />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: SPOT_SHADE }} />

                <span
                  aria-hidden="true"
                  className="absolute right-10 top-7 font-display font-bold leading-none tracking-[-0.05em] text-white/[.14] text-[length:clamp(80px,12vw,160px)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {project.photoCredit && (
                  <span className="absolute bottom-3 right-5 select-none text-[10px] font-medium text-white/45">
                    © {project.photoCredit}
                  </span>
                )}

                <div
                  className={`absolute bottom-0 left-0 max-w-[640px] px-[48px] py-[44px] transition-[opacity,transform] duration-700 delay-200 motion-reduce:transition-none ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em]">
                    <span className="font-bold text-brand-glacier">{project.role}</span>{" "}
                    <span className="font-medium text-white/60">· {project.client}</span>
                  </p>
                  <h3 className="mt-3 mb-3.5 font-bold leading-none text-[length:clamp(30px,3.4vw,50px)]">
                    {project.title}
                  </h3>
                  <p className="mb-[22px] text-[16px] leading-[1.6] text-white/82">{project.impact}</p>
                  <Link
                    to={`/projecten/${project.slug}`}
                    tabIndex={isActive ? 0 : -1}
                    className="group/link inline-flex items-center gap-2 text-[15px] font-bold text-white outline-offset-4 focus-visible:outline-3 focus-visible:outline-brand-accent"
                  >
                    Bekijk project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thumbnailstrip: springen naar een project en tegelijk de teller van zes seconden. */}
        <div className="mt-[18px] grid grid-cols-3 gap-[14px] md:grid-cols-6">
          {featuredProjects.map((project, i) => {
            const isActive = i === active;

            return (
              <button
                key={project.slug}
                type="button"
                aria-current={isActive}
                aria-label={`Toon ${project.title}`}
                onClick={() => setActive(i)}
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }}
                className={`relative aspect-[16/10] cursor-pointer overflow-hidden rounded-[16px] transition-opacity duration-300 outline-brand-accent outline-offset-2 focus-visible:outline-3 ${
                  isActive ? "opacity-100 outline-3" : "opacity-55 hover:opacity-90"
                }`}
              >
                <img
                  src={project.image}
                  alt=""
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span
                  // Rechts begrensd en afbreekbaar: op drie kolommen past een lange
                  // projectnaam anders niet in de thumbnail.
                  className="absolute bottom-2.5 left-3 right-3 text-left text-[12px] font-bold text-white [overflow-wrap:anywhere]"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,.6)" }}
                >
                  {project.title}
                </span>
                {/* Balkje loopt mee met dezelfde teller die doorschakelt, dus het staat
                    stil zodra de spot gepauzeerd is en het loopt nooit voor of achter. */}
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    style={{ width: barWidth }}
                    className="absolute bottom-0 left-0 h-[3px] bg-brand-accent motion-reduce:hidden"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
