import { motion } from "motion/react";
import { Mail, Linkedin, Send, CircleCheck } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    const res = await fetch("https://formspree.io/f/mojnojzn", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    });
    setStatus(res.ok ? "success" : "error");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Content */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Laten we samen iets creëren dat impact heeft.
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Nieuwe samenwerkingen, sparsessies of complexe productievraagstukken? Daar sta ik altijd voor open. Of je nu een stagemanager zoekt of een volledige productie wilt uitbesteden: laten we kijken wat we voor elkaar kunnen betekenen.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Email</p>
                  <a href="mailto:luca@wethecrowd.nl" className="text-xl font-bold hover:text-brand-accent transition-colors">luca@wethecrowd.nl</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">LinkedIn</p>
                  <a href="https://www.linkedin.com/in/luca-dik-78390b1b5/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-brand-accent transition-colors">Luca Dik</a>
                </div>
              </div>
            </div>

            <p className="mt-12 text-brand-accent font-bold text-lg">
              Ik reageer binnen 24 uur.
            </p>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-8 md:p-12 rounded-[3rem] shadow-sm"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
                <CircleCheck className="w-16 h-16 text-brand-accent" />
                <h3 className="text-2xl font-bold">Bericht verzonden!</h3>
                <p className="text-gray-500">Ik neem zo snel mogelijk contact met je op. Tot snel!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">Naam</label>
                    <input
                      type="text"
                      name="naam"
                      required
                      placeholder="Jouw naam"
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">E-mailadres</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jouw@email.nl"
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">Organisatie</label>
                  <input
                    type="text"
                    name="organisatie"
                    required
                    placeholder="Bedrijfsnaam"
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">Type Event</label>
                  <input
                    type="text"
                    name="type_event"
                    required
                    placeholder="Bijv. Festival, Concert, Zakelijk"
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">
                    Telefoonnummer <span className="text-gray-300 normal-case tracking-normal font-normal">(optioneel)</span>
                  </label>
                  <input
                    type="tel"
                    name="telefoonnummer"
                    placeholder="+31 6 12345678"
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-2">Bericht</label>
                  <textarea
                    name="bericht"
                    required
                    rows={5}
                    placeholder="Vertel me over je plannen..."
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all resize-none"
                  ></textarea>
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-sm text-center">Er ging iets mis. Probeer het opnieuw of mail direct naar luca@wethecrowd.nl.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-5 bg-brand-accent text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:brightness-90 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Versturen..." : "Verstuur bericht"}
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
