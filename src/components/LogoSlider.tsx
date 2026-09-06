/**
 * De hoogte staat per logo, uitgerekend op gelijk oppervlak: met één vaste
 * hoogte oogt een breed woordmerk veel groter dan een vierkant beeldmerk.
 */
const logos = [
  { name: "One Ticket Left", src: "/logo-one-ticket-left-t.png", height: 48 },
  { name: "Inholland Hogeschool", src: "/logo-inholland-t.png", height: 31 },
  { name: "Go and Tell", src: "/logo-go-and-tell-t.png", height: 50 },
  { name: "Denk Producties", src: "/logo-denk-producties-t.png", height: 49 },
  { name: "Fairspace", src: "/logo-fairspace-t.png", height: 56 },
  { name: "TGB", src: "/logo-tgb-t.png", height: 50 },
  { name: "Possibilize", src: "/logo-possibilize-t.png", height: 49 },
  { name: "Bureau Spruit", src: "/logo-bureau-spruit-t.png", height: 44 },
  { name: "410 MGMT Co.", src: "/logo-410-mgmt-t.png", height: 37 },
  { name: "CHE", src: "/logo-che-t.png", height: 43 },
  { name: "EO", src: "/logo-eo-t.png", height: 42 },
  { name: "Hour of Power", src: "/logo-hour-of-power-t.png", height: 50 },
  { name: "Stichting Diversiteitsland", src: "/logo-diversiteitsland-t.png", height: 32 },
];

interface LogoSliderProps {
  showTitle?: boolean;
}

/**
 * De opdrachtgevers als één grijze balk over de volle breedte, zodat de logo's
 * het scherm in en uit lopen. Het kopje staat erboven op wit; boven en onder de
 * balk blijft wit, zodat hij nergens aan vastzit.
 */
export default function LogoSlider({ showTitle = true }: LogoSliderProps) {
  return (
    <section className="bg-white py-16">
      {showTitle && (
        <div className="container mx-auto mb-6 px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
            Opdrachtgevers
          </p>
        </div>
      )}
      <div className="relative flex overflow-hidden bg-gray-100 py-7">
        <div className="logo-slider-track flex items-center">
          {/* De reeks staat er twee keer, zodat de lus naadloos doorloopt. */}
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex w-[300px] shrink-0 justify-center px-10 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{ height: logo.height }}
                className="w-auto max-w-[160px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
