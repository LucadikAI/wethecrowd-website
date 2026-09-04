import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LogoSlider from "../components/LogoSlider";
import ServiceFlow from "../components/ServiceFlow";
import ServiceStack from "../components/ServiceStack";

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function Services() {
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
        <motion.div
          className="max-w-3xl mb-20"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springEnter, delay: 0.05 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Van <span className="text-brand-accent">idee</span> tot impact.</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            WE THE CROWD helpt op verschillende manieren. Geen standaard lijstjes, maar gerichte ondersteuning waar het telt.
          </p>
        </motion.div>

        <ServiceStack className="mb-24" />
      </div>

      <LogoSlider showTitle={false} />

      <div className="container mx-auto px-6">
        <ServiceFlow />

        <div className="bg-brand-accent text-white p-12 md:p-20 rounded-[3rem] text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Klaar om jouw event naar een hoger niveau te tillen?</h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-block"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-accent rounded-full font-bold text-xl hover:brightness-95 transition-colors"
            >
              Bespreek jouw event
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
