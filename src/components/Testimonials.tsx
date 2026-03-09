import { motion, useMotionValue, animate, useTransform, useReducedMotion, useInView } from "motion/react";
import { Quote } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Giselle Koning",
    company: "Creatief directeur & partner @ The Groundbreakers",
    text: "Luca is iemand waar je op kunt bouwen. Hij komt goed voorbereid, begrijpt het concept en neemt zijn verantwoordelijkheid. Ook onder druk blijft hij rustig en houdt hij overzicht, waardoor je op hem kunt vertrouwen op belangrijke momenten.",
    image: "/testimonial-giselle.jpg",
    linkedin: "https://www.linkedin.com/in/giselle-koning-a8891424/"
  },
  {
    id: 4,
    name: "Joram Kaat",
    company: "Presentator & Creative @ EO",
    text: "Luca heeft sowieso de skills en expertise, maar bovenal - en dat maakt het verschil - enorme passie voor zijn werk. En dat voel je in alles! Fijn om mee samen te werken.",
    image: "/testimonial-joram.jpg",
    linkedin: "https://www.linkedin.com/in/joramkaat/"
  },
  {
    id: 3,
    name: "Laura Adèr",
    company: "Co-Founder & Executive Director @ Fairspace",
    text: "De samenwerking met Luca was ontzettend prettig. Met zijn oog voor detail, ruime ervaring en het vermogen om onder tijdsdruk het overzicht te bewaren, zorgt hij ervoor dat je een sterk en professioneel event neerzet.",
    image: "/testimonial-laura.jpg",
    linkedin: "https://www.linkedin.com/in/lauraader/"
  },
  {
    id: 5,
    name: "Tim Dik",
    company: "Eigenaar @ ONETICKETLEFT",
    text: "Luca is altijd 'on top of things' als hij met of voor mij werkt. Hij houdt mij scherp, is taakgericht en pro-actief en zet zijn kennis van trends en de nieuwste tools in voor onze gezamenlijke passie: top evenementen organiseren.",
    image: "/testimonial-tim.jpg",
    linkedin: "https://www.linkedin.com/in/timdik/"
  },
  {
    id: 6,
    name: "Karlijn Eickmans",
    company: "Eventmanager @ DigiQuest Amsterdam",
    text: "Mijn ervaring met Luca is super prettig: gestructureerd, oog voor detail, blijft ontspannen en helder onder druk, gezellig en voldoende ervaring om met een gerust hart verantwoordelijkheden over te dragen.",
    image: "/testimonial-karlijn.jpg",
    linkedin: "https://www.linkedin.com/in/karlijneickmans/"
  },
  {
    id: 7,
    name: "Jaouad Najih",
    company: "Trainer @ Janaflexx",
    text: "Tijdens onze samenwerking had Luca als eventmanager alles tot in de puntjes geregeld. Zijn sterke voorbereiding in combinatie met het vermogen om tijdens het event flexibel te schakelen, maakte de samenwerking bijzonder prettig. Bovendien is Luca een prettige en positieve persoon om mee samen te werken.",
    image: "/testimonial-jaouad.jpg",
    linkedin: "https://www.linkedin.com/in/jaouad-najih-b525b3166/"
  },
  {
    id: 8,
    name: "Jojanneke Hendriks",
    company: "Social impact campaigner",
    text: "Werken met Luca is een feestje! Hij denkt proactief, werkt professioneel en zorgt dat alles perfect geregeld is. Betrouwbaar, positief en altijd vol energie om er iets moois van te maken.",
    image: "/testimonial-jojanneke.jpg",
    linkedin: "https://www.linkedin.com/in/jojanneke-hendriks-3454ba6/"
  },
  {
    id: 9,
    name: "Madelief Tuinhout",
    company: "Eigenaar @ Bloei",
    text: "Luca is proactief, sociaal en zichtbaar gepassioneerd over zijn werk, wat sterk naar voren komt in de samenwerking. Hij denkt actief mee, brengt nieuwe ideeën in en zet graag dat extra stapje om het geheel nóg beter te maken.",
    image: "/testimonial-madelief.jpg",
    linkedin: "https://www.linkedin.com/in/madelief-tuinhout-027990205/"
  },
  {
    id: 10,
    name: "Bas Wierikx",
    company: "Eigenaar & creatief projectleider @ Bureau Spruit",
    text: "Ik werk graag met Luca. Hij is proactief en denkt in mogelijkheden. Daardoor ziet hij vaak al oplossingen voordat er een probleem ontstaat. Dat zorgt voor rust en overzicht. Zo blijft er ruimte voor aandacht voor details.",
    image: "/testimonial-bas.jpg",
    linkedin: "https://www.linkedin.com/in/baswierikx/"
  },
];

interface TestimonialsProps {
  showTitle?: boolean;
  desktopLayout?: 'grid' | 'marquee';
}

export default function Testimonials({ showTitle = true, desktopLayout = 'grid' }: TestimonialsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const progressValue = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTouching = useRef(false);
  const touchStartClientX = useRef(0);
  const xAtTouchStart = useRef(0);
  const halfWidth = useRef(0);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);
  const progressControl = useRef<ReturnType<typeof animate> | null>(null);

  const indicatorLeft = useTransform(progressValue, [0, 1], ["0%", "75%"]);

  const startInfiniteLoop = () => {
    const hw = halfWidth.current;
    animControl.current?.stop();
    progressControl.current?.stop();
    animControl.current = animate(x, [0, -hw], {
      duration: 30, repeat: Infinity, ease: "linear",
    });
    progressControl.current = animate(progressValue, [0, 1], {
      duration: 30, repeat: Infinity, ease: "linear",
    });
  };

  const resumeFromPosition = (fromX: number) => {
    const hw = halfWidth.current;
    if (!hw) return;
    animControl.current?.stop();
    progressControl.current?.stop();

    let normalized = fromX % -hw;
    if (normalized > 0) normalized -= hw;
    x.set(normalized);

    const fraction = Math.abs(normalized) / hw;
    if (fraction === 0) { startInfiniteLoop(); return; }

    const remaining = 30 * (1 - fraction);
    progressValue.set(fraction);

    animControl.current = animate(x, -hw, {
      duration: remaining, ease: "linear",
      onComplete: () => {
        if (!isTouching.current) {
          x.set(0);
          startInfiniteLoop();
        }
      },
    });
    progressControl.current = animate(progressValue, 1, {
      duration: remaining, ease: "linear",
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackRef.current) {
        halfWidth.current = trackRef.current.scrollWidth / 2;
        startInfiniteLoop();
      }
    });
    return () => { animControl.current?.stop(); progressControl.current?.stop(); };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouching.current = true;
    touchStartClientX.current = e.touches[0].clientX;
    xAtTouchStart.current = x.get();
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartClientX.current;
    const newX = xAtTouchStart.current + delta;
    x.set(newX);
    const hw = halfWidth.current;
    if (hw) {
      let n = newX % -hw;
      if (n > 0) n -= hw;
      progressValue.set(Math.abs(n) / hw);
    }
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    resumeFromPosition(x.get());
  };

  // Mouse pause/resume for desktop
  const handleMouseEnter = () => {
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleMouseLeave = () => {
    if (!isTouching.current) {
      resumeFromPosition(x.get());
    }
  };

  const MarqueeCard = ({ t }: { t: typeof testimonials[0] }) => (
    <div className="w-[280px] md:w-[320px] shrink-0 bg-gray-50 p-6 rounded-3xl flex flex-col relative">
      <Quote className="absolute top-5 right-5 w-6 h-6 text-brand-accent opacity-10" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
          {t.image ? (
            <img src={t.image} alt={t.name} className={`w-full h-full object-cover ${t.id === 7 ? 'object-center scale-[1.2]' : 'object-top'}`} referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-brand-accent flex items-center justify-center text-white font-bold text-xs">
              {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
          )}
        </div>
        <div>
          {t.linkedin ? (
            <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-block">
              <h4 className="font-bold text-sm leading-tight group-hover:underline group-hover:text-brand-accent transition-colors">{t.name}</h4>
            </a>
          ) : (
            <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
          )}
          <p className="text-[10px] text-gray-500 leading-tight">{t.company}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 italic leading-relaxed hyphens-auto">{t.text}</p>
    </div>
  );

  return (
    <section className="py-24 bg-white overflow-hidden">

      {/* Title — inside container */}
      {showTitle && (
        <div className="container mx-auto px-6 mb-16">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">Wat anderen zeggen over de energie van <span className="text-brand-accent">WE</span> THE CROWD</h2>
          </motion.div>
        </div>
      )}

      {/* Marquee — full bleed, mobile always + desktop when desktopLayout === 'marquee' */}
      <div
        className={desktopLayout === 'marquee' ? '' : 'md:hidden'}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-4 w-max pl-6"
        >
          {[...testimonials, ...testimonials].map((t, index) => (
            <MarqueeCard key={index} t={t} />
          ))}
        </motion.div>
        <div className="relative mt-5 mx-auto w-32 h-1 rounded-full bg-gray-200">
          <motion.div
            className="absolute top-0 left-0 h-full w-1/4 rounded-full bg-brand-accent"
            style={{ left: indicatorLeft }}
          />
        </div>
        <p className="text-center text-[12px] text-gray-400 italic mt-3">
          Houd vast om te pauzeren · Swipe om te bladeren
        </p>
      </div>

      {/* Desktop grid — 2 rows of 4, inside container */}
      {desktopLayout === 'grid' && (
        <DesktopGrid
          testimonials={testimonials}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

    </section>
  );
}

// Separate component so useInView ref attaches to the mounted grid element
interface DesktopGridProps {
  testimonials: { id: number; name: string; company: string; text: string; image: string; linkedin: string }[];
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  prefersReducedMotion: boolean | null;
}

function DesktopGrid({ testimonials, hoveredId, setHoveredId, prefersReducedMotion }: DesktopGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <div className="container mx-auto px-6">
      <div ref={gridRef} className="hidden md:grid md:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -40 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, x: 0 }
                : isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -40 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: prefersReducedMotion ? 0 : index * 0.3 }}
            onMouseEnter={() => setHoveredId(t.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`bg-gray-50 p-8 rounded-3xl relative transition-all duration-500 flex flex-col h-full ${
              hoveredId !== null && hoveredId !== t.id ? "opacity-40 blur-[2px] scale-95" : "opacity-100 scale-100"
            } ${hoveredId === t.id ? "scale-105 shadow-xl z-10 bg-white" : ""}`}
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-accent opacity-10" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0">
                {t.image ? (
                  <img src={t.image} alt={t.name} className={`w-full h-full object-cover ${t.id === 7 ? 'object-center scale-[1.2]' : 'object-top'}`} referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand-accent flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                {t.linkedin ? (
                  <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="group/name inline-block">
                    <h4 className="font-bold text-sm leading-tight group-hover/name:underline group-hover/name:text-brand-accent transition-colors">{t.name}</h4>
                  </a>
                ) : (
                  <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
                )}
                <p className="text-[10px] text-gray-500 leading-tight">{t.company}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed flex-1 hyphens-auto">
              {t.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
