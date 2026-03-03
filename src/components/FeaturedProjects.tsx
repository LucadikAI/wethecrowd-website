import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/projects";

export default function FeaturedProjects() {
  // Take the first 3 projects for the home page
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">Knallers van projecten</h2>
          </motion.div>
          <Link 
            to="/projecten" 
            className="text-brand-accent font-bold flex items-center gap-2 group"
          >
            Bekijk alle projecten
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group flex flex-col h-full rounded-3xl p-6 border ${index % 2 === 0 ? "border-gray-200" : "border-[#c9e8f9]"}`}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
