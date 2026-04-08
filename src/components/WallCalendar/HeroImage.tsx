import React from 'react';

interface HeroImageProps {
  monthName: string;
  year: number;
}

export default function HeroImage({ monthName, year }: HeroImageProps) {
  return (
    <div className="hero">
      {/* Mountain landscape SVG — mirrors the reference photo */}
      <svg
        className="hero-bg"
        viewBox="0 0 680 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Sky gradient layers */}
        <rect width="680" height="220" fill="#a8b8c4" />
        <rect width="680" height="110" fill="#bfd0db" opacity="0.55" />
        <rect width="680" height="60" fill="#d4e4ed" opacity="0.35" />

        {/* Distant cloud wisps */}
        <ellipse cx="100" cy="42" rx="80" ry="18" fill="#dce9f0" opacity="0.45" />
        <ellipse cx="160" cy="36" rx="55" ry="13" fill="#e4eff5" opacity="0.4" />
        <ellipse cx="490" cy="30" rx="100" ry="16" fill="#dce9f0" opacity="0.35" />
        <ellipse cx="580" cy="44" rx="65" ry="12" fill="#e4eff5" opacity="0.3" />

        {/* Far-right background mountain */}
        <polygon points="560,220 640,110 720,220" fill="#7a8d9a" />
        <polygon points="520,220 610,125 700,220" fill="#6d8090" />

        {/* Far-left background hill */}
        <polygon points="-20,220 60,130 160,220" fill="#7e9098" />
        <polygon points="0,220 80,145 130,220" fill="#7a8c96" />

        {/* Main rock slab — the diagonal feature from reference */}
        {/* Dark underside */}
        <polygon points="90,220 220,80 500,220" fill="#4e5c6a" />
        {/* Bright upper face of slab */}
        <polygon points="200,220 290,65 480,220 380,220" fill="#8fa0ae" />
        {/* Highlight vein on slab */}
        <polygon points="270,100 310,68 350,100 310,90" fill="#a8b9c4" opacity="0.6" />

        {/* Snow/ice patches on peak */}
        <polygon points="280,90 295,62 310,90 295,85" fill="white" opacity="0.75" />
        <polygon points="295,62 305,70 290,82" fill="white" opacity="0.5" />

        {/* Rock texture lines (subtle) */}
        <line x1="220" y1="80" x2="290" y2="180" stroke="#5a6875" strokeWidth="1" opacity="0.3" />
        <line x1="250" y1="75" x2="310" y2="175" stroke="#5a6875" strokeWidth="0.8" opacity="0.25" />
        <line x1="320" y1="68" x2="360" y2="160" stroke="#8a9aa8" strokeWidth="0.8" opacity="0.2" />

        {/* Left dark cliff face */}
        <polygon points="0,220 0,160 140,220" fill="#3d4d58" />
        <polygon points="0,220 60,170 0,200" fill="#2e3d48" />

        {/* ── Climber figure (matches reference: red jacket, ice pick raised) ── */}
        <g transform="translate(368, 118) rotate(-18)">
          {/* Legs */}
          <line x1="0" y1="30" x2="-10" y2="56" stroke="#2c3a46" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="30" x2="8" y2="56" stroke="#2c3a46" strokeWidth="4" strokeLinecap="round" />
          {/* Boot details */}
          <line x1="-10" y1="56" x2="-16" y2="58" stroke="#1a2830" strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="56" x2="14" y2="58" stroke="#1a2830" strokeWidth="3" strokeLinecap="round" />
          {/* Torso — red jacket */}
          <line x1="0" y1="5" x2="0" y2="30" stroke="#c0392b" strokeWidth="6" strokeLinecap="round" />
          {/* Arms — left arm reaching up with ice pick */}
          <line x1="0" y1="12" x2="18" y2="-14" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
          {/* Ice pick shaft */}
          <line x1="18" y1="-14" x2="24" y2="-20" stroke="#8a9a6a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ice pick head */}
          <line x1="20" y1="-22" x2="28" y2="-16" stroke="#6a7a5a" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm braced */}
          <line x1="0" y1="14" x2="-12" y2="24" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="1" cy="-4" r="6" fill="#d4a678" />
          {/* Helmet */}
          <ellipse cx="1" cy="-8" rx="7" ry="5" fill="#c0392b" />
          {/* Backpack hint */}
          <rect x="2" y="8" width="8" height="14" rx="2" fill="#b83020" opacity="0.7" />
        </g>

        {/* Pebble/debris scatter at climber's feet */}
        <circle cx="382" cy="158" r="2" fill="#9aabba" opacity="0.6" />
        <circle cx="375" cy="162" r="1.5" fill="#8a9aa8" opacity="0.5" />
        <circle cx="390" cy="160" r="1" fill="#9aabba" opacity="0.4" />
      </svg>

      {/* Blue diagonal wave cutout — bottom left, exactly as in reference */}
      <svg className="hero-wave" viewBox="0 0 340 52" preserveAspectRatio="none" aria-hidden="true">
        {/* White angled panel */}
        <path d="M0,52 L0,0 L270,0 Q305,0 305,28 Q305,52 340,52 Z" fill="white" />
        {/* Blue accent diagonal */}
        <path d="M0,0 L218,0 Q256,0 276,20 Q290,36 326,52 L256,52 Q228,32 212,12 Z" fill="#1E9BD4" />
      </svg>

      {/* Month/year badge — bottom right */}
      <div className="hero-badge" aria-label={`${monthName} ${year}`}>
        <span className="hero-year">{year}</span>
        <span className="hero-month">{monthName}</span>
      </div>
    </div>
  );
}
