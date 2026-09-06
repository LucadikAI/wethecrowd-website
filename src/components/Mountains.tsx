import { useId } from "react";

type MountainsProps = {
  /** Zet het landschap op zijn kop, zodat de pieken naar beneden wijzen. */
  flipped?: boolean;
  /** Positionering en hoogte; de component vult altijd de ruimte die hij krijgt. */
  className?: string;
};

/**
 * Het berglandschap in ijs- en accentblauw. Staat op de homepage twee keer:
 * rechtop onder de dienstenkaarten (die er half in wegzakken) en gespiegeld
 * boven de aanbevelingen (waar de kaarten er onder vandaan komen).
 *
 * De gradient-id's worden per instantie uniek gemaakt; anders pakt de tweede
 * svg de verlopen van de eerste, omdat id's in een document maar één keer
 * mogen voorkomen.
 */
export default function Mountains({ flipped = false, className = "" }: MountainsProps) {
  const baseId = useId();
  const mountainId = `${baseId}-mountain`;
  const hazeId = `${baseId}-haze`;

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        style={flipped ? { transform: "scaleY(-1)" } : undefined}
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id={mountainId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-brand-frost)" }} />
            <stop offset="0.45" style={{ stopColor: "var(--color-brand-glacier)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-brand-accent)" }} />
          </linearGradient>
          <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-brand-ice)" }} stopOpacity="0.9" />
            <stop offset="1" stopColor="#c9e8f9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#${hazeId})`}
          points="0,150 90,120 160,170 250,100 330,160 420,110 500,140 590,70 660,150 760,105 850,160 930,90 1010,140 1100,80 1180,150 1270,110 1360,160 1440,95 1440,240 0,240"
        />
        <polygon
          fill={`url(#${mountainId})`}
          points="0,190 70,150 140,205 230,130 320,200 400,150 480,185 570,110 650,190 740,145 830,200 920,125 1000,180 1090,120 1170,195 1260,150 1350,205 1440,140 1440,240 0,240"
        />
      </svg>
    </div>
  );
}
