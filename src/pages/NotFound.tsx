import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

const suggesties = [
  { label: "Naar de homepage", to: "/" },
  { label: "Bekijk de projecten", to: "/projecten" },
  { label: "Bekijk de diensten", to: "/dit-doe-ik-graag" },
  { label: "Neem contact op", to: "/contact" },
];

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={springEnter}
      className="pt-32 pb-24"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
            Foutcode 404
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Deze pagina is <span className="text-brand-accent">van het podium</span> gehaald.
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            De pagina die jullie zoeken bestaat niet of is verplaatst. Vanaf hier
            komen jullie wel op de juiste plek.
          </p>

          <ul className="space-y-4">
            {suggesties.map((suggestie) => (
              <li key={suggestie.to}>
                <Link
                  to={suggestie.to}
                  className="group inline-flex items-center gap-3 text-xl font-bold hover:text-brand-accent transition-colors"
                >
                  {suggestie.label}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
