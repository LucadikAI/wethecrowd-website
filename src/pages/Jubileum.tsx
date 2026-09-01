import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import JubileumReveal from "../components/JubileumReveal";
import { jubileum } from "../data/jubileum";

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function Jubileum() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={springEnter}
      className="pt-32 pb-24"
    >
      <JubileumReveal />

      <div className="container mx-auto px-6 pt-16">
        <div className="flex flex-col items-center gap-6 rounded-[3rem] bg-gray-50 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{jubileum.onderaan.tekst}</h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/dit-doe-ik-graag"
              className="inline-flex items-center gap-3 px-10 py-4 bg-brand-accent text-white rounded-full font-bold hover:brightness-90 transition-colors"
            >
              {jubileum.onderaan.link}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
