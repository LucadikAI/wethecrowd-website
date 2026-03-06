import { motion, useMotionValue, animate } from "motion/react";
import { useRef, useEffect } from "react";

const venues = [
  { id: 1, name: "Olympisch Stadion", image: "/venue-olympisch-stadion.jpg" },
  { id: 2, name: "Midden Nederland Hallen", image: "/venue-midden-nederland-hallen.jpg" },
  { id: 3, name: "AFAS Live", image: "/venue-afas-live.jpg" },
  { id: 4, name: "NEMO Science Museum", image: "/venue-nemo.jpg" },
  { id: 5, name: "Rotterdam Ahoy", image: "/venue-rotterdam-ahoy.jpg" },
  { id: 6, name: "De Basiliek", image: "/venue-de-basiliek.jpg" },
  { id: 7, name: "Beatrix Theater Utrecht", image: "/venue-beatrix-theater.jpg" },
  { id: 8, name: "Ekko", image: "/venue-ekko.jpg" },
  { id: 9, name: "Grote Kerk Den Haag", image: "/venue-grote-kerk-den-haag.jpg" },
  { id: 10, name: "AFAS Theater Leusden", image: "/venue-afas-theater-leusden.jpg" },
  { id: 11, name: "Grand Hotel Huis ter Duin", image: "/venue-grand-hotel-huis-ter-duin.jpg" },
  { id: 12, name: "Tolhuistuin", image: "/venue-tolhuistuin.jpg" },
  { id: 13, name: "Microlab Rotterdam", image: "/venue-microlab-rotterdam.jpg" },
  { id: 14, name: "De Ping Pong Club", image: "/venue-ping-pong-club.jpg" },
  { id: 15, name: "Jaarbeursplein Utrecht", image: "/venue-jaarbeursplein-utrecht.jpg" },
  { id: 16, name: "CHE", image: "/venue-che.jpg" },
  { id: 17, name: "Theater Lampegiet", image: "/venue-theater-lampegiet.jpg" },
];

export default function VenueSlider() {
  const x = useMotionValue(0);
  const progressValue = useMotionValue(0); // still used for resumeFromPosition math
  const trackRef = useRef<HTMLDivElement>(null);
  const isTouching = useRef(false);
  const touchStartClientX = useRef(0);
  const xAtTouchStart = useRef(0);
  const halfWidth = useRef(0);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);
  const progressControl = useRef<ReturnType<typeof animate> | null>(null);

  const startInfiniteLoop = () => {
    const hw = halfWidth.current;
    animControl.current?.stop();
    progressControl.current?.stop();
    animControl.current = animate(x, [0, -hw], {
      duration: 60, repeat: Infinity, ease: "linear",
    });
    progressControl.current = animate(progressValue, [0, 1], {
      duration: 60, repeat: Infinity, ease: "linear",
    });
  };

  const resumeFromPosition = (fromX: number) => {
    const hw = halfWidth.current;
    if (!hw) return;
    animControl.current?.stop();
    progressControl.current?.stop();

    let normalized = fromX % -hw;
    if (normalized > 0) normalized -= hw;
    x.set(normalized);

    const fraction = Math.abs(normalized) / hw;
    if (fraction === 0) { startInfiniteLoop(); return; }

    const remaining = 60 * (1 - fraction);
    progressValue.set(fraction);

    animControl.current = animate(x, -hw, {
      duration: remaining, ease: "linear",
      onComplete: () => {
        if (!isTouching.current) {
          x.set(0);
          startInfiniteLoop();
        }
      },
    });
    progressControl.current = animate(progressValue, 1, {
      duration: remaining, ease: "linear",
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackRef.current) {
        halfWidth.current = trackRef.current.scrollWidth / 2;
        startInfiniteLoop();
      }
    });
    return () => { animControl.current?.stop(); progressControl.current?.stop(); };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouching.current = true;
    touchStartClientX.current = e.touches[0].clientX;
    xAtTouchStart.current = x.get();
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartClientX.current;
    const newX = xAtTouchStart.current + delta;
    x.set(newX);
    const hw = halfWidth.current;
    if (hw) {
      let n = newX % -hw;
      if (n > 0) n -= hw;
      progressValue.set(Math.abs(n) / hw);
    }
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    resumeFromPosition(x.get());
  };

  const handleMouseEnter = () => {
    animControl.current?.stop();
    progressControl.current?.stop();
  };

  const handleMouseLeave = () => {
    if (!isTouching.current) {
      resumeFromPosition(x.get());
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Plekken waar ik achter de schermen stond</h2>
        </div>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-4 w-max pl-6"
        >
          {[...venues, ...venues].map((v, index) => (
            <div
              key={index}
              className="w-[280px] md:w-[320px] h-[200px] shrink-0 rounded-3xl overflow-hidden relative"
            >
              <img
                src={v.image}
                alt={v.name}
                className="w-full h-full object-cover"
              />
              {/* Blue tint overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'rgba(30, 164, 242, 0.28)' }}
              />
              {/* Venue name */}
              <span className="absolute top-4 left-4 text-white text-xs font-semibold leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] max-w-[75%]">
                {v.name}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
