'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, Maximize2, X, Check, ShieldCheck, Eye, Layers } from 'lucide-react';
import { Vault3DInteractiveBlueprint } from '@/components/Vault3DInteractiveBlueprint';

interface VaultInteractivePosterProps {
  src: string;
  alt: string;
  className?: string;
}

export const VaultInteractivePoster: React.FC<VaultInteractivePosterProps> = ({
  src,
  alt,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [isHovered, setIsHoveredState] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const setIsHovered = (val: boolean) => {
    isHoveredRef.current = val;
    setIsHoveredState(val);
  };

  // Mouse physics state
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [transformStyle, setTransformStyle] = useState('');
  const rafId = useRef<number | null>(null);

  // Smooth lerp animation loop for realistic physical feel
  const updatePhysics = useCallback(() => {
    // Lerp towards target
    const ease = 0.12;
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    const maxTilt = 10; // degrees
    const rotY = (currentX.current * maxTilt).toFixed(2);
    const rotX = (-currentY.current * maxTilt).toFixed(2);
    const elevation = isHoveredRef.current ? 16 : 0;
    const scale = isHoveredRef.current ? 1.03 : 1.0;

    // Dynamic 3D transform with perspective
    setTransformStyle(
      `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, 1) translateZ(${elevation}px)`
    );

    // Keep loop alive if moving or hovered
    const isSettled =
      Math.abs(targetX.current - currentX.current) < 0.001 &&
      Math.abs(targetY.current - currentY.current) < 0.001;

    if (!isSettled || isHoveredRef.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    } else {
      rafId.current = null;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized [-1, 1] from center
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    targetX.current = normX;
    targetY.current = normY;

    // Glare position in percent [0, 100]
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetX.current = 0;
    targetY.current = 0;
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        
        {/* Ambient atmospheric purple/blue glow aura behind the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-vvm-accent/25 via-purple-500/15 to-indigo-500/20 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* 3D Interactive Tilt Card Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group relative w-full max-w-sm sm:max-w-md aspect-[764/1024] cursor-pointer select-none rounded-3xl bg-white p-2.5 sm:p-3 shadow-2xl border border-white/60 transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(108,99,255,0.35)] will-change-transform"
          style={{
            transform: transformStyle || 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'box-shadow 0.3s ease' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease',
          }}
          onClick={() => setIsZoomed(true)}
          title="Click to inspect 150+ folders full view"
        >
          {/* Inner Image Container with Rounded Corners & Chamfered Frame */}
          <div className="relative size-full overflow-hidden rounded-2xl bg-[#F7F7F5] border border-black/5">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
              priority
              className="object-contain"
            />

            {/* Premium Holographic Specular Glare Layer (Follows Mouse Movement) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
              style={{
                opacity: glarePos.opacity,
                background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.1) 45%, transparent 70%)`,
              }}
            />

            {/* Subtle Iridescent Linear Shimmer on Hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${(glarePos.x - 50) * 0.4}%)`,
              }}
            />

            {/* Floating 3D Badge: Click to Zoom / Inspect */}
            <div
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border border-white/20 shadow-elevated flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              style={{ transform: 'translateZ(26px)' }}
            >
              <Maximize2 className="w-3 h-3 text-vvm-accentSubtle" />
              <span>Full View</span>
            </div>

            {/* Floating 3D Badge: 150+ Folders Verified */}
            <div
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border border-emerald-400/40 shadow-elevated flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              style={{ transform: 'translateZ(26px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>150+ Folders • 100GB+</span>
            </div>
          </div>
        </div>

        {/* Caption below image */}
        <div className="flex items-center gap-3 text-xs font-mono text-vvm-muted mt-3 select-none">
          <span className="flex items-center gap-1.5 text-vvm-text font-semibold">
            <Layers className="w-3.5 h-3.5 text-vvm-accent" />
            <span>150+ Categorized Editorial Folders</span>
          </span>
          <span>•</span>
          <span>100GB+ Verified Assets</span>
          <span>•</span>
          <span className="text-emerald-600 font-bold">₹49 Only</span>
        </div>

      </div>

      {/* 3D INTERACTIVE MASTER BLUEPRINT MODAL (REPLACES STATIC IMAGE WITH INTERACTIVE ANIMATED 3D STAGE) */}
      <Vault3DInteractiveBlueprint
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
      />
    </>
  );
};

export default VaultInteractivePoster;
