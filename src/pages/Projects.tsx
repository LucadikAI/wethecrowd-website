import { motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

export default function Projects() {
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
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Projecten waar energie, creativiteit en uitvoering samenkwamen.</h1>
        </motion.div>

        <div className="flex flex-col gap-6 mb-24">
          {Array.from({ length: Math.ceil(projects.length / 3) }).map((_, rowIndex) => {
            const isEven = rowIndex % 2 === 0;
            const rowClass = isEven
              ? "border border-gray-200 rounded-3xl p-8"
              : "border border-[#c9e8f9] rounded-3xl p-8";
            return (
              <div key={rowIndex} className={rowClass}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.slice(rowIndex * 3, rowIndex * 3 + 3).map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.1 }}
                      className="group"
                    >
                      <Link to={`/projecten/${project.slug}`}>
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-lg relative cursor-pointer">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-brand-accent/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white text-brand-accent flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                              <ExternalLink className="w-6 h-6" />
                            </div>
                          </div>
                          {project.photoCredit && (
                            <span className="absolute bottom-2 left-3 text-[10px] text-gray-400/80 font-medium z-10 select-none">© {project.photoCredit}</span>
                          )}
                        </div>
                      </Link>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">{project.role}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Opdrachtgever: {project.client}</p>
                        <Link to={`/projecten/${project.slug}`} className="hover:text-brand-accent transition-colors">
                          <h3 className="text-2xl font-bold pt-1">{project.title}</h3>
                        </Link>
                        <p className="text-gray-600 italic">{project.impact}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center text-center py-20 bg-gray-50 rounded-[3rem]">
          <h2 className="text-4xl font-bold mb-8">Heb je zelf een gaaf project in gedachten?</h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/contact"
              className="px-10 py-4 bg-brand-accent text-white rounded-full font-bold hover:brightness-90 transition-colors inline-block"
            >
              Nieuw project starten
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
