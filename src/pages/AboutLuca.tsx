import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VenueSlider from "../components/VenueSlider";

const funFacts = [
  { label: "Meest geluisterde artiest waar ik zelf mee heb samengewerkt", answer: "Gable Price and Friends" },
  { label: "Project waar ik het meeste uren aan besteed", answer: "DiscoverEU Learning Cycle" },
  { label: "Favoriete evenementenlocatie", answer: "Rotterdam Ahoy" },
  { label: "Go-to drankje tijdens een lange productiedag", answer: "Cola Zero" },
  { label: "Aantal evenementen gedraaid in 2025", answer: "19" },
];

const sliderPhotos = [
  { src: '/luca-werk-1.jpg',  pos: 'center' },
  { src: '/luca-werk-4.jpg',  pos: 'center' },
  { src: '/luca-werk-6.jpg',  pos: 'center' },
  { src: '/luca-werk-3.png',  pos: 'center' },
  { src: '/luca-werk-5.jpg',  pos: 'center' },
  { src: '/luca-werk-2.jpg',  pos: 'center' },
  { src: '/luca-werk-7.jpg',  pos: 'center' },
  { src: '/luca-werk-8.jpg',  pos: 'center' },
  { src: '/luca-werk-9.jpg',  pos: 'center' },
  { src: '/luca-werk-10.jpg', pos: 'top'    },
];

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function AboutLuca() {
  const [showChild, setShowChild] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [activeFact, setActiveFact] = useState(0);
  const [revealedFact, setRevealedFact] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const lastTouchTime = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const nextFact = () => {
    setActiveFact(i => (i + 1) % funFacts.length);
    setRevealedFact(null);
  };

  const prevFact = () => {
    setActiveFact(i => (i - 1 + funFacts.length) % funFacts.length);
    setRevealedFact(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    lastTouchTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextFact() : prevFact();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex(i => (i + 1) % sliderPhotos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={springEnter}
      className="pt-40 pb-24"
    >
      {/* Photo + Text */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Photo */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...springEnter, delay: 0.05 }}
            className="relative"
          >
            <div
              className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] bg-gray-100 group relative cursor-pointer"
              onClick={() => setShowChild(prev => !prev)}
            >
              <img
                src="/luca-nu.jpg"
                alt="Luca nu"
                className={`w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0 ${showChild ? "opacity-0" : ""}`}
              />
              <img
                src="/luca-kind.png"
                alt="Luca vroeger"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-100 group-hover:scale-100 ${showChild ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
              />
              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold transition-opacity pointer-events-none group-hover:opacity-100 ${showChild ? "opacity-100" : "opacity-0"}`}>
                Toen & Nu
              </div>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springEnter, delay: 0.12 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-12 tracking-tight">
              Ik ben Luca.
            </h1>
            <div className="space-y-8 text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
              <p>
                Als klein jongetje werd ik regelmatig door mijn vader meegenomen naar het GelreDome in Arnhem. Als projectleider bij grote evenementen moest hij er dagen van tevoren aanwezig zijn voor de voorbereidingen. Terwijl hij aan het werk was, raakte ik gefascineerd door de wereld achter de schermen: de opbouw van het podium, de aankomst van artiesten, de generale repetities en uiteindelijk de duizenden bezoekers die de zaal vulden.
              </p>
              <p>
                Nu, jaren later, draai ik zelf tal van producties op de meest iconische locaties van Nederland en mag ik opdrachtgevers uit alle hoeken van het land helpen om hun ideeën werkelijkheid te laten worden.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Venue Slider */}
      <VenueSlider />

      {/* Quote Section — loose overlap: foto links, tekst zweeft over rechterrand */}
      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={springEnter}
        className="mt-16"
      >
        {/* Desktop */}
        <div className="relative hidden md:block" style={{ height: 'clamp(420px, 58vh, 660px)' }}>
          {/* Foto — linker 70%, geen border-radius, scherpe hoeken */}
          <div
            className="absolute top-0 left-0 bottom-0 overflow-hidden"
            style={{ width: '70%' }}
          >
            <AnimatePresence>
              <motion.img
                key={sliderIndex}
                src={sliderPhotos[sliderIndex].src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: sliderPhotos[sliderIndex].pos }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>

          {/* Quote — rechts, zweeft ~100px over rechterrand foto heen */}
          <div
            className="absolute top-0 bottom-0 right-0 z-10 flex items-center"
            style={{ width: '40%' }}
          >
            <div className="px-10 lg:px-12 xl:px-14">
              <span
                className="block text-[3rem] font-serif leading-none -mb-2 select-none text-gray-900/25"
                style={{ textShadow: '0 0 16px rgba(255,255,255,1), 0 0 32px rgba(255,255,255,0.9)' }}
              >
                &#8220;
              </span>
              <blockquote
                className="font-bold text-[1.05rem] lg:text-[1.18rem] leading-[1.95] text-gray-900"
                style={{ textShadow: '0 0 12px rgba(255,255,255,1), 0 0 24px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8)' }}
              >
                Van festivals tot bedrijfsevenementen, als freelancer sta ik klaar voor uiteenlopende producties. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
              </blockquote>
              <span
                className="block text-right text-[2rem] font-serif leading-none mt-2 select-none text-gray-900/25"
                style={{ textShadow: '0 0 16px rgba(255,255,255,1), 0 0 32px rgba(255,255,255,0.9)' }}
              >
                &#8221;
              </span>
            </div>
          </div>
        </div>

        {/* Mobiel: foto boven, quote eronder op witte achtergrond */}
        <div className="md:hidden">
          <div className="relative overflow-hidden h-72">
            <AnimatePresence>
              <motion.img
                key={sliderIndex}
                src={sliderPhotos[sliderIndex].src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: sliderPhotos[sliderIndex].pos }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>
          <div className="px-6 pt-8 pb-4">
            <span className="block text-[2.5rem] font-serif text-gray-300 leading-none -mb-1 select-none">&#8220;</span>
            <blockquote className="text-gray-900 font-bold text-base leading-[1.9]">
              Van festivals tot bedrijfsevenementen, als freelancer sta ik klaar voor uiteenlopende producties. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
            </blockquote>
            <span className="block text-right text-[2rem] font-serif text-gray-300 leading-none mt-2 select-none">&#8221;</span>
          </div>
        </div>
      </motion.section>

      {/* Fun Facts Carousel */}
      <div className="mt-20 md:mt-36">
        <div className="container mx-auto px-6">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springEnter}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 mb-10"
          >
            Meer over mij
          </motion.p>
        </div>

        {/* Cards + side chevrons */}
        <div
          className="relative overflow-hidden h-[320px] md:h-[400px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left chevron */}
          <button
            onClick={prevFact}
            className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-202px)] md:left-[calc(50%-247px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right chevron */}
          <button
            onClick={nextFact}
            className="absolute top-1/2 -translate-y-1/2 right-[calc(50%-202px)] md:right-[calc(50%-247px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
          {funFacts.map((fact, i) => {
            let offset = i - activeFact;
            const total = funFacts.length;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;
            const isRevealed = revealedFact === i;

            return (
              <motion.div
                key={i}
                animate={{
                  x: `${offset * 68}%`,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isVisible ? (isCenter ? 1 : 0.45) : 0,
                  filter: isCenter ? 'blur(0px)' : 'blur(1.5px)',
                  zIndex: isCenter ? 10 : 5,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 22 }}
                className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-150px)] md:left-[calc(50%-195px)] w-[300px] md:w-[390px] cursor-pointer"
                style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                onPointerEnter={(e) => { if (isCenter && e.pointerType === 'mouse') setRevealedFact(i); }}
                onPointerLeave={(e) => { if (isCenter && e.pointerType === 'mouse') setRevealedFact(null); }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveFact(i);
                    setRevealedFact(null);
                  } else {
                    setRevealedFact(prev => prev === i ? null : i);
                  }
                }}
              >
                <div
                  className="relative select-none h-[280px] md:h-[350px]"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 22 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '2rem',
                      boxShadow: isCenter
                        ? '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)'
                        : '0 4px 20px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0 rounded-[2rem] flex flex-col justify-center px-8 md:px-10 py-8 bg-[#f5f5f5]"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-400 leading-relaxed">
                        {fact.label}?
                      </p>
                      {isCenter && (
                        <p className="mt-6 text-[10px] text-gray-300 font-medium tracking-wide">
                          Hover of tik om te onthullen
                        </p>
                      )}
                    </div>

                    {/* Back face */}
                    <div
                      className="absolute inset-0 rounded-[2rem] flex flex-col justify-center px-8 md:px-10 py-8"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 55%, #0a7abf 100%)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 15% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
                      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.14em] text-white/60 leading-relaxed mb-5">
                        {fact.label}
                      </p>
                      <p className="relative z-10 text-2xl md:text-3xl font-bold text-white leading-tight">
                        {fact.answer}
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
          {funFacts.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveFact(i); setRevealedFact(null); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeFact ? 'w-5 bg-black' : 'w-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
