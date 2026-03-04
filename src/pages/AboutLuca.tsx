import { motion } from "motion/react";
import { useState } from "react";
import Testimonials from "../components/Testimonials";

export default function AboutLuca() {
  const [revealedFact, setRevealedFact] = useState<number | null>(null);
  const [showChild, setShowChild] = useState(false);

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
        <div className="mt-16 relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">

            {/* Left: Blue Quote Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.025 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
              className="relative rounded-3xl p-10 md:p-14 overflow-hidden cursor-default shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 60%, #0a7abf 100%)" }}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />

              {/* Opening quote mark */}
              <span className="absolute top-4 left-6 text-[8rem] font-serif text-white/20 leading-none select-none pointer-events-none">&#8220;</span>

              {/* Quote text */}
              <blockquote className="relative z-10 text-white text-xl md:text-2xl font-bold leading-relaxed mt-8">
                Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
              </blockquote>

              {/* Closing quote mark */}
              <span className="absolute bottom-0 right-6 text-[8rem] font-serif text-white/20 leading-none select-none pointer-events-none">&#8221;</span>
            </motion.div>

            {/* Right: Scattered Polaroids (desktop) */}
            <div className="relative h-[460px] hidden lg:block">
              {/* Photo 1 — top left, tilted left */}
              <motion.div
                initial={{ opacity: 0, rotate: -20, y: 40 }}
                whileInView={{ opacity: 1, rotate: -9, y: 0 }}
                whileHover={{ scale: 1.05, rotate: -6, zIndex: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute top-0 left-2 bg-white p-3 pb-10 shadow-xl rounded-sm border border-gray-100 w-44 z-10"
              >
                <img src="/luca-werk-1.jpg" alt="Luca in actie" className="aspect-square object-cover w-full" />
                <div className="h-1 w-6 bg-gray-100 rounded-full mx-auto opacity-40 mt-2"></div>
              </motion.div>

              {/* Photo 2 — top right, tilted right, overlapping */}
              <motion.div
                initial={{ opacity: 0, rotate: 18, y: 40 }}
                whileInView={{ opacity: 1, rotate: 7, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 4, zIndex: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", delay: 0.15 }}
                className="absolute top-10 right-0 bg-white p-3 pb-10 shadow-xl rounded-sm border border-gray-100 w-44 z-20"
              >
                <img src="/luca-werk-2.jpg" alt="Luca backstage" className="aspect-square object-cover w-full" />
                <div className="h-1 w-6 bg-gray-100 rounded-full mx-auto opacity-40 mt-2"></div>
              </motion.div>

              {/* Photo 3 — bottom center, slight tilt */}
              <motion.div
                initial={{ opacity: 0, rotate: -8, y: 50 }}
                whileInView={{ opacity: 1, rotate: -3, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 1, zIndex: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white p-3 pb-10 shadow-xl rounded-sm border border-gray-100 w-44 z-30"
              >
                <img src="/luca-werk-3.png" alt="Luca op locatie" className="aspect-square object-cover w-full" />
                <div className="h-1 w-6 bg-gray-100 rounded-full mx-auto opacity-40 mt-2"></div>
              </motion.div>
            </div>
          </div>

          {/* Mobile Polaroids */}
          <div className="flex lg:hidden justify-center gap-2 mt-10">
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm border border-gray-100 w-28 rotate-[-7deg] -mr-3">
              <img src="/luca-werk-1.jpg" alt="" className="aspect-square object-cover mb-1" />
            </div>
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm border border-gray-100 w-28 rotate-[3deg] mt-3 z-10 relative">
              <img src="/luca-werk-3.png" alt="" className="aspect-square object-cover mb-1" />
            </div>
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm border border-gray-100 w-28 rotate-[8deg] -ml-3">
              <img src="/luca-werk-2.jpg" alt="" className="aspect-square object-cover mb-1" />
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
