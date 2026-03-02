import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import FeaturedProjects from "../components/FeaturedProjects";
import LogoSlider from "../components/LogoSlider";
import Testimonials from "../components/Testimonials";
import { motion } from "motion/react";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Introduction />
      <FeaturedProjects />
      <LogoSlider />
      <Testimonials />
    </motion.div>
  );
}
