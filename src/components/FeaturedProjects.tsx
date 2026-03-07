import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/projects";

const springCard = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function FeaturedProjects() {
  const featuredProjects = projects.slice(0, 3);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 120px 0px" }}
            transition={springCard}
          >
            <h2 className="text-4xl md:text-5xl font-bold">Knallers van projecten</h2>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/projecten"
              className="text-brand-accent font-bold flex items-center gap-2 group"
            >
              Bekijk alle projecten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            /* Entrance wrapper — handles staggered fade-up */
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 28 }
              }
              transition={{ ...springCard, delay: prefersReducedMotion ? 0 : index * 0.15 }}
            >
              {/* Inner card — handles hover variants for blobs */}
              <motion.div
                whileHover="hovered"
                whileTap="hovered"
                animate="rest"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex flex-col h-full rounded-3xl p-6 border overflow-hidden transition-all duration-500
                  ${index % 2 === 0 ? "border-gray-200" : "border-[#c9e8f9]"}
                  ${hoveredId === project.id ? "md:scale-[1.04] md:shadow-2xl md:z-20" : ""}
                  ${hoveredId !== null && hoveredId !== project.id ? "md:opacity-40 md:blur-[2px] md:scale-[0.97]" : ""}
                `}
              >
                {/* Animated background blobs */}
                <motion.div
                  variants={{
                    rest: { scale: 0.7, x: 20, y: -20, opacity: 0 },
                    hovered: { scale: 1.4, x: -10, y: -30, opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#1ea4f2]/20 blur-3xl pointer-events-none"
                />
                <motion.div
                  variants={{
                    rest: { scale: 0.6, x: -20, y: 20, opacity: 0 },
                    hovered: { scale: 1.3, x: 10, y: 30, opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
                  className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-[#1ea4f2]/12 blur-3xl pointer-events-none"
                />
                <motion.div
                  variants={{
                    rest: { opacity: 0 },
                    hovered: { opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, #f0faff 0%, #e0f4fd 60%, #ffffff 100%)" }}
                />

                {/* Card content */}
                <div className="relative z-10">
                  <Link to={`/projecten/${project.slug}`}>
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 shadow-lg relative shrink-0 cursor-pointer">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {project.photoCredit && (
                        <span className="absolute bottom-2 left-3 text-[10px] text-gray-400/80 font-medium z-10 select-none">© {project.photoCredit}</span>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">{project.role}</span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">In opdracht van {project.client}</span>
                    </div>
                    <Link to={`/projecten/${project.slug}`} className="hover:text-brand-accent transition-colors">
                      <h3 className="text-2xl font-bold mb-4 min-h-[4rem] flex items-start">{project.title}</h3>
                    </Link>
                    <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                      {project.impact}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/projecten/${project.slug}`}
                        className="inline-flex items-center gap-2 text-brand-accent font-bold group/link"
                      >
                        Bekijk project
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
