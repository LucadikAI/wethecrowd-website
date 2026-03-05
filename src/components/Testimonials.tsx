import { motion, useMotionValue, animate, useTransform } from "motion/react";
import { Quote } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Giselle Koning",
    company: "Creatief directeur & partner @ The Groundbreakers",
    text: "Luca is iemand waar je op kunt bouwen. Hij komt goed voorbereid, begrijpt het concept en neemt zijn verantwoordelijkheid. Ook onder druk blijft hij rustig en houdt hij overzicht, waardoor je op hem kunt vertrouwen op belangrijke momenten.",
    image: "/testimonial-giselle.jpg"
  },
  {
    id: 4,
    name: "Joram Kaat",
    company: "Presentator & Creative @ EO",
    text: "Luca heeft sowieso de skills en expertise, maar bovenal - en dat maakt het verschil - enorme passie voor zijn werk. En dat voel je in alles! Fijn om mee samen te werken.",
    image: "/testimonial-joram.jpg"
  },
  {
    id: 3,
    name: "Laura Adèr",
    company: "Co-Founder & Executive Director @ Fairspace",
    text: "De samenwerking met Luca was ontzettend prettig. Met zijn oog voor detail, ruime ervaring en het vermogen om onder tijdsdruk het overzicht te bewaren, zorgt hij ervoor dat je een sterk en professioneel event neerzet.",
    image: "/testimonial-laura.jpg"
  },
  {
    id: 5,
    name: "Tim Dik",
    company: "Eigenaar @ ONETICKETLEFT",
    text: "Luca is altijd 'on top of things' als hij met of voor mij werkt. Hij houdt mij scherp, is taakgericht en pro-actief en zet zijn kennis van trends en de nieuwste tools in voor onze gezamenlijke passie: top evenementen organiseren.",
    image: "/testimonial-tim.jpg"
  }
];

interface TestimonialsProps {
  showTitle?: boolean;
}

export default function Testimonials({ showTitle = true }: TestimonialsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Mobile marquee: touch-interactive
  const x = useMotionValue(0);
  const progressValue = useMotionValue(0); // 0–1, drives the indicator independently
  const trackRef = useRef<HTMLDivElement>(null);
  const isTouching = useRef(false);
  const touchStartClientX = useRef(0);
  const xAtTouchStart = useRef(0);
  const halfWidth = useRef(0);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);
  const progressControl = useRef<ReturnType<typeof animate> | null>(null);

  const indicatorLeft = useTransform(progressValue, [0, 1], ["0%", "75%"]);

  // Seamless infinite loop using repeat: Infinity — no onComplete reset needed
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

  // Resume from a mid-loop position after a swipe
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

    // Complete current segment, then hand off to seamless infinite loop
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
    // Keep progress bar in sync during drag
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

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {showTitle && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Wat anderen zeggen over de energie van WE THE CROWD</h2>
          </div>
        )}

        {/* Mobile: horizontal auto-scrolling marquee with touch support */}
        <div
          className="md:hidden -mx-6 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-4 w-max pl-6"
          >
            {[...testimonials, ...testimonials].map((t, index) => (
              <div
                key={index}
                className="w-[280px] shrink-0 bg-gray-50 p-6 rounded-3xl flex flex-col relative"
              >
                <Quote className="absolute top-5 right-5 w-6 h-6 text-brand-accent opacity-10" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-brand-accent flex items-center justify-center text-white font-bold text-xs">
                        {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 leading-tight">{t.company}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed hyphens-auto">{t.text}</p>
              </div>
            ))}
          </motion.div>
          {/* Progress bar + hint — mobile only */}
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

        {/* Desktop: 4-column grid with hover effect */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-brand-accent flex items-center justify-center text-white font-bold text-sm">
                      {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
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
    </section>
  );
}
