import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Introduction() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Portrait */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img
              src="/luca-portret.jpg"
              alt="Luca Portrait"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-3 text-[10px] text-gray-400/80 font-medium z-10 select-none">© Caitlin Sloot</span>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-accent rounded-full -z-0 opacity-20 blur-3xl"></div>
        </motion.div>

        {/* Right Side: Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Ik ben Luca. <br />
            Eventprofessional met oog voor detail.
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
            <p>
              Ik werk al jaren achter de schermen van festivals, concerten en grote producties. Wat mij drijft is dat moment waarop alles samenkomt: de techniek klopt, de artiest staat er, het publiek gaat erin mee en de timing zit goed.
            </p>
            <p>
              Ik ben iemand die creatief denkt maar ook goed weet wat er praktisch nodig is om het neer te zetten. Ideeën bedenken is één ding, ze ook goed uitvoeren is waar het voor mij om draait. Een sterk event gaat verder dan een goed draaiboek. Uiteindelijk draait het om de beleving van de bezoeker.
            </p>
          </div>
          <Link 
            to="/over-luca" 
            className="inline-flex items-center gap-2 text-black font-bold text-lg group"
          >
            Meer over mij
            <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
