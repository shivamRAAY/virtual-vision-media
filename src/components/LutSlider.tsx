'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles, Check } from 'lucide-react';

const PRESETS = [
  { id: 'kodak-500t', name: 'Kodak 500T Cine', tone: 'Warm golden skin, deep green-tinted shadows, rich film toe' },
  { id: 'fuji-eterna', name: 'Fuji Eterna 250D', tone: 'Soft pastel roll-off, desaturated greens, subtle cold shadows' },
  { id: 'teal-orange', name: 'Blockbuster Teal/Orange', tone: 'Dynamic complimentary split, separated skin tones, cinema punch' },
  { id: 'monochrome-tri-x', name: 'Tri-X B&W Silver', tone: 'Optical silver-halide contrast, crisp highlight glow' },
];

export const LutSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(52); // percentage
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-vvm-border p-6 md:p-8 shadow-card">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-vvm-accent uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Color Engine</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-vvm-text tracking-tight">
            Raw Camera Log vs. VVM Precision Grade
          </h3>
          <p className="text-sm text-vvm-muted mt-0.5">
            Drag the slider to inspect highlight roll-off and skin tone protection.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activePreset.id === preset.id
                  ? 'bg-vvm-text text-white shadow-subtle'
                  : 'bg-vvm-soft/70 hover:bg-vvm-soft text-vvm-muted hover:text-vvm-text'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split Comparison Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden cursor-ew-resize select-none bg-vvm-soft"
      >
        {/* Layer 1: AFTER (Graded VVM) - Full view */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url('/hero-banner-2k.png')`,
            backgroundPosition: '68% 45%',
            filter:
              activePreset.id === 'kodak-500t'
                ? 'contrast(1.22) saturate(1.28) sepia(0.08) brightness(1.02)'
                : activePreset.id === 'fuji-eterna'
                ? 'contrast(1.10) saturate(0.92) hue-rotate(-5deg) brightness(1.05)'
                : activePreset.id === 'teal-orange'
                ? 'contrast(1.30) saturate(1.40) hue-rotate(10deg) brightness(0.98)'
                : 'contrast(1.45) grayscale(1) brightness(1.05)',
          }}
        >
          {/* Badge: Graded */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-vvm-text/80 backdrop-blur-md text-white text-[11px] font-mono font-medium flex items-center gap-1.5 shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>VVM CineGrade (65x 3D LUT)</span>
          </div>
        </div>

        {/* Layer 2: BEFORE (Raw Flat Log) - Clipped by slider percentage */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
              backgroundImage: `url('/hero-banner-2k.png')`,
              backgroundPosition: '68% 45%',
              // Flat log simulation: low contrast, lifted shadows, washed highlights
              filter: 'contrast(0.68) saturate(0.55) brightness(1.15)',
            }}
          >
            {/* Badge: Raw Log */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-mono font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Camera Log (Flat Sensor Data)</span>
            </div>
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
          <div className="absolute w-10 h-10 rounded-full bg-white text-vvm-text shadow-apple border border-vvm-border flex items-center justify-center font-bold text-xs tracking-tighter">
            ↔
          </div>
        </div>

        {/* Bottom Instruction Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-mono pointer-events-none">
          Drag horizontally to inspect grade
        </div>
      </div>

      {/* Preset Details Footer */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-vvm-muted">
        <div>
          <span className="text-vvm-text font-semibold">{activePreset.name}:</span>{' '}
          {activePreset.tone}
        </div>
        <div className="flex items-center gap-2 text-vvm-accent font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>Zero Banding 65x Mathematical Matrix</span>
        </div>
      </div>

    </div>
  );
};
