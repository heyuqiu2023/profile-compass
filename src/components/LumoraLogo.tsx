interface LumoraLogoProps {
  className?: string;
  height?: number;
}

const LumoraLogo = ({ className = "", height = 30 }: LumoraLogoProps) => {
  const scale = height / 30;
  const totalWidth = Math.round(140 * scale);

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox="0 0 140 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lumora"
    >
      <defs>
        {/* Icon gradient: blue to teal */}
        <linearGradient id="lumora-icon-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>

        {/* Orb radial gradient */}
        <radialGradient id="lumora-orb" cx="0.45" cy="0.4" r="0.55">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.15" />
        </radialGradient>

        {/* Subtle orb glow */}
        <radialGradient id="lumora-orb-glow" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === ICON: Circular @ ring === */}
      <g>
        {/* Outer circle ring — open at bottom-right */}
        <path
          d="M 5 15 A 10 10 0 1 1 22.5 22"
          stroke="url(#lumora-icon-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner spiral curve — the "a" shape */}
        <path
          d="M 18.5 15 A 4.5 4.5 0 1 0 14 19.5 Q 14 22 11.5 23.5 Q 9 25 7 23"
          stroke="url(#lumora-icon-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* === WORDMARK === */}
      <g fill="currentColor">
        {/* L */}
        <path d="M 34 8 L 34 22 L 41 22 L 41 20.3 L 36.2 20.3 L 36.2 8 Z" />

        {/* u */}
        <path d="M 43 12.5 L 43 19.2 Q 43 20.3 43.5 20.9 Q 44 21.5 45.2 21.5 Q 46.5 21.5 47.5 20.5 L 47.5 12.5 L 49.5 12.5 L 49.5 22 L 47.7 22 L 47.5 20.8 Q 46.3 22.2 44.6 22.2 Q 43.2 22.2 42.4 21.4 Q 41 20.2 41 18.5 L 41 12.5 Z" />

        {/* m */}
        <path d="M 52 12.5 L 53.8 12.5 L 54 13.8 Q 55 12.3 56.5 12.3 Q 58 12.3 58.7 13.5 Q 59.7 12.3 61.3 12.3 Q 62.6 12.3 63.2 13 Q 63.8 13.7 63.8 15 L 63.8 22 L 61.8 22 L 61.8 15.3 Q 61.8 14 60.8 14 Q 59.6 14 58.9 15.2 L 58.9 22 L 56.9 22 L 56.9 15.3 Q 56.9 14 55.9 14 Q 54.7 14 54 15.2 L 54 22 L 52 22 Z" />

        {/* o — replaced with glowing orb */}
        <g>
          {/* Glow behind orb */}
          <circle cx="70.5" cy="17.2" r="6" fill="url(#lumora-orb-glow)" />
          {/* Orb ring */}
          <circle
            cx="70.5"
            cy="17.2"
            r="4.2"
            stroke="url(#lumora-icon-grad)"
            strokeWidth="1.6"
            fill="none"
          />
          {/* Inner orb dot */}
          <circle cx="69.8" cy="16.5" r="1.8" fill="url(#lumora-orb)" />
        </g>

        {/* r */}
        <path d="M 78 12.5 L 79.8 12.5 L 80 14 Q 81 12.3 82.5 12.3 L 83 12.4 L 82.7 14.3 L 82 14.2 Q 80.5 14.2 80 15.3 L 80 22 L 78 22 Z" />

        {/* a */}
        <path d="M 87.5 12.3 Q 89.2 12.3 90.2 13.2 Q 91.2 14.1 91.2 15.8 L 91.2 22 L 89.4 22 L 89.2 20.8 Q 88.2 22.2 86.3 22.2 Q 85 22.2 84.2 21.5 Q 83.4 20.8 83.4 19.7 Q 83.4 18.4 84.5 17.6 Q 85.6 16.8 87.5 16.8 L 89.2 16.8 L 89.2 15.8 Q 89.2 14.8 88.7 14.3 Q 88.2 13.8 87.3 13.8 Q 86 13.8 84.8 14.5 L 84 13.2 Q 85.5 12.3 87.5 12.3 Z M 87 20.8 Q 88.3 20.8 89.2 19.5 L 89.2 18 L 87.7 18 Q 86.4 18 85.8 18.4 Q 85.2 18.8 85.2 19.5 Q 85.2 20.1 85.6 20.5 Q 86 20.8 87 20.8 Z" />
      </g>
    </svg>
  );
};

export default LumoraLogo;
