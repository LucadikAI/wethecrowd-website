import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AboutLuca() {
  const [revealedFact, setRevealedFact] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] bg-gray-100 group relative cursor-pointer">
              {/* Adult Photo (Standard) */}
              <img
                src="/luca-nu.jpg"
                alt="Luca nu"
                className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              />
              {/* Child Photo (Hover) */}
              <img
                src="/luca-kind.png"
                alt="Luca vroeger"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-110 group-hover:scale-100"
              />
              {/* Overlay hint */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                onClick={() => setRevealedFact(isRevealed ? null : i)}
                className="group relative rounded-3xl cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden"
              >
                {/* Accent bar at bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-brand-accent transition-transform duration-500 origin-left ${isRevealed ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`} />

                <div className="p-8">
                  {/* Question */}
                  <p className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 transition-opacity duration-300 ${isRevealed ? "opacity-0" : ""} group-hover:opacity-0`}>
                    {item.initial}
                  </p>
                  {/* Answer */}
                  <p className={`text-2xl md:text-3xl font-bold text-brand-accent absolute bottom-8 left-8 right-8 transition-all duration-300 ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} group-hover:opacity-100 group-hover:translate-y-0`}>
                    {item.hover}
                  </p>
                  {/* Spacer */}
                  <p className="text-2xl md:text-3xl font-bold text-transparent select-none">{item.hover}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Quote & Polaroids Section */}
        <div className="mt-40 relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {/* Left Polaroid */}
            <motion.div
              initial={{ opacity: 0, rotate: -20, x: -50 }}
              whileInView={{ opacity: 1, rotate: -8, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-white p-3 pb-10 shadow-xl rounded-sm border border-gray-100 w-56 md:w-72 shrink-0 hidden md:block"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 mb-2">
                <img
                  src="/luca-werk-1.jpg"
                  alt="Luca in actie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1 w-8 bg-gray-100 rounded-full mx-auto opacity-40"></div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center relative px-8"
            >
              <span className="text-8xl font-serif text-brand-accent/20 absolute -top-12 left-0 leading-none">“</span>
              <blockquote className="text-2xl md:text-3xl font-display font-bold leading-tight text-gray-900 relative z-10">
                Als freelancer ben ik bezig om de meest uiteenlopende producties neer te zetten. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.
              </blockquote>
              <span className="text-8xl font-serif text-brand-accent/20 absolute -bottom-20 right-0 leading-none">”</span>
            </motion.div>

            {/* Right Polaroid */}
            <motion.div
              initial={{ opacity: 0, rotate: 20, x: 50 }}
              whileInView={{ opacity: 1, rotate: 12, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
              className="bg-white p-3 pb-10 shadow-xl rounded-sm border border-gray-100 w-56 md:w-72 shrink-0 hidden md:block"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 mb-2">
                <img
                  src="/luca-werk-2.jpg"
                  alt="Luca backstage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1 w-8 bg-gray-100 rounded-full mx-auto opacity-40"></div>
            </motion.div>
          </div>

          {/* Mobile Polaroids (Visible only on small screens) */}
          <div className="flex md:hidden justify-center gap-4 mt-12">
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm border border-gray-100 w-32 rotate-[-6deg]">
              <img src="/luca-werk-1.jpg" alt="" className="aspect-square object-cover mb-1" />
            </div>
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm border border-gray-100 w-32 rotate-[6deg]">
              <img src="/luca-werk-2.jpg" alt="" className="aspect-square object-cover mb-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
