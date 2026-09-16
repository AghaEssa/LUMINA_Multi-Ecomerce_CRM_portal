"use client";

interface LuminaLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  layout?: "vertical" | "horizontal";
  textColor?: string;
}

export function LuminaLogo({
  className = "",
  showText = true,
  size = "md",
  layout = "vertical",
  textColor,
}: LuminaLogoProps) {
  const dimensions = {
    sm: { icon: 42, titleSize: "text-sm sm:text-base tracking-[0.2em]" },
    md: { icon: 58, titleSize: "text-lg sm:text-xl tracking-[0.22em]" },
    lg: { icon: 78, titleSize: "text-2xl tracking-[0.28em]" },
    xl: { icon: 104, titleSize: "text-3xl tracking-[0.35em]" },
  };

  const { icon: iconSize, titleSize } = dimensions[size];

  return (
    <div
      className={`flex ${
        layout === "horizontal" ? "flex-row items-center gap-3 text-left" : "flex-col items-center justify-center text-center"
      } ${className}`}
    >
      {/* Lumina Heraldic Emblem SVG */}
      <svg
        width={iconSize}
        height={iconSize * 0.9}
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-colors duration-200 ${textColor || "text-slate-900 dark:text-white"}`}
      >
        {/* Crown on top */}
        <path
          d="M 50 14 L 54 22 L 60 16 L 66 22 L 70 14 L 67 25 L 53 25 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="12" r="1.5" fill="currentColor" />
        <circle cx="60" cy="14" r="1.5" fill="currentColor" />
        <circle cx="70" cy="12" r="1.5" fill="currentColor" />

        {/* Left Bird */}
        <path
          d="M 46 19 C 40 16 34 18 30 22 C 26 26 24 30 22 28 C 28 28 35 25 40 27 C 44 28.5 47 24 46 19 Z"
          fill="currentColor"
        />
        <path
          d="M 30 22 C 26 20 22 21 18 25 C 24 24 28 25 32 28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Bird */}
        <path
          d="M 74 19 C 80 16 86 18 90 22 C 94 26 96 30 98 28 C 92 28 85 25 80 27 C 76 28.5 73 24 74 19 Z"
          fill="currentColor"
        />
        <path
          d="M 90 22 C 94 20 98 21 102 25 C 96 24 92 25 88 28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer Banner Ribbon */}
        <path
          d="M 28 34 L 38 34 L 36 29 L 26 29 Z M 92 34 L 82 34 L 84 29 L 94 29 Z"
          fill="currentColor"
        />

        {/* Shield Frame */}
        <path
          d="M 60 26 L 82 35 V 58 C 82 74 60 88 60 88 C 60 88 38 74 38 58 V 35 L 60 26 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner Shield Outline */}
        <path
          d="M 60 31 L 77 38 V 56 C 77 69 60 81 60 81 C 60 81 43 69 43 56 V 38 L 60 31 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central Monogram "L" */}
        <text
          x="60"
          y="64"
          fontSize="24"
          fontWeight="900"
          fontFamily="serif"
          textAnchor="middle"
          fill="currentColor"
          letterSpacing="0"
        >
          L
        </text>

        {/* Side Decorative Wings/Ribbons */}
        <path
          d="M 38 42 H 24 M 38 50 H 20 M 38 58 H 26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 82 42 H 96 M 82 50 H 100 M 82 58 H 94"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Lumina Typography */}
      {showText && (
        <div className={textColor || "text-slate-900 dark:text-white"}>
          <h1 className={`font-black uppercase tracking-[0.2em] ${titleSize} font-sans leading-none`}>
            LUMINA
          </h1>
          <p className="text-[9px] uppercase tracking-[0.25em] opacity-80 font-bold mt-1">
            Multi-Category Store
          </p>
        </div>
      )}
    </div>
  );
}
