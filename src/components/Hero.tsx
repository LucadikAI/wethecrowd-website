import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface MarqueeProps {
  text: string;
  duration: number;
  reverse?: boolean;
  highlightWord?: string;
}

function MarqueeLine({ text, duration, reverse = false, highlightWord }: MarqueeProps) {
  const renderContent = (index: number) => {
    const shouldHighlight = index % 3 === 1;

    if (highlightWord && shouldHighlight) {
      const parts = text.split(new RegExp(`(${highlightWord})`, 'gi'));
      return (
        <>
          {parts.map((part, i) => (
            part.toLowerCase() === highlightWord.toLowerCase()
              ? <span key={i} className="text-brand-accent">{part}</span>
              : part
          ))}
          {" • "}
        </>
      );
    }

    return `${text} • `;
  };

  return (
    <div className="flex overflow-hidden whitespace-nowrap py-1">
      <motion.div
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-50%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex text-[16vw] md:text-[7vw] font-bold uppercase tracking-tighter text-gray-900 leading-none"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="inline-block px-4">
            {renderContent(i)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white">
      <div className="h-[28vh] md:hidden" />
      <div className="hidden md:block md:flex-1" />

      {/* Marquee Section */}
      <div className="relative z-10 w-full flex flex-col">
        <MarqueeLine text="Creatieve oplossingen" duration={60} highlightWord="Creatieve" />
        <MarqueeLine text="Strakke uitvoering" duration={80} reverse highlightWord="uitvoering" />
        <MarqueeLine text="Blijvende impact" duration={70} highlightWord="impact" />
      </div>

      {/* Description & Buttons Block */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
        className="mt-10 flex flex-col items-center text-center px-6 pb-10 md:pb-0 w-full"
      >
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light max-w-2xl mb-10">
          <span className="font-bold text-gray-900">WE THE CROWD</span> vertaalt visie naar uitvoering. Van creatieve conceptontwikkeling tot strakke productie en stagemanagement. Alles wat je zoekt om events met blijvende impact te realiseren.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/projecten"
              className="px-8 py-3.5 bg-brand-accent text-white rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-90 transition-colors group text-sm"
            >
              Bekijk alle projecten
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/contact"
              className="px-8 py-3.5 border border-gray-200 text-gray-900 rounded-full font-bold flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
            >
              Werk met mij
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="hidden md:block md:flex-1" />
    </section>
  );
}
