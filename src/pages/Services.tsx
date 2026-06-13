import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Zap, Users, Layout, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";
import LogoSlider from "../components/LogoSlider";
import ServiceFlow from "../components/ServiceFlow";

const services = [
  {
    title: "Eventmanagement / Productie",
    icon: <Layout className="w-6 h-6" />,
    image: "/dienst-eventmanagement.jpg",
    imagePosition: "object-bottom",
    description: "Van eerste briefing tot laatste afbouwmoment. Ik vertaal ideeën naar concrete draaiboeken, zorg voor heldere briefings richting crew en leveranciers en bewaak planning, budget en kwaliteit. Of het nu gaat om locatiecoördinatie, technische afstemming of overall productie-aansturing: ik zorg dat alle onderdelen samenkomen in één kloppend geheel."
  },
  {
    title: "Artiestenbegeleiding",
    icon: <Users className="w-6 h-6" />,
    image: "/dienst-artiesten.jpg",
    imagePosition: "object-center",
    description: "Zowel in de voorbereiding als tijdens het live moment ben ik het vaste aanspreekpunt voor artiest en management. Van riders en hospitality tot repetities en showflow. Ik werk in kleine settings én grote zalen, en zorg dat artiesten zich volledig kunnen focussen op hun performance."
  },
  {
    title: "Stagemanagement",
    icon: <Zap className="w-6 h-6" />,
    image: "/dienst-stagemanagement.jpg",
    imagePosition: "object-center",
    description: "Op de vloer draait alles om timing en overzicht. Als stagemanager bewaak ik de planning, stuur ik crew aan en zorg ik dat wissels, cues en technische momenten naadloos in elkaar overlopen. Ik creëer rust backstage zodat het op het podium klopt."
  },
  {
    title: "Showcalling",
    icon: <Mic2 className="w-6 h-6" />,
    image: "/dienst-showcalling.jpg",
    imagePosition: "object-center",
    description: "Tijdens de show houd ik het totaaloverzicht. Ik geef cues aan licht, geluid, video en artiesten en zorg dat het programma exact volgens planning verloopt. Strak waar het moet, flexibel waar het kan. Zodat publiek en performers een vloeiende, professionele beleving ervaren."
  }
];

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

        {/* Stapelende blokken: elk blok is 'sticky' met een oplopende top-offset,
            zodat ze tijdens het scrollen over elkaar heen schuiven. */}
        <div className="mb-24">
          {services.map((service, index) => {
            const isLast = index === services.length - 1;

            return (
              <div
                key={index}
                className={`sticky ${isLast ? "" : "mb-8 md:mb-12"}`}
                style={{ top: `${96 + index * 36}px` }}
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 min-h-[460px] rounded-[2.5rem] overflow-hidden bg-brand-primary text-white shadow-2xl"
                >
                  {/* Tekst */}
                  <div className="order-2 md:order-1 p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center shrink-0">
                        {service.icon}
                      </div>
                      <span className="font-display text-sm font-medium tracking-[0.2em] text-brand-accent uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
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
