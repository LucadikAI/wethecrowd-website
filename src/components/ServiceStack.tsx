import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const services = [
  {
    title: "Eventmanagement / Productie",
    image: "/dienst-eventmanagement.jpg",
    imagePosition: "object-bottom",
    description: "Van eerste briefing tot laatste afbouwmoment. Ik vertaal ideeën naar concrete draaiboeken, zorg voor heldere briefings richting crew en leveranciers en bewaak planning, budget en kwaliteit. Of het nu gaat om locatiecoördinatie, technische afstemming of overall productie-aansturing: ik zorg dat alle onderdelen samenkomen in één kloppend geheel."
  },
  {
    title: "Artiestenbegeleiding",
    image: "/dienst-artiesten.jpg",
    imagePosition: "object-center",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote zalen, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Stagemanagement",
    image: "/dienst-stagemanagement.jpg",
    imagePosition: "object-center",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    image: "/dienst-showcalling.jpg",
    imagePosition: "object-center",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];

type ServiceStackProps = {
  /** Kop boven de stapel. Laat leeg wanneer de pagina al een eigen kop heeft. */
  title?: string;
  /** Optionele link naast de kop. */
  link?: { to: string; label: string };
  className?: string;
};

/**
 * Stapelende dienstenblokken: elk blok is 'sticky' met een oplopende top-offset,
 * zodat ze tijdens het scrollen over elkaar heen schuiven.
 */
export default function ServiceStack({ title, link, className = "" }: ServiceStackProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={className}>
      {(title || link) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          {title && (
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-4xl md:text-5xl font-bold"
            >
              {title}
            </motion.h2>
          )}
          {link && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to={link.to}
                className="text-brand-accent font-bold flex items-center gap-2 group"
              >
                {link.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>
      )}

      {services.map((service, index) => {
        const isLast = index === services.length - 1;

        return (
          <div
            key={service.title}
            className={`md:sticky ${isLast ? "" : "mb-6 md:mb-12"}`}
            style={{ top: `${96 + index * 36}px` }}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="group grid md:grid-cols-2 md:min-h-[460px] rounded-[2.5rem] overflow-hidden bg-brand-primary text-white shadow-2xl"
            >
              {/* Tekst */}
              <div className="order-2 md:order-1 p-10 md:p-14 flex flex-col justify-center">
                {/* Accentstreep: groeit mee bij het in beeld komen en bij hover. */}
                <motion.div
                  initial={prefersReducedMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  className="origin-left mb-8"
                >
                  <div className="h-[3px] w-14 rounded-full bg-brand-accent transition-all duration-500 group-hover:w-24" />
                </motion.div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight break-words">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>

              {/* Beeld */}
              <div className="order-1 md:order-2 relative min-h-[240px] md:min-h-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`absolute inset-0 w-full h-full object-cover ${service.imagePosition}`}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
