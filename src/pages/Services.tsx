import { motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Zap, Users, Layout, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

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
    imagePosition: "object-top",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote venues, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Stagemanagement",
    icon: <Zap className="w-8 h-8" />,
    image: "/dienst-stagemanagement.jpg",
    imagePosition: "object-top",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    icon: <Mic2 className="w-8 h-8" />,
    image: "/dienst-showcalling.jpg",
    imagePosition: "object-top",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragLeft, setDragLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const indicatorLeftDesktop = useTransform(dragX, [dragLeft || -1, 0], ["50%", "0%"]);
  const indicatorLeftMobile = useTransform(dragX, [dragLeft || -1, 0], ["75%", "0%"]);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      if (trackRef.current && containerRef.current) {
        setDragLeft(-(trackRef.current.scrollWidth - containerRef.current.offsetWidth));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
        <div ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: dragLeft, right: 0 }}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            style={{ x: dragX }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
            className="flex gap-6"
          >
            {services.map((service, index) => {
              const isActive = activeCard === index;
              return (
                <motion.div
                  key={index}
                  onClick={() => { if (!isDragging) setActiveCard(isActive ? null : index); }}
                  className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden group shadow-lg shrink-0 cursor-pointer"
                  style={{ minWidth: isMobile ? "100%" : "calc(50% - 12px)" }}
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="relative mt-6 mx-auto w-32 h-1 rounded-full bg-gray-200">
          <motion.div
            className={`absolute top-0 left-0 h-full rounded-full bg-brand-accent ${isMobile ? "w-1/4" : "w-1/2"}`}
            style={{ left: isMobile ? indicatorLeftMobile : indicatorLeftDesktop }}
          />
        </div>
        <p className="text-center text-sm text-gray-400 italic mt-4">Swipe to see more.</p>
        </div>

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
