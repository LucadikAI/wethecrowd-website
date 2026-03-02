import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 3,
    name: "Laura Adèr",
    company: "Co-Founder and Executive Director @ Fairspace",
    text: "De samenwerking met Luca was ontzettend prettig. Met zijn oog voor detail, ruime ervaring en het vermogen om onder tijdsdruk het overzicht te bewaren, zorgt hij ervoor dat je een sterk en professioneel event neerzet.",
    image: "/testimonial-laura.jpg"
  }
];

export default function Testimonials() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Wat anderen zeggen over de energie van WE THE CROWD</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(t.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`bg-gray-50 p-8 rounded-3xl relative transition-all duration-500 flex flex-col h-full ${
                hoveredId !== null && hoveredId !== t.id ? "opacity-40 blur-[2px] scale-95" : "opacity-100 scale-100"
              } ${hoveredId === t.id ? "scale-105 shadow-xl z-10 bg-white" : ""}`}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-accent opacity-10" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 leading-tight">{t.company}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed flex-1">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
