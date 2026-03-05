import { motion, useMotionValue, animate } from "motion/react";
import { ArrowRight, Zap, Users, Layout, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import LogoSlider from "../components/LogoSlider";
import ServiceFlow from "../components/ServiceFlow";

const services = [
  {
    title: "Eventmanagement / Productie",
    icon: <Layout className="w-7 h-7 md:w-8 md:h-8" />,
    image: "/dienst-eventmanagement.jpg",
    imagePosition: "object-bottom",
    description: "Van eerste briefing tot laatste afbouwmoment. Ik vertaal ideeën naar concrete draaiboeken, zorg voor heldere briefings richting crew en leveranciers en bewaak planning, budget en kwaliteit. Of het nu gaat om locatiecoördinatie, technische afstemming of overall productie-aansturing: ik zorg dat alle onderdelen samenkomen in één kloppend geheel."
  },
  {
    title: "Artiestenbegeleiding",
    icon: <Users className="w-7 h-7 md:w-8 md:h-8" />,
    image: "/dienst-artiesten.jpg",
    imagePosition: "object-bottom",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote venues, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Stagemanagement",
    icon: <Zap className="w-7 h-7 md:w-8 md:h-8" />,
    image: "/dienst-stagemanagement.jpg",
    imagePosition: "object-bottom",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    icon: <Mic2 className="w-7 h-7 md:w-8 md:h-8" />,
    image: "/dienst-showcalling.jpg",
    imagePosition: "object-bottom",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];

const DURATION = 25; // seconds per loop

export default function Services() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Marquee position
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);

  // Interaction state
  const isPaused = useRef(false);
  const isMouseHovering = useRef(false);
  const isMouseDragging = useRef(false);
  const mouseStartX = useRef(0);
  const touchStartX = useRef(0);
  const xAtInteractionStart = useRef(0);

  // Progress bar — CSS animation for truly seamless infinite loop
  const [barKey, setBarKey] = useState(0);
  const [barDelay, setBarDelay] = useState(0);
  const [barPaused, setBarPaused] = useState(false);
  const [barMode, setBarMode] = useState<"css" | "static">("static");
  const [barLeft, setBarLeft] = useState("0%");

  const getBarLeft = (xVal: number): string => {
    const hw = halfWidth.current;
    if (!hw) return "0%";
    let n = xVal % -hw;
    if (n > 0) n -= hw;
    return `${(Math.abs(n) / hw) * 75}%`;
  };

  const startInfiniteLoop = () => {
    const hw = halfWidth.current;
    if (!hw) return;
    animControl.current?.stop();
    animControl.current = animate(x, [0, -hw], {
      duration: DURATION, repeat: Infinity, ease: "linear",
    });
    setBarDelay(0);
    setBarKey(k => k + 1);
    setBarMode("css");
    setBarPaused(false);
  };

  const resumeFromPosition = (fromX: number) => {
    const hw = halfWidth.current;
    if (!hw) return;
    animControl.current?.stop();

    let normalized = fromX % -hw;
    if (normalized > 0) normalized -= hw;
    x.set(normalized);

    const fraction = Math.abs(normalized) / hw;
    if (fraction === 0) { startInfiniteLoop(); return; }

    const remaining = DURATION * (1 - fraction);

    animControl.current = animate(x, -hw, {
      duration: remaining, ease: "linear",
      onComplete: () => {
        if (!isPaused.current) {
          x.set(0);
          startInfiniteLoop();
        }
      },
    });

    setBarDelay(-(fraction * DURATION));
    setBarKey(k => k + 1);
    setBarMode("css");
    setBarPaused(false);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackRef.current) {
        halfWidth.current = trackRef.current.scrollWidth / 2;
        startInfiniteLoop();
      }
    });
    return () => animControl.current?.stop();
  }, []);

  // Window-level mouse drag events
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDragging.current) return;
      const delta = e.clientX - mouseStartX.current;
      const newX = xAtInteractionStart.current + delta;
      x.set(newX);
      setBarLeft(getBarLeft(newX));
    };

    const onMouseUp = () => {
      if (!isMouseDragging.current) return;
      isMouseDragging.current = false;
      if (isMouseHovering.current) {
        // Still hovering after drag: stay paused at current position
        setBarMode("static");
        setBarLeft(getBarLeft(x.get()));
      } else {
        isPaused.current = false;
        resumeFromPosition(x.get());
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleMouseEnter = () => {
    isMouseHovering.current = true;
    isPaused.current = true;
    animControl.current?.pause?.();
    setBarPaused(true);
  };

  const handleMouseLeave = () => {
    isMouseHovering.current = false;
    if (isMouseDragging.current) return;
    isPaused.current = false;
    animControl.current?.play?.();
    setBarPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isMouseDragging.current = true;
    mouseStartX.current = e.clientX;
    xAtInteractionStart.current = x.get();
    animControl.current?.stop();
    setBarMode("static");
    setBarLeft(getBarLeft(x.get()));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isPaused.current = true;
    touchStartX.current = e.touches[0].clientX;
    xAtInteractionStart.current = x.get();
    animControl.current?.stop();
    setBarMode("static");
    setBarLeft(getBarLeft(x.get()));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    const newX = xAtInteractionStart.current + delta;
    x.set(newX);
    setBarLeft(getBarLeft(newX));
  };

  const handleTouchEnd = () => {
    isPaused.current = false;
    resumeFromPosition(x.get());
  };

  const barIndicatorStyle: React.CSSProperties = barMode === "css"
    ? {
        animation: `servicesProgressBar ${DURATION}s ${barDelay}s linear infinite`,
        animationPlayState: barPaused ? "paused" : "running",
      }
    : { left: barLeft };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Van idee tot impact.</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ik kan je op verschillende manieren helpen. Geen standaard lijstjes, maar gerichte ondersteuning waar het telt.
          </p>
        </div>
      </div>

      {/* Full-width marquee — outside container for edge-to-edge */}
      <div className="mb-24">
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-4 w-max pl-4"
          >
            {[...services, ...services].map((service, index) => {
              const serviceIndex = index % services.length;
              const isActive = activeCard === serviceIndex;
              return (
                <div
                  key={index}
                  onClick={() => !isMouseDragging.current && setActiveCard(isActive ? null : serviceIndex)}
                  className="relative rounded-[2rem] overflow-hidden group shadow-lg shrink-0 cursor-pointer w-[calc(50vw-16px)] h-[300px] md:w-[calc(33.333vw-16px)] md:h-[380px]"
                >

                  {/* Background Image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isActive ? "scale-110" : ""} ${service.imagePosition}`}
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />

                  {/* Dark Overlay */}
                  <div className={`absolute inset-0 transition-colors duration-500 group-hover:bg-black/75 ${isActive ? "bg-black/75" : "bg-black/30"}`} />

                  {/* Default state: title at bottom */}
                  <div className={`absolute inset-x-0 bottom-0 p-4 md:p-8 transition-opacity duration-300 group-hover:opacity-0 ${isActive ? "opacity-0" : "opacity-100"}`}>
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center mb-2 md:mb-3">
                      {service.icon}
                    </div>
                    <h3 className="text-lg md:text-3xl font-bold text-white leading-tight">{service.title}</h3>
                  </div>

                  {/* Hover/tap state */}
                  <div className={`absolute inset-0 p-4 md:p-8 flex flex-col justify-start transition-opacity duration-500 group-hover:opacity-100 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center mb-2 md:mb-3 shrink-0">
                      {service.icon}
                    </div>
                    <h3 className="text-sm md:text-xl font-bold text-white mb-2 md:mb-3 leading-tight shrink-0">{service.title}</h3>
                    <div className="w-8 h-[2px] md:w-10 md:h-1 bg-brand-accent rounded-full mb-2 md:mb-3 shrink-0" />
                    <p className="text-white/90 text-[11px] md:text-sm leading-relaxed overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 7, WebkitBoxOrient: "vertical" as const }}>
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-6 mx-auto w-32 h-1 rounded-full bg-gray-200">
          <div
            key={barKey}
            className="absolute top-0 left-0 h-full w-1/4 rounded-full bg-brand-accent"
            style={barIndicatorStyle}
          />
        </div>
        <p className="text-center text-[12px] text-gray-400 italic mt-3">
          Houd vast om te pauzeren · Swipe om te bladeren
        </p>
      </div>

      <LogoSlider showTitle={false} />

      <div className="container mx-auto px-6">
        <ServiceFlow />

        <div className="bg-brand-accent text-white p-12 md:p-20 rounded-[3rem] text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Klaar om jouw event naar een hoger niveau te tillen?</h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-accent rounded-full font-bold text-xl hover:scale-105 transition-transform"
          >
            Bespreek jouw event
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
