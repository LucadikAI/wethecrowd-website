import { motion, animate, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VenueSlider from "../components/VenueSlider";

const funFacts = [
  { label: "Meest geluisterde artiest waar ik zelf mee heb samengewerkt", answer: "Gable Price and Friends" },
  { label: "Project waar ik het meeste uren aan besteed", answer: "DiscoverEU Learning Cycle" },
  { label: "Favoriete evenementenlocatie", answer: "Rotterdam Ahoy" },
  { label: "Go-to drankje tijdens een lange productiedag", answer: "Cola Zero" },
  { label: "Aantal evenementen gedraaid in 2025", answer: "19" },
];

const springEnter = { type: "spring" as const, stiffness: 200, damping: 20 };

const quoteWords = "Van festivals tot bedrijfsevenementen, als freelancer sta ik klaar voor uiteenlopende producties. Daar ben ik enthousiast over, omdat ik het leuk vind om momenten te creëren die mensen voor altijd bij zullen blijven. Ik combineer hard werken met creatief denken en daarmee hoop ik projecten naar een hoger niveau te tillen. Samen met jou.".split(' ');

const quote2Words = "Wat mij drijft? Het grotere plaatje. Ik word enthousiast van de strategische puzzel: creatieve vraagstukken oplossen, een sterke marketingstrategie neerzetten en alles laten kloppen binnen een bredere visie. Tegelijkertijd volg ik de nieuwste AI-ontwikkelingen in de evenementensector op de voet en denk ik graag actief mee over hoe jouw organisatie hier slim gebruik van kan maken.".split(' ');

/** Een woord in het manifest dat met een foto gevuld is in plaats van met zwart. */
type Photo = { image: string; caption: string };
type PhotoWordSpec = Photo & { phrase: string };

const paragraphs: { eyebrow: string; words: string[]; photoWords: PhotoWordSpec[] }[] = [
  {
    eyebrow: "Wat ik doe",
    words: quoteWords,
    photoWords: [
      { phrase: "festivals", image: "/luca-werk-6.jpg", caption: "Showcalling in de kerk" },
      { phrase: "creatief denken", image: "/luca-werk-9.jpg", caption: "Concepting met het team" },
    ],
  },
  {
    eyebrow: "Wat mij drijft",
    words: quote2Words,
    photoWords: [
      { phrase: "Het grotere plaatje.", image: "/luca-werk-7.jpg", caption: "Met het team na de show" },
    ],
  },
];

const strips: { items: Photo[]; startNumber: number; reverse: boolean }[] = [
  {
    startNumber: 1,
    reverse: false,
    items: [
      { image: "/luca-werk-6.jpg", caption: "Showcalling in de kerk" },
      { image: "/luca-werk-8.jpg", caption: "Backstage, vijf minuten voor doors" },
      { image: "/luca-werk-2.jpg", caption: "Volle zaal" },
      { image: "/luca-werk-7.jpg", caption: "Met het team na de show" },
      { image: "/luca-werk-4.jpg", caption: "Opbouwdag" },
      { image: "/luca-werk-1.jpg", caption: "Crew" },
    ],
  },
  {
    startNumber: 7,
    reverse: true,
    items: [
      { image: "/luca-quote2-2.jpg", caption: "Regie tijdens de show" },
      { image: "/luca-quote2-3.jpg", caption: "Volle bak" },
      { image: "/luca-quote2-4.jpg", caption: "Vlak voor doors" },
      { image: "/luca-werk-3.png", caption: "Op locatie" },
      { image: "/luca-quote2-5.jpg", caption: "Podium in opbouw" },
      { image: "/luca-nu.jpg", caption: "Nu" },
    ],
  },
];

/** Zover dimmen de overige woorden van een alinea zodra een beeldwoord aan staat. */
const DIMMED = 0.25;

type Segment =
  | { kind: "word"; word: string; index: number }
  | { kind: "photo"; text: string; index: number; photo: Photo };

/**
 * Knipt een alinea op in losse woorden en, waar een beeldwoord staat, één blok
 * met de hele zinsnede. De woordindex loopt door over de hele alinea, zodat de
 * reveal van WordSpan zijn volgorde houdt. Staat een zinsnede er niet in — omdat
 * de tekst is aangepast — dan blijft hij gewoon zwarte tekst.
 */
function toSegments(words: string[], photoWords: PhotoWordSpec[]): Segment[] {
  const starts = new Map<number, PhotoWordSpec>();
  for (const spec of photoWords) {
    const phrase = spec.phrase.split(' ');
    for (let i = 0; i + phrase.length <= words.length; i++) {
      if (phrase.every((w, k) => words[i + k] === w)) {
        starts.set(i, spec);
        break;
      }
    }
  }

  const segments: Segment[] = [];
  for (let i = 0; i < words.length; ) {
    const spec = starts.get(i);
    if (spec) {
      const length = spec.phrase.split(' ').length;
      segments.push({ kind: "photo", text: spec.phrase, index: i, photo: spec });
      i += length;
    } else {
      segments.push({ kind: "word", word: words[i], index: i });
      i += 1;
    }
  }
  return segments;
}

function WordSpan({ word, index, total, scrollYProgress, prefersReducedMotion, dim }: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean | null;
  dim: MotionValue<number>;
}) {
  const start = (index / total) * 0.55;
  const end = Math.min(start + 0.35, 1);
  const revealed = useTransform(scrollYProgress, [start, end], [0.12, 1]);
  // Een gedimde alinea mag een woord nooit lichter maken dan het al was.
  const opacity = useTransform([revealed, dim], ([r, d]: number[]) => Math.min(r, d));
  return (
    <motion.span style={{ opacity: prefersReducedMotion ? dim : opacity, color: 'black' }}>
      {word}{' '}
    </motion.span>
  );
}

/**
 * Een woord waar de foto doorheen loopt: de letters zijn een venster op het
 * beeld. Hoveren met de muis, of tikken op een aanraakscherm, laat dezelfde foto
 * groot rechts in beeld springen.
 */
function PhotoWord({ text, photo, isOpen, onOpen, onClose }: {
  text: string;
  photo: Photo;
  isOpen: boolean;
  onOpen: (photo: Photo) => void;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`${text} — toon foto: ${photo.caption}`}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') onOpen(photo); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') onClose(); }}
        onFocus={() => onOpen(photo)}
        onBlur={onClose}
        onClick={(e) => {
          // Op een aanraakscherm is er geen hover; daar is de tik de schakelaar.
          if ((e.nativeEvent as PointerEvent).pointerType === 'mouse') return;
          isOpen ? onClose() : onOpen(photo);
        }}
        className="relative inline-block cursor-pointer text-left align-baseline outline-offset-4 focus-visible:outline-3 focus-visible:outline-brand-accent"
        style={{
          backgroundImage: `url('${photo.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          // Zonder deze correctie blijven de letters te donker om te lezen.
          filter: 'saturate(1.4) contrast(1.15) brightness(1.2)',
        }}
      >
        {text}
        <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-1 rounded-[2px] bg-brand-accent opacity-70" />
      </button>{' '}
    </>
  );
}

/**
 * Eén alinea van het manifest. De woorden lichten op terwijl je scrolt; de
 * beeldwoorden staan altijd vol in beeld en dimmen bij hover de rest van de
 * alinea, zodat de foto het overneemt.
 */
function ManifestParagraph({ eyebrow, words, photoWords, openPhoto, dimmed, onOpen, onClose, prefersReducedMotion }: {
  eyebrow: string;
  words: string[];
  photoWords: PhotoWordSpec[];
  openPhoto: Photo | null;
  dimmed: boolean;
  onOpen: (photo: Photo) => void;
  onClose: () => void;
  prefersReducedMotion: boolean | null;
}) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.62", "end 0.4"],
  });

  const dim = useMotionValue(1);
  useEffect(() => {
    const controls = animate(dim, dimmed ? DIMMED : 1, { duration: 0.25, ease: "easeOut" });
    return () => controls.stop();
  }, [dim, dimmed]);

  const segments = toSegments(words, photoWords);

  return (
    <div className="mx-auto max-w-[1040px]">
      <span className="mb-[22px] block text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">
        {eyebrow}
      </span>
      <p
        ref={paragraphRef}
        className="font-display font-semibold leading-[1.12] tracking-[-0.025em] text-[length:clamp(28px,3.7vw,56px)]"
      >
        {segments.map((segment) =>
          segment.kind === "photo" ? (
            <PhotoWord
              key={segment.index}
              text={segment.text}
              photo={segment.photo}
              isOpen={openPhoto?.image === segment.photo.image}
              onOpen={onOpen}
              onClose={onClose}
            />
          ) : (
            <WordSpan
              key={segment.index}
              word={segment.word}
              index={segment.index}
              total={words.length}
              scrollYProgress={scrollYProgress}
              prefersReducedMotion={prefersReducedMotion}
              dim={dim}
            />
          )
        )}
      </p>
    </div>
  );
}

/**
 * Een full-bleed rij foto's die tegen de scrollrichting in schuift. De tweede
 * strook op de pagina loopt de andere kant op, zodat de twee elkaar kruisen.
 */
function PhotoStrip({ items, startNumber, reverse, prefersReducedMotion }: {
  items: Photo[];
  startNumber: number;
  reverse: boolean;
  prefersReducedMotion: boolean | null;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stripRef, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ["-12%", "12%"] : ["12%", "-12%"]);

  return (
    <div ref={stripRef} className="relative my-[90px] overflow-hidden">
      <motion.div style={{ x: prefersReducedMotion ? 0 : x }} className="flex w-max gap-[18px]">
        {items.map((item, i) => (
          <figure key={item.image} className="w-[clamp(240px,26vw,380px)] shrink-0">
            {/* Om en om liggend en staand; dat geeft de rij ritme. */}
            <img
              src={item.image}
              alt={item.caption}
              draggable={false}
              className={`rounded-[22px] object-cover ${
                i % 2 === 1 ? "ml-[10%] aspect-[3/4] w-[80%]" : "aspect-[4/3] w-full"
              }`}
            />
            <figcaption className="mt-2.5 flex items-center gap-2 text-[12px] font-medium text-gray-500">
              <span className="font-display text-[11px] font-bold tracking-[0.1em] text-brand-accent">
                {String(startNumber + i).padStart(2, '0')}
              </span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutLuca() {
  const [showChild, setShowChild] = useState(false);
  const [activeFact, setActiveFact] = useState(0);
  const [revealedFact, setRevealedFact] = useState<number | null>(null);
  // Welk beeldwoord staat aan, en in welke alinea? De laatste foto blijft in de
  // kaart staan terwijl die uitfadet.
  const [openWord, setOpenWord] = useState<{ paragraph: number; photo: Photo } | null>(null);
  const [lastPhoto, setLastPhoto] = useState<Photo | null>(null);
  const touchStartX = useRef(0);
  const lastTouchTime = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const openPhoto = (paragraph: number) => (photo: Photo) => {
    setOpenWord({ paragraph, photo });
    setLastPhoto(photo);
  };
  const closePhoto = () => setOpenWord(null);

  const nextFact = () => {
    setActiveFact(i => (i + 1) % funFacts.length);
    setRevealedFact(null);
  };

  const prevFact = () => {
    setActiveFact(i => (i - 1 + funFacts.length) % funFacts.length);
    setRevealedFact(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    lastTouchTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextFact() : prevFact();
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={springEnter}
      className="pt-40 pb-24"
    >
      {/* Photo + Text */}
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-end">
          {/* Left Side: Photo */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...springEnter, delay: 0.05 }}
            className="relative"
          >
            <div
              className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] bg-gray-100 group relative cursor-pointer"
              onClick={() => setShowChild(prev => !prev)}
            >
              <img
                src="/luca-portret.jpg"
                alt="Luca nu"
                className={`w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0 ${showChild ? "opacity-0" : ""}`}
              />
              <img
                src="/luca-kind.png"
                alt="Luca vroeger"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-100 group-hover:scale-100 ${showChild ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
              />
              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold transition-opacity pointer-events-none group-hover:opacity-100 ${showChild ? "opacity-100" : "opacity-0"}`}>
                Toen & Nu
              </div>
              <span className={`absolute bottom-3 left-5 text-[10px] text-white/70 font-medium z-10 select-none transition-opacity duration-700 group-hover:opacity-0 ${showChild ? "opacity-0" : ""}`}>© Caitlin Sloot</span>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springEnter, delay: 0.12 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-12 tracking-tight">
              Ik ben Luca.
            </h1>
            <div className="space-y-8 text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
              <p>
                Als klein jongetje werd ik regelmatig door mijn vader meegenomen naar het GelreDome in Arnhem. Als projectleider bij grote evenementen moest hij er dagen van tevoren aanwezig zijn voor de voorbereidingen. Terwijl hij aan het werk was, raakte ik gefascineerd door de wereld achter de schermen: de opbouw van het podium, de aankomst van artiesten, de generale repetities en uiteindelijk de duizenden bezoekers die de zaal vulden.
              </p>
              <p>
                Nu, jaren later, draai ik zelf tal van producties op de meest iconische locaties van Nederland en mag ik opdrachtgevers uit alle hoeken van het land helpen om hun ideeën werkelijkheid te laten worden.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Venue Slider */}
      <VenueSlider />

      {/* Manifest — de twee teksten dragen nu de pagina. */}
      <div className="container mx-auto px-6 pt-[120px] pb-10">
        <ManifestParagraph
          {...paragraphs[0]}
          openPhoto={openWord?.paragraph === 0 ? openWord.photo : null}
          dimmed={openWord?.paragraph === 0}
          onOpen={openPhoto(0)}
          onClose={closePhoto}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      <PhotoStrip {...strips[0]} prefersReducedMotion={prefersReducedMotion} />

      <div className="container mx-auto px-6">
        <ManifestParagraph
          {...paragraphs[1]}
          openPhoto={openWord?.paragraph === 1 ? openWord.photo : null}
          dimmed={openWord?.paragraph === 1}
          onOpen={openPhoto(1)}
          onClose={closePhoto}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      <PhotoStrip {...strips[1]} prefersReducedMotion={prefersReducedMotion} />

      {/* Fun Facts Carousel */}
      <div className="mt-20">
        <div className="container mx-auto px-6">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springEnter}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 mb-10"
          >
            Meer over mij
          </motion.p>
        </div>

        {/* Cards + side chevrons */}
        <div
          className="relative overflow-hidden h-[320px] md:h-[400px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left chevron */}
          <button
            onClick={prevFact}
            className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-202px)] md:left-[calc(50%-247px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right chevron */}
          <button
            onClick={nextFact}
            className="absolute top-1/2 -translate-y-1/2 right-[calc(50%-202px)] md:right-[calc(50%-247px)] z-20 w-11 h-11 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-black transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
          {funFacts.map((fact, i) => {
            let offset = i - activeFact;
            const total = funFacts.length;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;
            const isRevealed = revealedFact === i;

            return (
              <motion.div
                key={i}
                animate={{
                  x: `${offset * 68}%`,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isVisible ? (isCenter ? 1 : 0.45) : 0,
                  filter: isCenter ? 'blur(0px)' : 'blur(1.5px)',
                  zIndex: isCenter ? 10 : 5,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 22 }}
                className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-150px)] md:left-[calc(50%-195px)] w-[300px] md:w-[390px] cursor-pointer"
                style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                onPointerEnter={(e) => { if (isCenter && e.pointerType === 'mouse') setRevealedFact(i); }}
                onPointerLeave={(e) => { if (isCenter && e.pointerType === 'mouse') setRevealedFact(null); }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveFact(i);
                    setRevealedFact(null);
                  } else {
                    setRevealedFact(prev => prev === i ? null : i);
                  }
                }}
              >
                <div
                  className="relative select-none h-[280px] md:h-[350px]"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 22 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '2rem',
                      boxShadow: isCenter
                        ? '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)'
                        : '0 4px 20px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0 rounded-[2rem] flex flex-col justify-center px-8 md:px-10 py-8 bg-[#f5f5f5]"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-400 leading-relaxed">
                        {fact.label}?
                      </p>
                      {isCenter && (
                        <p className="mt-6 text-[10px] text-gray-300 font-medium tracking-wide">
                          Hover of tik om te onthullen
                        </p>
                      )}
                    </div>

                    {/* Back face */}
                    <div
                      className="absolute inset-0 rounded-[2rem] flex flex-col justify-center px-8 md:px-10 py-8"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #1ea4f2 0%, #0d8fd8 55%, #0a7abf 100%)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 15% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
                      <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.14em] text-white/60 leading-relaxed mb-5">
                        {fact.label}
                      </p>
                      <p className="relative z-10 text-2xl md:text-3xl font-bold text-white leading-tight">
                        {fact.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {funFacts.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveFact(i); setRevealedFact(null); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeFact ? 'w-5 bg-black' : 'w-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* De foto springt uit de letters: vaste kaart rechts in beeld. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          openWord
            ? { opacity: 1, scale: 1, rotate: -2 }
            : { opacity: 0, scale: prefersReducedMotion ? 1 : 0.9, rotate: prefersReducedMotion ? 0 : 4 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { opacity: { duration: 0.35 }, default: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } }
        }
        style={{ y: "-50%" }}
        className="pointer-events-none fixed right-[4vw] top-1/2 z-50 aspect-[4/5] w-[min(280px,60vw)] overflow-hidden rounded-[28px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.5)] md:w-[min(420px,32vw)]"
      >
        {lastPhoto && (
          <>
            <img
              src={lastPhoto.image}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 left-[18px] text-[12px] font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
              {lastPhoto.caption}
            </span>
          </>
        )}
      </motion.div>

    </motion.div>
  );
}
