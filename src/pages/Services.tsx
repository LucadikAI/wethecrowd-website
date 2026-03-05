import { motion, useMotionValue, animate, useTransform } from "motion/react";
import { ArrowRight, Zap, Users, Layout, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import LogoSlider from "../components/LogoSlider";
import ServiceFlow from "../components/ServiceFlow";

const services = [
  {
    title: "Eventmanagement / Productie",
    icon: <Layout className="w-8 h-8" />,
    image: "/dienst-eventmanagement.jpg",
    imagePosition: "object-bottom",
    description: "Van eerste briefing tot laatste afbouwmoment. Ik vertaal ideeën naar concrete draaiboeken, zorg voor heldere briefings richting crew en leveranciers en bewaak planning, budget en kwaliteit. Of het nu gaat om locatiecoördinatie, technische afstemming of overall productie-aansturing: ik zorg dat alle onderdelen samenkomen in één kloppend geheel."
  },
  {
    title: "Artiestenbegeleiding",
    icon: <Users className="w-8 h-8" />,
    image: "/dienst-artiesten.jpg",
    imagePosition: "object-bottom",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote venues, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Stagemanagement",
    icon: <Zap className="w-8 h-8" />,
    image: "/dienst-stagemanagement.jpg",
    imagePosition: "object-bottom",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    icon: <Mic2 className="w-8 h-8" />,
    image: "/dienst-showcalling.jpg",
    imagePosition: "object-bottom",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];

export default function Services() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Auto-scroll marquee
  const x = useMotionValue(0);
  const progressValue = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const touchStartClientX = useRef(0);
  const xAtPauseStart = useRef(0);
  const halfWidth = useRef(0);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);
  const progressControl = useRef<ReturnType<typeof animate> | null>(null);

  const indicatorLeft = useTransform(progressValue, [0, 1], ["0%", "75%"]);

  const startInfiniteLoop = () => {
    const hw = halfWidth.current;
    animControl.current?.stop();
    progressControl.current?.stop();
    animControl.current = animate(x, [0, -hw], {
      duration: 25, repeat: Infinity, ease: "linear",
    });
    progressControl.current = animate(progressValue, [0, 1], {
      duration: 25, repeat: Infinity, ease: "linear",
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

    const remaining = 25 * (1 - fraction);
    progressValue.set(fraction);

    animControl.current = animate(x, -hw, {
      duration: remaining, ease: "linear",
      onComplete: () => {
        if (!isPaused.current) {
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

  // Desktop: pause on hover
  const handleMouseEnter = () => {
    isPaused.current = true;
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
    resumeFromPosition(x.get());
  };

  // Mobile: pause + swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    isPaused.current = true;
    touchStartClientX.current = e.touches[0].clientX;
    xAtPauseStart.current = x.get();
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartClientX.current;
    const newX = xAtPauseStart.current + delta;
    x.set(newX);
    const hw = halfWidth.current;
    if (hw) {
      let n = newX % -hw;
      if (n > 0) n -= hw;
      progressValue.set(Math.abs(n) / hw);
    }
  };

  const handleTouchEnd = () => {
    isPaused.current = false;
    resumeFromPosition(x.get());
  };

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

        <div className="mb-24">
          {/* Marquee container — break out of px-6 padding to go edge-to-edge */}
          <div
            className="-mx-6 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-6 w-max pl-6"
            >
              {[...services, ...services].map((service, index) => {
                const serviceIndex = index % services.length;
                const isActive = activeCard === serviceIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setActiveCard(isActive ? null : serviceIndex)}
                    className="relative aspect-[4/5] md:aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-lg shrink-0 cursor-pointer w-[260px] md:w-[400px]"
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
                    <div className={`absolute inset-x-0 bottom-0 p-5 md:p-8 transition-opacity duration-300 group-hover:opacity-0 ${isActive ? "opacity-0" : "opacity-100"}`}>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center mb-3">
                        {service.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h3>
                    </div>

                    {/* Hover/tap state: title top, description below */}
                    <div className={`absolute inset-0 p-5 md:p-8 flex flex-col justify-start transition-opacity duration-500 group-hover:opacity-100 ${isActive ? "opacity-100" : "opacity-0"}`}>
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center mb-3">
                        {service.icon}
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">{service.title}</h3>
                      <div className="w-10 h-1 bg-brand-accent rounded-full mb-2 md:mb-4" />
                      <p className="text-white/90 leading-relaxed text-sm md:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Progress bar + hint */}
          <div className="relative mt-6 mx-auto w-32 h-1 rounded-full bg-gray-200">
            <motion.div
              className="absolute top-0 left-0 h-full w-1/4 rounded-full bg-brand-accent"
              style={{ left: indicatorLeft }}
            />
          </div>
          <p className="text-center text-[12px] text-gray-400 italic mt-3">
            Houd vast om te pauzeren · Swipe om te bladeren
          </p>
        </div>

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
