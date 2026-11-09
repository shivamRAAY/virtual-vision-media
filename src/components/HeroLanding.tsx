'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, ShieldCheck, Download, ChevronDown, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

interface HeroLandingProps {
  onReplayIntro: () => void;
  onScrollToTimeline: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onReplayIntro, onScrollToTimeline }) => {
  const { addToCart } = useCart();
  const masterBundle = PRODUCTS[0];

  return (
    <section className="relative w-full min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#F7F7F5]">
      
      {/* 1. Official High-Resolution 2.5K 3D Hero Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-landing-bg-ultra.png"
          alt="Virtual Vision Media 100GB SSD Vault 3D Background"
          fill
          priority
          className="object-cover object-right md:object-center select-none"
          sizes="100vw"
        />

        {/* Studio vignette wash on left for maximum typography legibility across mobile & desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/85 sm:via-[#F7F7F5]/70 to-transparent w-full md:w-3/5 lg:w-[52%] pointer-events-none" />
        
        {/* Soft bottom edge blend into scroll sequence */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#F7F7F5] via-[#F7F7F5]/80 to-transparent pointer-events-none" />
        
        {/* Soft top edge blend into navbar */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#F7F7F5]/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. Responsive Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-8 my-auto">
        <div className="max-w-2xl space-y-6">
          
          {/* Brand Emblem Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/vvm-logo.png"
                alt="VVM Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-sm tracking-widest uppercase text-vvm-text">
                VIRTUAL VISION MEDIA
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-vvm-muted block -mt-0.5">
                Create Beyond Limits
              </span>
            </div>
          </div>

          {/* Master Headline matching official design */}
          <div className="space-y-1">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tightest text-vvm-text leading-[0.92]">
              100GB
            </h1>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tightest text-vvm-text uppercase leading-[1.05]">
              VIDEO EDITOR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-text via-vvm-graphite to-vvm-accent">
                ASSETS BUNDLE
              </span>
            </div>
          </div>

          {/* Subtitles & Category Pills */}
          <div className="space-y-3 max-w-xl">
            <p className="text-lg sm:text-xl font-medium text-vvm-text leading-snug">
              The Ultimate Creative Toolkit for Filmmakers & Creators
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-vvm-muted">
              <span>LUTs</span>
              <span>•</span>
              <span>SFX</span>
              <span>•</span>
              <span>Motion Graphics</span>
              <span>•</span>
              <span>Overlays</span>
              <span>•</span>
              <span>Transitions</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            
            {/* Get Instant Access Button */}
            <button
              onClick={() => addToCart(masterBundle)}
              className="px-8 py-4 rounded-2xl bg-vvm-text hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest shadow-elevated hover:shadow-glow transition-all flex items-center justify-center gap-3 group"
            >
              <span>GET INSTANT ACCESS</span>
              <span className="text-emerald-400 font-mono text-xs font-bold">₹49</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Instant Digital Download badge */}
            <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted px-1">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Instant Digital Download</span>
            </div>

            {/* Replay 3D Intro Button */}
            <button
              onClick={onReplayIntro}
              className="px-4 py-3 rounded-2xl bg-white/90 hover:bg-white text-vvm-text text-xs font-mono font-medium border border-vvm-border transition-colors flex items-center justify-center gap-2 shadow-subtle backdrop-blur-md"
              title="Re-watch the 3D element assembly animation"
            >
              <Play className="w-3.5 h-3.5 fill-current text-vvm-accent" />
              <span>Replay 3D Intro</span>
            </button>

          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-vvm-muted">
            <span className="flex items-center gap-1.5 text-vvm-text font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Universal .CUBE / WAV / ProRes</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-vvm-text font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>DaVinci, Premiere, FCPX, CapCut</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-vvm-text font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>102.4 GB Verified Uncompressed</span>
            </span>
          </div>

        </div>
      </div>

      {/* 3. Bottom Scroll Cue into the Scrollytelling Sequence */}
      <div
        className="relative z-10 pb-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
        onClick={onScrollToTimeline}
      >
        <span className="text-xs font-mono uppercase tracking-widest text-vvm-muted group-hover:text-vvm-text transition-colors">
          Scroll to explore the 100GB Vault & interactive tools
        </span>
        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-vvm-border shadow-subtle flex items-center justify-center text-vvm-text group-hover:bg-white transition-colors">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

    </section>
  );
};
