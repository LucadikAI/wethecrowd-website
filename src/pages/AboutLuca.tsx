import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Testimonials from "../components/Testimonials";

const sliderPhotos = [
  '/luca-werk-1.jpg',
  '/luca-werk-4.jpg',
  '/luca-werk-6.jpg',
  '/luca-werk-3.png',
  '/luca-werk-5.jpg',
  '/luca-werk-2.jpg',
  '/luca-werk-7.jpg',
  '/luca-werk-8.jpg',
  '/luca-werk-9.jpg',
  '/luca-werk-10.jpg',
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
        <div className="mt-16">

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
              <span className="absolute bottom-0 right-8 text-[7rem] font-serif text-white/10 leading-none select-none pointer-events-none">&#8221;</span>
              <div className="flex items-center h-full px-12 lg:px-16 py-10">
                <blockquote className="relative z-10 text-white font-bold text-xl lg:text-[1.35rem] leading-[1.95] text-left">
                  Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
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
                  src={sliderPhotos[sliderIndex]}
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
            <div
              className="rounded-[2rem] py-12 px-8 shadow-xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 55%, #0a7abf 100%)' }}
            >
              <span className="absolute top-2 left-6 text-[7rem] font-serif text-white/10 leading-none select-none">&#8220;</span>
              <blockquote className="relative z-10 text-white font-bold leading-relaxed text-lg text-left">
                Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
              </blockquote>
            </div>
            <div className="flex justify-center gap-1 mt-6 flex-wrap">
              {[
                { src: '/luca-werk-1.jpg', r: '-rotate-[7deg]', mt: '' },
                { src: '/luca-werk-4.jpg', r: 'rotate-[3deg]',  mt: 'mt-4' },
                { src: '/luca-werk-5.jpg', r: '-rotate-[4deg]', mt: '' },
                { src: '/luca-werk-2.jpg', r: 'rotate-[8deg]',  mt: 'mt-2' },
              ].map((p, i) => (
                <div key={i} className={`bg-white p-2 pb-6 shadow-lg rounded-sm w-24 ${p.r} ${p.mt} -mx-1`}>
                  <img src={p.src} alt="" className="aspect-square object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Stats/Facts Blocks */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {[
            {
              initial: "Meest geluisterde artiest waar ik zelf mee heb samengewerkt",
              hover: "Gable Price and Friends"
            },
            {
              initial: "Project waar ik het meeste uren aan besteedt",
              hover: "DiscoverEU Learning Cycle"
            },
            {
              initial: "Favoriete venue",
              hover: "Rotterdam Ahoy"
            }
          ].map((item, i) => {
            const isRevealed = revealedFact === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setRevealedFact(isRevealed ? null : i)}
                className="group relative rounded-3xl cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden"
              >
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-brand-accent transition-transform duration-500 origin-left ${isRevealed ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`} />
                <div className="p-8">
                  <p className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 transition-opacity duration-300 ${isRevealed ? "opacity-0" : ""} group-hover:opacity-0`}>
                    {item.initial}
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold text-brand-accent absolute bottom-8 left-8 right-8 transition-all duration-300 ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} group-hover:opacity-100 group-hover:translate-y-0`}>
                    {item.hover}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-transparent select-none">{item.hover}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
