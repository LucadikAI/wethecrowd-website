import { motion } from "motion/react";

const logos = [
  { name: "One Ticket Left", src: "/logo-one-ticket-left.png" },
  { name: "Inholland Hogeschool", src: "/logo-inholland.png" },
  { name: "Go and Tell", src: "/logo-go-and-tell.webp" },
  { name: "Denk Producties", src: "/logo-denk-producties.png" },
  { name: "Fairspace", src: "/logo-fairspace.png" },
  { name: "NJi", src: "/logo-nji.png" },
  { name: "TGB", src: "/logo-tgb.png" },
];

export default function LogoSlider() {
  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
          Samenwerkingen & Partners
        </p>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="logo-slider-track flex items-center">
          {/* First set of logos */}
          {logos.map((logo, i) => (
            <div key={`logo-1-${i}`} className="w-[250px] flex justify-center px-10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src={logo.src} alt={logo.name} className="h-12 object-contain" referrerPolicy="no-referrer" />
            </div>
          ))}
          {/* Second set of logos for seamless loop */}
          {logos.map((logo, i) => (
            <div key={`logo-2-${i}`} className="w-[250px] flex justify-center px-10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src={logo.src} alt={logo.name} className="h-12 object-contain" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
