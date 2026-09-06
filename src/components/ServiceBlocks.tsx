import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "../data/services";

/**
 * Logo's met transparante achtergrond. De optische hoogte verschilt sterk per
 * logo — een breed woordmerk mag lager dan een rond beeldmerk — dus die staat
 * er per stuk bij in plaats van één vaste maat.
 */
const logos = {
  otl: { src: "/logo-one-ticket-left-t.png", name: "ONETICKETLEFT", height: 54 },
  eo: { src: "/logo-eo-t.png", name: "EO", height: 48 },
  tgb: { src: "/logo-tgb-t.png", name: "The Groundbreakers", height: 60 },
  che: { src: "/logo-che-t.png", name: "CHE", height: 64 },
  m410: { src: "/logo-410-mgmt-t.png", name: "410 MGMT Co.", height: 48 },
  spruit: { src: "/logo-bureau-spruit-t.png", name: "Bureau Spruit", height: 54 },
  nji: { src: "/logo-nji-t.png", name: "NJi", height: 46 },
  fair: { src: "/logo-fairspace-t.png", name: "Fairspace", height: 64 },
  div: { src: "/logo-diversiteitsland-t.png", name: "Stichting Diversiteitsland", height: 48 },
  hop: { src: "/logo-hour-of-power-t.png", name: "Hour of Power", height: 56 },
  gat: { src: "/logo-go-and-tell-t.png", name: "Go and Tell", height: 80 },
} as const;

type LogoKey = keyof typeof logos;

type Mark = {
  /** Eén logo, of twee wanneer twee opdrachtgevers hetzelfde project deelden. */
  logos?: LogoKey[];
  /** Project dat nog geen logo heeft; dat wordt een naamkaartje. */
  name?: string;
  project?: string;
  slug?: string;
  role: string;
  /** Optisch groter, voor een blok met maar één opdrachtgever. */
  scale?: number;
  /** Vaste plek in het logoveld: x in procent, y in px. Geen willekeur, anders
   *  levert de prerender een andere pagina op dan de browser. */
  pos: [number, number];
};

const blocks: { rotate: number; marks: Mark[] }[] = [
  {
    rotate: -2,
    marks: [
      { logos: ["spruit", "nji"], project: "DiscoverEU Learning Cycle", slug: "discovereu-learning-cycle", role: "Producer", pos: [0, 44] },
      { logos: ["fair"], project: "#DoeMeeMet5D", slug: "fairspace-doemeemet5d", role: "Eventmanager", pos: [40, 96] },
      { logos: ["div"], project: "Indische Buurt Run 2026", slug: "indische-buurt-run-2026", role: "Projectleider", pos: [68, 36] },
      { logos: ["tgb"], project: "PostNL, Hoog Catharijne & Veronica", slug: "the-groundbreakers-brand-experiences", role: "Project- en eventmanager", pos: [6, 120] },
    ],
  },
  {
    rotate: 1.5,
    marks: [
      { logos: ["otl", "eo"], project: "EO-Jongerendag", slug: "eo-jongerendag", role: "Artiestenbegeleider", pos: [0, 42] },
      { logos: ["che"], project: "CHE70 Festival", slug: "che70-festival", role: "Artiestenbegeleider", pos: [58, 104] },
      { logos: ["tgb"], project: "Oud & Nieuw Utrecht", slug: "oud-en-nieuw-utrecht", role: "Artiestenbegeleider", pos: [62, 30] },
      { logos: ["m410"], project: "The Paper Kites", slug: "the-paper-kites-tourcoordinatie", role: "Tourtransport coördinator", pos: [16, 124] },
    ],
  },
  {
    rotate: -1.2,
    marks: [
      { logos: ["otl", "eo"], project: "EO-Jongerendag", slug: "eo-jongerendag", role: "Artiestenboeker", scale: 1.35, pos: [2, 58] },
    ],
  },
  {
    rotate: 1.8,
    marks: [
      { logos: ["hop"], project: "Hour of Power Live", slug: "hour-of-power-live-2024", role: "Stagemanager", pos: [0, 40] },
      { logos: ["otl"], project: "Crown Events", slug: "crown-events", role: "Stagemanager", pos: [36, 110] },
      { name: "Next-Gen Security Conference", role: "Stagemanager", pos: [62, 34] },
    ],
  },
  {
    rotate: -1.5,
    marks: [
      { logos: ["gat"], project: "Theatertour RAUW", slug: "theatertour-rauw", role: "Showcaller", scale: 1.3, pos: [2, 52] },
    ],
  },
];

/** Zweefduur per logo (s); vier waarden die om en om terugkomen. */
const FLOAT_DURATIONS = [6.4, 7.6, 5.8, 8.2];
/** Spring met overshoot, zoals de logo's die in de mockup komen invliegen. */
const flySpring = { type: "spring" as const, stiffness: 160, damping: 14 };

type BlockState = { on: boolean; gone: boolean };

/**
 * Vijf grote dienstenblokken die als een schuine stapel over elkaar heen
 * schuiven. Zodra een blok in beeld staat draait het recht en komen de logo's
 * van zijn opdrachtgevers één voor één vanuit de foto aanvliegen; schuift het
 * blok weer weg onder het volgende, dan vliegen ze terug.
 */
export default function ServiceBlocks() {
  const prefersReducedMotion = useReducedMotion();
  const reduce = prefersReducedMotion === true;

  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const [states, setStates] = useState<BlockState[]>(() => blocks.map(() => ({ on: false, gone: false })));

  // Meten met getBoundingClientRect in plaats van useScroll: de blokken zijn
  // sticky, en dan is hun plek op het scherm het enige dat klopt.
  //
  // Alles wat van `reduce` afhangt loopt via deze state, niet rechtstreeks via
  // de render. De prerender kent de voorkeur van de bezoeker namelijk niet, en
  // React repareert een style die bij hydration afwijkt niet meer.
  useEffect(() => {
    if (reduce) {
      setStates(blocks.map(() => ({ on: true, gone: false })));
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      setStates((previous) => {
        let changed = false;
        const next = previous.map((state, i) => {
          const el = blockRefs.current[i];
          if (!el) return state;
          const rect = el.getBoundingClientRect();
          // Actief zodra het blok het midden van het venster raakt, en dat
          // blijft het: de stapel bouwt op, hij valt niet weer uit elkaar.
          const on =
            state.on ||
            (rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.35);
          const gone = on && rect.top < -rect.height * 0.35;
          if (on === state.on && gone === state.gone) return state;
          changed = true;
          return { on, gone };
        });
        return changed ? next : previous;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <div className="service-blocks pt-5 pb-[140px]">
      {blocks.map((block, i) => {
        const service = services[i];
        const state = states[i];
        const active = state.on;
        const ice = i % 2 === 1;
        const solo = block.marks.length === 1;

        return (
          <div
            key={service.title}
            className="mb-10 min-[900px]:sticky"
            style={{ top: `${90 + i * 28}px` }}
          >
            {/* Zweven zit op een eigen laag, zodat het niet botst met de rotatie van het blok. */}
            <motion.div
              animate={reduce ? { y: 0 } : { y: [0, -10, 0] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: i * 1.1 }
              }
            >
              <article
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className={`grid min-h-[600px] grid-cols-1 overflow-hidden rounded-[36px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45),0_0_0_1px_#e5e7eb] transition-transform duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none min-[900px]:grid-cols-[44%_1fr] ${
                  ice ? "text-black" : "bg-white text-black"
                }`}
                style={{
                  transform: `rotate(${active ? 0 : block.rotate}deg)`,
                  transformOrigin: "50% 100%",
                  // IJsblauw in plaats van het diepe blauw: zonder kader om de
                  // logo's heeft elk logo een lichte ondergrond nodig.
                  background: ice
                    ? "linear-gradient(160deg, #eaf7fe, #d6eefc 60%, #c3e6fb)"
                    : undefined,
                }}
              >
                <div className="relative min-h-[260px] overflow-hidden min-[900px]:min-h-0">
                  <img
                    src={service.image}
                    alt={service.title.replace(/­/g, "")}
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] motion-reduce:transition-none ${
                      active ? "scale-100" : "scale-105"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-[18px] px-7 py-10 min-[900px]:px-[60px] min-[900px]:pt-[56px] min-[900px]:pb-[52px]">
                  <span
                    className={`font-display text-[12px] font-bold tracking-[0.16em] ${
                      ice ? "text-brand-deep" : "text-brand-accent"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                    {service.isNew && " · NIEUW"}
                  </span>

                  <h2 className="text-[length:clamp(36px,4.2vw,62px)] leading-[0.98] tracking-[-0.03em]">
                    {service.title}
                  </h2>

                  <p
                    className={`max-w-[560px] flex-1 text-[17px] leading-[1.65] ${
                      ice ? "text-[#3f5468]" : "text-gray-600"
                    }`}
                  >
                    {service.description}
                  </p>

                  <div className="orbit">
                    <span
                      className={`absolute left-0 top-0 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        ice ? "text-[#6f8598]" : "text-gray-400"
                      }`}
                    >
                      Deed ik voor o.a.
                    </span>

                    {block.marks.map((mark, j) => (
                      <LogoMark
                        key={mark.project ? `${mark.project}-${mark.role}` : mark.name}
                        mark={mark}
                        index={j}
                        solo={solo}
                        state={state}
                        reduce={reduce}
                      />
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className={`inline-flex items-center gap-2 self-start font-bold outline-offset-4 focus-visible:outline-3 focus-visible:outline-brand-accent ${
                      ice ? "text-brand-deep" : "text-brand-accent"
                    }`}
                  >
                    Bespreek jouw event
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </article>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Eén logo (of een duo) dat vrij op het blok staat: geen kader, alleen een
 * slagschaduw. Het komt vanuit de foto links aanvliegen, zweeft daarna in eigen
 * tempo en toont bij hover het project met de rol.
 */
function LogoMark({ mark, index, solo, state, reduce }: {
  mark: Mark;
  index: number;
  solo: boolean;
  state: BlockState;
  reduce: boolean;
}) {
  const visible = state.on && !state.gone;
  // Elk logo komt van iets verder weg, zodat ze niet als één rij binnenkomen.
  const fly = 520 + index * 50;

  const flyAnimation = visible
    ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
    : state.gone
      ? { opacity: 0, x: -fly, y: 60, rotate: 0, scale: 0.7 }
      : { opacity: 0, x: -fly, y: 40, rotate: -14, scale: 0.7 };

  const content = (
    <>
      <motion.span
        className="flex items-center gap-[14px] [scale:1] transition-[scale] duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:[scale:1.1]"
        animate={reduce ? { y: 0 } : { y: [0, -10, 0] }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: FLOAT_DURATIONS[index % FLOAT_DURATIONS.length],
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 1.5,
              }
        }
      >
        {mark.name ? (
          <span className="max-w-[190px] border-l-[3px] border-brand-accent pl-3 font-display text-[15px] font-bold leading-[1.15] tracking-[-0.01em]">
            {mark.name}
            <small className="mt-[5px] block font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
              {mark.role}
            </small>
          </span>
        ) : (
          mark.logos?.map((key, q) => (
            <span key={key} className="flex items-center gap-[14px]">
              {q > 0 && (
                <span aria-hidden="true" className="font-display text-[13px] font-bold text-gray-400">
                  ×
                </span>
              )}
              <img
                src={logos[key].src}
                alt={logos[key].name}
                draggable={false}
                style={{ height: logos[key].height * (mark.scale ?? 1) }}
                className="w-auto max-w-[190px] object-contain [filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.18))]"
              />
            </span>
          ))
        )}
      </motion.span>

      {mark.project && (
        <span className="mark-label">
          {mark.project}
          <small>{mark.role}</small>
        </span>
      )}
    </>
  );

  const className = `mark group flex items-center gap-[14px] ${solo ? "mark-solo" : ""}`;

  return (
    <motion.div
      className={className}
      style={{ left: `${mark.pos[0]}%`, top: `${mark.pos[1]}px` }}
      initial={false}
      animate={flyAnimation}
      transition={
        reduce
          ? { duration: 0 }
          : { ...flySpring, delay: visible ? 0.18 + index * 0.1 : 0 }
      }
    >
      {/* Zonder projectpagina valt er niets te linken; dan is het puur een naamkaartje. */}
      {mark.slug ? (
        <Link
          to={`/projecten/${mark.slug}`}
          aria-label={`${mark.project} — ${mark.role}`}
          className="flex items-center gap-[14px] rounded-lg outline-offset-8 focus-visible:outline-3 focus-visible:outline-brand-accent"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}
