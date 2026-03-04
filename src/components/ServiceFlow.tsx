import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const flowItems = [
  {
    id: "concepting",
    title: "Concepting",
    short: "Opzoek naar een pakkend concept of de juiste manier om je doelgroep te bereiken? Laten we starten met bouwen!",
    detail: "Van kernboodschap tot creatieve uitwerking: ik help je de juiste toon te vinden voor jouw event. Samen bepalen we de richting, bouwen we een concept dat aansluit bij je doelgroep en zorgen we dat het verhaal klopt; vóór er ook maar één decibel klinkt.",
    dotColor: "#f97316",
    cta: "Plan een gesprek",
    palette: [
      "rgba(249,115,22,0.62)",
      "rgba(239,68,68,0.38)",
      "rgba(251,191,36,0.28)",
    ] as [string, string, string],
  },
  {
    id: "ondersteuning",
    title: "Ondersteuning",
    short: "Een eventkracht nodig op een specifiek gebied? Zowel tijdens de voorbereidingen als op het event zelf help ik je graag waar nodig.",
    detail: "Of je nu een extra paar handen nodig hebt tijdens de opbouw, iemand die de communicatie richting leveranciers stroomlijnt, of een showcaller die op de dag zelf alles in goede banen leidt; ik schakel in waar jij mij nodig hebt.",
    dotColor: "#1ea4f2",
    cta: "Neem contact op",
    palette: [
      "rgba(30,164,242,0.60)",
      "rgba(99,179,255,0.38)",
      "rgba(14,116,190,0.28)",
    ] as [string, string, string],
  },
  {
    id: "organisatie",
    title: "Organisatie",
    short: "De volledige organisatie van je event uit handen geven? Tijd om aan de slag te gaan!",
    detail: "Van eerste briefing tot het moment dat het publiek naar huis gaat: ik neem de volledige organisatie op me. Planning, locatie, crew, leveranciers, draaiboek - of juist een selectie daaruit. Ik coördineer het geheel, schakel m'n netwerk in en jij houdt je handen vrij voor wat je het belangrijkst vindt.",
    dotColor: "#0d9488",
    cta: "Plan een gesprek",
    palette: [
      "rgba(13,148,136,0.62)",
      "rgba(52,211,153,0.38)",
      "rgba(6,95,70,0.32)",
    ] as [string, string, string],
  },
];

export default function ServiceFlow() {
  const [active, setActive] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeItem = flowItems.find((s) => s.id === active) ?? null;

  const enter = (id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActive(id);
  };

  const leave = () => {
    leaveTimer.current = setTimeout(() => setActive(null), 130);
  };

  const cancelLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const tap = (id: string) => setActive((prev) => (prev === id ? null : id));

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Label */}
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-12">
          hulp nodig bij:
        </p>

        {/* ── Desktop: horizontale flow ── */}
        <div className="hidden md:block relative">
          {/* Horizontale lijn door de dots */}
          <div className="absolute top-[7px] left-0 right-0 h-px bg-gray-200" />

          <div className="flex">
            {flowItems.map((item) => {
              const isActive = active === item.id;
              return (
                <div
                  key={item.id}
                  className="flex-1 cursor-pointer pr-12 last:pr-0"
                  onMouseEnter={() => enter(item.id)}
                  onMouseLeave={leave}
                >
                  {/* Dot */}
                  <motion.div
                    animate={{ scale: isActive ? 1.8 : 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative z-10 w-3.5 h-3.5 rounded-full mb-6"
                    style={{
                      backgroundColor: isActive ? item.dotColor : "#d1d5db",
                      boxShadow: isActive
                        ? `0 0 18px ${item.dotColor}aa`
                        : "none",
                      transition: "background-color 0.25s, box-shadow 0.25s",
                    }}
                  />

                  {/* Titel */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{
                      color: isActive ? item.dotColor : "#111827",
                      transition: "color 0.25s",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Korte beschrijving */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.short}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobiel: verticale flow met inline paneel ── */}
        <div className="md:hidden">
          {flowItems.map((item, i) => {
            const isActive = active === item.id;
            return (
              <div key={item.id} className="flex">
                {/* Links: dot + verbindingslijn */}
                <div className="flex flex-col items-center w-4 mr-5 shrink-0">
                  <motion.div
                    animate={{ scale: isActive ? 1.5 : 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                    style={{
                      backgroundColor: isActive ? item.dotColor : "#d1d5db",
                      boxShadow: isActive ? `0 0 12px ${item.dotColor}aa` : "none",
                      transition: "background-color 0.25s, box-shadow 0.25s",
                    }}
                  />
                  {i < flowItems.length - 1 && (
                    <div className="w-px bg-gray-200 flex-1 mt-2" />
                  )}
                </div>

                {/* Rechts: tekst + uitklapbaar paneel */}
                <div className="pb-8 flex-1 min-w-0">
                  {/* Klikbare header */}
                  <div className="cursor-pointer" onClick={() => tap(item.id)}>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: isActive ? item.dotColor : "#111827", transition: "color 0.25s" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.short}
                    </p>
                  </div>

                  {/* Inline uitklapbaar paneel */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={item.id + "-panel"}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, ease: "easeOut" }}
                        className="mt-4 rounded-2xl overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-gray-950" />
                        <motion.div
                          animate={{ x: [0, 42, -18, 0], y: [0, -28, 18, 0] }}
                          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute rounded-full blur-[60px] pointer-events-none"
                          style={{ background: `radial-gradient(circle, ${item.palette[0]}, transparent)`, width: "70%", height: "150%", top: "-25%", left: "0%" }}
                        />
                        <motion.div
                          animate={{ x: [0, -32, 28, 0], y: [0, 22, -22, 0] }}
                          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute rounded-full blur-[50px] pointer-events-none"
                          style={{ background: `radial-gradient(circle, ${item.palette[1]}, transparent)`, width: "55%", height: "130%", top: "5%", right: "0%" }}
                        />
                        <div className="relative z-10 px-6 py-6">
                          <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/75 text-sm leading-relaxed mb-4">{item.detail}</p>
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                          >
                            {item.cta}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop hover/tap paneel (onder alle drie) ── */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="relative mt-10 rounded-[2rem] overflow-hidden h-72 hidden md:block"
              onMouseEnter={cancelLeave}
              onMouseLeave={leave}
            >
              <div className="absolute inset-0 bg-gray-950" />
              <motion.div
                animate={{ x: [0, 42, -18, 0], y: [0, -28, 18, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute rounded-full blur-[90px]"
                style={{ background: `radial-gradient(circle, ${activeItem.palette[0]}, transparent)`, width: "55%", height: "160%", top: "-30%", left: "0%" }}
              />
              <motion.div
                animate={{ x: [0, -32, 28, 0], y: [0, 22, -22, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="absolute rounded-full blur-[80px]"
                style={{ background: `radial-gradient(circle, ${activeItem.palette[1]}, transparent)`, width: "50%", height: "140%", top: "5%", right: "0%" }}
              />
              <motion.div
                animate={{ x: [0, 18, -28, 0], y: [0, -14, 22, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                className="absolute rounded-full blur-[70px]"
                style={{ background: `radial-gradient(circle, ${activeItem.palette[2]}, transparent)`, width: "45%", height: "110%", bottom: "-10%", left: "28%" }}
              />
              <div className="relative z-10 h-full flex flex-col justify-center px-14 py-0">
                <h4 className="text-2xl font-bold text-white mb-3">{activeItem.title}</h4>
                <p className="text-white/75 text-base leading-relaxed mb-6">{activeItem.detail}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm w-fit hover:scale-105 transition-transform"
                >
                  {activeItem.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
