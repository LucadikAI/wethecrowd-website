import { motion } from "motion/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { projects } from "../data/projects";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    if (!project) {
      navigate("/projecten");
    }
    window.scrollTo(0, 0);
  }, [project, navigate]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/projecten" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-accent transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Terug naar projecten
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-start">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-brand-accent mb-4 block">
              {project.role}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {project.title}
            </h1>
            <p className="text-2xl text-gray-600 italic mb-12 leading-relaxed">
              {project.impact}
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-accent">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Opdrachtgever</p>
                  <p className="font-bold">{project.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-accent">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Jaar</p>
                  <p className="font-bold">{project.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Locatie</p>
                  <p className="font-bold">{project.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-bold mb-8">Over het project</h2>
          <div className="text-xl text-gray-700 leading-relaxed space-y-6">
            <p>{project.description}</p>
          </div>
        </div>

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-24">
            <h2 className="text-3xl font-bold mb-12">Impressie</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.gallery.map((img, i) => (
                <div key={i} className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                  <img 
                    src={img} 
                    alt={`${project.title} gallery ${i}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-brand-accent text-white p-12 md:p-20 rounded-[3rem] text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ook zo'n impact maken?</h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-accent rounded-full font-bold text-xl hover:scale-105 transition-transform"
          >
            Laten we kennismaken
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
