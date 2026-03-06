import { motion } from "motion/react";
import { ArrowRight, Zap, Users, Layout, Mic2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
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
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote zalen, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
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
  const [activeCard, setActiveCard] = useState(0);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const nextCard = () => {
    setActiveCard(i => (i + 1) % services.length);
    setFlippedCard(null);
  };

  const prevCard = () => {
    setActiveCard(i => (i - 1 + services.length) % services.length);
    setFlippedCard(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextCard() : prevCard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      {/* Page background tint when card is flipped */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
        animate={{ backgroundColor: flippedCard !== null ? 'rgba(30, 164, 242, 0.07)' : 'rgba(255,255,255,0)' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Van idee tot impact.</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            WE THE CROWD helpt op verschillende manieren. Geen standaard lijstjes, maar gerichte ondersteuning waar het telt.
          </p>
        </div>

        {/* Cards Carousel */}
        <div className="mb-24">
          <div
            className="relative h-[440px] md:h-[500px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left chevron */}
            <button
              onClick={prevCard}
              className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-202px)] md:left-[calc(50%-252px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Right chevron */}
            <button
              onClick={nextCard}
              className="absolute top-1/2 -translate-y-1/2 right-[calc(50%-202px)] md:right-[calc(50%-252px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>

            {services.map((service, i) => {
              let offset = i - activeCard;
              const total = services.length;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 1;
              const isFlipped = flippedCard === i;

              return (
                <motion.div
                  key={i}
                  animate={{
                    x: `${offset * 68}%`,
                    scale: isCenter ? (isFlipped ? 1.2 : 1) : 0.82,
                    opacity: isVisible ? (isCenter ? 1 : 0.45) : 0,
                    filter: isCenter ? 'blur(0px)' : 'blur(1.5px)',
                    zIndex: isCenter ? 10 : 5,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-150px)] md:left-[calc(50%-195px)] w-[300px] md:w-[390px] cursor-pointer"
                  style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                  onPointerEnter={(e) => { if (isCenter && e.pointerType === 'mouse') setFlippedCard(i); }}
                  onPointerLeave={(e) => { if (isCenter && e.pointerType === 'mouse') setFlippedCard(null); }}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveCard(i);
                      setFlippedCard(null);
                    } else {
                      setFlippedCard(prev => prev === i ? null : i);
                    }
                  }}
                >
                  <div
                    className="relative h-[390px] md:h-[440px]"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '2rem',
                        boxShadow: isCenter
                          ? '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)'
                          : '0 4px 20px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Front face: photo + title */}
                      <div
                        className="absolute inset-0 rounded-[2rem] overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className={`absolute inset-0 w-full h-full object-cover ${service.imagePosition}`}
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center mb-3">
                            {service.icon}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h3>
                          {isCenter && (
                            <p className="mt-2 text-[10px] text-white/50 font-medium tracking-wide">
                              Hover of tik om te onthullen
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Back face: blue + description */}
                      <div
                        className="absolute inset-0 rounded-[2rem] overflow-hidden flex flex-col justify-start px-6 py-6 md:px-10 md:py-8"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: 'linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 55%, #0a7abf 100%)',
                        }}
                      >
                        <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 15% 25%, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
                        <div className="relative z-10 w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-2 md:mb-4">
                          {service.icon}
                        </div>
                        <h3 className="relative z-10 text-base md:text-2xl font-bold text-white mb-2 md:mb-3">{service.title}</h3>
                        <div className="relative z-10 w-8 h-0.5 bg-white/40 rounded-full mb-2 md:mb-4" />
                        <p className="relative z-10 text-white/85 text-xs md:text-base leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveCard(i); setFlippedCard(null); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeCard ? 'w-5 bg-black' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
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
