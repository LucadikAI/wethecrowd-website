import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Testimonials from "../components/Testimonials";

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

export default function AboutLuca() {
  const [revealedFact, setRevealedFact] = useState<number | null>(null);
  const [showChild, setShowChild] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex(i => (i + 1) % sliderPhotos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-24"
    >
      {/* Photo + Text */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-12 tracking-tight">
              Ik ben Luca.
            </h1>
            <div className="space-y-8 text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
              <p>
                Toen ik als klein jongetje rondliep in Gelredome Arnhem vond ik het altijd al indrukwekkend: de opbouw van het podium, het binnenkomen van artiesten, de generale repetities en al die duizenden mensen die uiteindelijk de zaal binnenkomen.
              </p>
              <p>
                Je kan wel zeggen dat het organiseren van evenementen mij met de paplepel is ingegoten. Goed, genoeg clichés. We zijn zeker tien jaar verder en ondertussen heb ik al ervaring mogen opdoen op de tofste locaties van Nederland: van Ahoy Rotterdam tot AFAS Live, van het Olympisch Stadion tot NEMO.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials (no title) */}
      <Testimonials showTitle={false} />

      {/* Quote & Polaroids + Fact Blocks */}
      <div className="container mx-auto px-6">
        {/* Quote & Polaroids Section */}
        <div className="mt-4 md:mt-16">

          {/* Desktop layout */}
          <div className="hidden md:flex gap-3 items-stretch">

            {/* Blue block — 72% wide, text fills the space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden shadow-2xl flex-none"
              style={{
                width: '72%',
                borderRadius: '2.5rem',
                background: 'linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 55%, #0a7abf 100%)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 12% 40%, rgba(255,255,255,0.2) 0%, transparent 55%)' }} />
              <span className="absolute top-2 left-10 text-[7rem] font-serif text-white/10 leading-none select-none pointer-events-none">&#8220;</span>
              <div className="flex items-center h-full px-12 lg:px-16 py-10">
                <blockquote className="relative z-10 text-white font-bold text-xl lg:text-[1.35rem] leading-[1.95] text-left">
                  Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.{' '}
                  <span className="text-[2.5rem] font-serif text-white/25 leading-none align-bottom inline-block" style={{ lineHeight: 0, verticalAlign: '-0.15em' }}>&#8221;</span>
                </blockquote>
              </div>
            </motion.div>

            {/* Photo slider — fills remaining 28% */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex-1 relative overflow-hidden shadow-2xl bg-gray-900"
              style={{ borderRadius: '2.5rem' }}
            >
              <AnimatePresence>
                <motion.img
                  key={sliderIndex}
                  src={sliderPhotos[sliderIndex].src}
                  style={{ objectPosition: sliderPhotos[sliderIndex].pos }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt=""
                />
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden">
            {/* Quote — no block, plain text */}
            <blockquote className="text-gray-900 font-bold leading-[1.85] text-lg mb-6 px-1">
              <span className="text-brand-accent font-serif text-5xl leading-none opacity-30 select-none">&#8220;</span>
              Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
            </blockquote>
            {/* Photo slider */}
            <div className="relative h-56 rounded-[2rem] overflow-hidden bg-gray-900 shadow-xl">
              <AnimatePresence>
                <motion.img
                  key={sliderIndex}
                  src={sliderPhotos[sliderIndex].src}
                  style={{ objectPosition: sliderPhotos[sliderIndex].pos }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt=""
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Interactive Stats/Facts Blocks */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Meest geluisterde artiest waar ik zelf mee heb samengewerkt", answer: "Gable Price and Friends" },
            { label: "Project waar ik het meeste uren aan besteed",                answer: "DiscoverEU Learning Cycle" },
            { label: "Favoriete venue",                                             answer: "Rotterdam Ahoy" },
          ].map((item, i) => {
            const isActive = revealedFact === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setRevealedFact(isActive ? null : i)}
                className="group rounded-2xl bg-white border border-gray-100 cursor-pointer px-6 pt-5 pb-5 overflow-hidden"
                style={{ boxShadow: '0 1px 8px 0 rgba(0,0,0,0.05)' }}
              >
                {/* Label */}
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 leading-snug transition-opacity duration-300 ${isActive ? 'opacity-40' : ''} md:group-hover:opacity-40`}>
                  {item.label}
                </p>

                {/* Answer — click-to-reveal on mobile, hover on desktop */}
                <div className="mt-2 h-7 overflow-hidden">
                  <p className={`text-xl font-bold text-brand-accent leading-tight transition-all duration-300 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
