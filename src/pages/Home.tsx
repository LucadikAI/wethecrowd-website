import Hero from "../components/Hero";
import ScrollStory from "../components/ScrollStory";
import Introduction from "../components/Introduction";
import ServiceStack from "../components/ServiceStack";
import FeaturedProjects from "../components/FeaturedProjects";
import LogoSlider from "../components/LogoSlider";
import Testimonials from "../components/Testimonials";
import { motion, useReducedMotion } from "motion/react";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Hero />
      <ScrollStory />
      <Introduction />
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <ServiceStack
            title="Dit doe ik graag"
            link={{ to: "/dit-doe-ik-graag", label: "Bekijk alle diensten" }}
          />
        </div>
      </section>
      <FeaturedProjects />
      <LogoSlider />
      <Testimonials />
    </motion.div>
  );
}
