"use client";

import * as React from "react";
import Link from "next/link";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import { Sparkles, ArrowRight, Eye } from "lucide-react";

// Curated 100% local video editing, LUT color grading, VFX, sound, and cinema assets
const CINEMATIC_IMAGES: TiltedGridImage[] = [
  {
    src: "/showcase/video_editing_timeline.jpg",
    alt: "NLE Timeline with Multitrack Video Editing & Waveforms",
  },
  {
    src: "/showcase/cinema_clapperboard.jpg",
    alt: "Classic Cinema Film Clapperboard on Production Set",
  },
  {
    src: "/showcase/cyberpunk_color_grade.jpg",
    alt: "High-Contrast Teal & Orange Hollywood Color Grade",
  },
  {
    src: "/showcase/cinematic_golden_lut.jpg",
    alt: "Kodak 500T Cine Warm Golden Hour Lighting LUT",
  },
  {
    src: "/showcase/retro_glitch_overlay.jpg",
    alt: "CRT Scanline Glitch & Chromatic Aberration Overlays",
  },
  {
    src: "/showcase/film_grain_texture.jpg",
    alt: "Tactile 35mm Optical Celluloid Film Grain",
  },
  {
    src: "/showcase/cinema_camera_lens.jpg",
    alt: "Cinema Anamorphic Lens Flare & Glass Prism Optics",
  },
  {
    src: "/showcase/aurora_visual_effects.jpg",
    alt: "Luminous Particle VFX & Spectral Light Leaks",
  },
  {
    src: "/showcase/audio_mixing_console.jpg",
    alt: "96kHz Broadcast Sound FX & Foley Mixing Console",
  },
  {
    src: "/showcase/editor_suite_desk.jpg",
    alt: "Color Grading Suite Dual-Monitor Editing Setup",
  },
  {
    src: "/showcase/atmospheric_film_smoke.jpg",
    alt: "Film Noir Volumetric Smoke & High Contrast Shadows",
  },
  {
    src: "/showcase/film_studio_lights.jpg",
    alt: "Professional Studio Production Lighting Rig",
  },
];

export function TiltedGridShowcase() {
  return (
    <section
      id="tilted-grid-showcase"
      className="relative w-full py-16 sm:py-24 overflow-hidden bg-vvm-bg border-y border-vvm-border"
    >
      {/* Top Header — Clean & Centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Full-Width Spatial 3D Stream • Edge-to-Edge Cylindrical Viewport</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-vvm-text">
          Every Frame, Brought Into Focus
        </h2>
        <p className="text-sm sm:text-base text-vvm-muted max-w-2xl mx-auto leading-relaxed">
          Real video editing timelines, cinematic LUT color grades, optical film grain, and VFX motion curves streaming across your entire display.
        </p>
      </div>

      {/* Edge-to-Edge 3D Cylindrical Reel — No Box, No Side Borders */}
      <div className="relative w-full overflow-hidden">
        <TiltedGridHero
          images={CINEMATIC_IMAGES}
          speed={4.5}
          tileHeight={34}
          aspectRatio={16 / 9}
          gap={8}
          axis={50}
          curve={78}
          fade={7}
          className="h-[580px] sm:h-[660px] md:h-[720px] w-full"
        >
          {/* Centered Floating Content Overlay */}
          <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 sm:py-16 text-center pointer-events-none">
            
            {/* Top Badge */}
            <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-vvm-border text-xs font-mono text-vvm-graphite shadow-apple">
              <Sparkles className="w-3.5 h-3.5 text-vvm-accent" />
              <span>16 Facet Slices / Tile • Hardware Composited 3D Matrix</span>
            </div>

            {/* Main Center Typography */}
            <div className="px-6 max-w-2xl space-y-4">
              <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
                Every frame,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-text via-vvm-graphite to-vvm-accent">
                  brought into focus.
                </span>
              </h1>
              <p className="max-w-md mx-auto text-balance text-sm sm:text-base text-muted-foreground leading-relaxed">
                Images curve in from one screen edge, flatten out at the centre, then fade away round the other.
              </p>
            </div>

            {/* Interactive Call-To-Action Pills */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 px-6">
              <a
                href="#bundle-showcase"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vvm-text text-white text-xs sm:text-sm font-medium hover:bg-vvm-accent transition-all duration-200 shadow-card hover:shadow-glow"
              >
                <Sparkles className="w-4 h-4 text-vvm-accentSubtle" />
                <span>Acquire 100GB Bundle • ₹49</span>
              </a>

              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-vvm-border text-xs sm:text-sm font-medium text-vvm-text hover:bg-vvm-soft transition-colors shadow-subtle"
              >
                <Eye className="w-4 h-4 text-vvm-muted" />
                <span>Explore Disciplines</span>
              </a>
            </div>

          </div>
        </TiltedGridHero>
      </div>
    </section>
  );
}

export default TiltedGridShowcase;
