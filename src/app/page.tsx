'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Check,
  Folder,
  Layers,
  Cpu,
  Shield,
  Film,
  Music,
  Sliders,
  Type,
  FileCode,
  Download,
  Info,
  Maximize2,
  Play
} from 'lucide-react';
import { HeroSequence } from '@/components/HeroSequence';
import { GlassCategoriesShowcase } from '@/components/GlassCategoriesShowcase';
import { TiltedGridShowcase } from '@/components/TiltedGridShowcase';
import { ReviewsGlobeSection } from '@/components/ReviewsGlobeSection';
import { ProductCard } from '@/components/ProductCard';
import { VaultInteractivePoster } from '@/components/VaultInteractivePoster';
import { ContactCardSection } from '@/components/ContactCardSection';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { addToCart, setIsFreebiesOpen, setQuickViewProduct, setIsIntroOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSoftware, setSelectedSoftware] = useState('DaVinci Resolve');
  const [openFolderIndex, setOpenFolderIndex] = useState<number | null>(0);

  // Auto trigger opening animation on first visit
  useEffect(() => {
    try {
      const hasSeenIntro = sessionStorage.getItem('vvm_intro_seen');
      if (!hasSeenIntro) {
        setIsIntroOpen(true);
        sessionStorage.setItem('vvm_intro_seen', 'true');
      }
    } catch (e) {
      setIsIntroOpen(true);
    }
  }, [setIsIntroOpen]);

  const masterBundle = PRODUCTS[0];
  const featuredProducts = PRODUCTS.filter((p) => !p.isBundle);

  const softwareGuides = [
    {
      name: 'DaVinci Resolve',
      version: 'Studio & Free 18/19+',
      icon: '🎨',
      guide: 'Copy .CUBE LUTs directly into your DaVinci Resolve LUT directory. Drag ProRes 422 QuickTime clips above cut point on timeline with blend mode Normal or Overlay.',
      universalSupport: '100% Native Support for all .CUBE, ProRes 4444 & 24-bit 96kHz WAV files.'
    },
    {
      name: 'Adobe Premiere Pro',
      version: 'CC 2023 - 2025+',
      icon: '🎬',
      guide: 'Apply LUTs via Lumetri Color > Creative > Browse. Import .MOGRT kinetic titles via Essential Graphics panel. Drag audio WAV stems directly into timeline tracks.',
      universalSupport: 'Native Lumetri 3D LUT support and hardware ProRes decode.'
    },
    {
      name: 'Final Cut Pro',
      version: 'FCPX 10.6+',
      icon: '⚡',
      guide: 'Apply Custom LUT effect in the Inspector. ProRes 422 video clips retain pre-multiplied alpha transparency out-of-the-box.',
      universalSupport: 'Full Apple Silicon hardware acceleration for ProRes and 96kHz audio.'
    },
    {
      name: 'After Effects',
      version: 'CC 2023 - 2025+',
      icon: '✨',
      guide: 'Use Apply Color LUT effect for .CUBE tables. Overlays and film burns can be dropped into comps with Screen or Add blending mode.',
      universalSupport: 'Vector typography templates and 16-bit color depth precision.'
    },
    {
      name: 'CapCut Desktop / Pro',
      version: 'v3.0+',
      icon: '📱',
      guide: 'Import custom 3D LUTs into the Adjustment > LUTs tab. Drag 4K film burns and 96kHz WAV SFX onto supplementary tracks.',
      universalSupport: 'All universal video overlays and WAV audio stems load effortlessly.'
    }
  ];

  const currentGuide = softwareGuides.find((s) => s.name === selectedSoftware) || softwareGuides[0];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-vvm-text selection:bg-vvm-accent selection:text-white">
      
      {/* 1. UNIFIED 3D HERO LANDING & SCROLL ANIMATION (235 Master Frames) */}
      <div id="hero-vault">
        <HeroSequence />
      </div>

      {/* SECTION 2: BRAND INTRODUCTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border shadow-subtle text-xs font-mono text-vvm-muted">
              <span className="w-2 h-2 rounded-full bg-vvm-accent" />
              <span>The Virtual Vision Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tightest text-vvm-text leading-[1.08]">
              Built for creators.
              <br />
              <span className="text-vvm-muted">Made for better edits.</span>
            </h2>

            <p className="text-base sm:text-lg text-vvm-muted leading-relaxed">
              We started Virtual Vision Media because ordinary asset marketplaces are flooded with bloated file packs, outdated presets, and low-fidelity rips. Every asset in our vault is calibrated from the ground up on studio reference monitors, recorded at 96,000 Hz, and scanned from real 35mm optical film stock.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-vvm-border shadow-subtle">
                <div className="text-2xl font-bold font-mono text-vvm-text">0.0%</div>
                <div className="text-xs text-vvm-muted mt-1">Bloat or Filler Files</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-vvm-border shadow-subtle">
                <div className="text-2xl font-bold font-mono text-vvm-text">96 kHz</div>
                <div className="text-xs text-vvm-muted mt-1">24-Bit Broadcast WAV</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-vvm-border shadow-subtle">
                <div className="text-2xl font-bold font-mono text-vvm-text">100%</div>
                <div className="text-xs text-vvm-muted mt-1">Universal Formats</div>
              </div>
            </div>
          </div>

          {/* Interactive Software Guide Showcase */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-vvm-border p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-vvm-text">
                Your NLE Compatibility Matrix
              </h3>
              <span className="text-xs font-mono text-emerald-600 font-semibold">Verified</span>
            </div>

            {/* Software Tabs */}
            <div className="flex flex-wrap gap-2">
              {softwareGuides.map((soft) => (
                <button
                  key={soft.name}
                  onClick={() => setSelectedSoftware(soft.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    selectedSoftware === soft.name
                      ? 'bg-vvm-text text-white shadow-subtle font-semibold'
                      : 'bg-vvm-soft text-vvm-muted hover:text-vvm-text'
                  }`}
                >
                  {soft.name}
                </button>
              ))}
            </div>

            {/* Guide Info */}
            <div className="p-4 rounded-2xl bg-vvm-bg/60 border border-vvm-border/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentGuide.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-vvm-text">{currentGuide.name}</h4>
                  <span className="text-[11px] font-mono text-vvm-muted">{currentGuide.version}</span>
                </div>
              </div>

              <p className="text-xs text-vvm-text leading-relaxed">
                {currentGuide.guide}
              </p>

              <div className="pt-2 border-t border-vvm-border/60 flex items-center gap-1.5 text-[11px] font-mono text-vvm-accent font-medium">
                <Check className="w-3.5 h-3.5 text-vvm-accent" />
                <span>{currentGuide.universalSupport}</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-vvm-muted text-center">
              Works natively without requiring third-party plugins or subscriptions.
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: INTERACTIVE 3D GLASS FOLDER CATEGORIES ARCHITECTURE */}
      <GlassCategoriesShowcase />

      {/* SECTION 4: TILTED 3D CYLINDRICAL GRID SHOWCASE */}
      <TiltedGridShowcase />

      {/* SECTION 5: THE MAIN 100GB BUNDLE SHOWCASE */}
      <section id="bundle-showcase" className="py-24 bg-white border-t border-vvm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vvm-accent/10 border border-vvm-accent/30 text-vvm-accent text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Creative Vault • 102.4 GB Verified</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tightest text-vvm-text leading-[1.05]">
              The 100GB Video Editor Vault.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-text via-vvm-graphite to-vvm-accent">
                All 6 Disciplines. One Assembly.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-vvm-muted leading-relaxed">
              Every LUT, ProRes transition, 96kHz sound asset, 35mm grain plate, and motion template we produce, unified into one organized, uncompressed digital vault.
            </p>
          </div>

          {/* 3D Visual Mockup & Purchase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F7F7F5] rounded-3xl border border-vvm-border p-6 sm:p-10 lg:p-12 shadow-card">
            
            {/* Left 3D Interactive Mouse Moving Tilt Poster */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <VaultInteractivePoster
                src="/vvm-150-folders.jpg"
                alt="150+ Folders 100GB+ Video Editor Assets Library"
              />
            </div>

            {/* Right Detailed Specs & Immediate Purchase CTA */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-vvm-text">
                    ₹{masterBundle.price.toLocaleString('en-IN')}
                  </span>
                  {masterBundle.originalPrice && (
                    <span className="text-lg font-mono text-vvm-muted line-through">
                      ₹{masterBundle.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    Save 99% • Limited Deal
                  </span>
                </div>
                <p className="text-xs font-mono text-vvm-muted">
                  One-time investment • No recurring subscription • Lifetime commercial license
                </p>
              </div>

              {/* Highlights checklist */}
              <div className="space-y-2.5 text-xs font-sans">
                {masterBundle.features.slice(0, 5).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-vvm-text font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Verified Technical Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 bg-white rounded-xl border border-vvm-border">
                  <div className="text-vvm-muted text-[10px] uppercase">Uncompressed Size</div>
                  <div className="font-bold text-vvm-text">102.4 GB Verified</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-vvm-border">
                  <div className="text-vvm-muted text-[10px] uppercase">Asset Total</div>
                  <div className="font-bold text-vvm-text">2,500+ Master Files</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-vvm-border">
                  <div className="text-vvm-muted text-[10px] uppercase">Delivery Format</div>
                  <div className="font-bold text-vvm-text">Universal .CUBE / WAV / ProRes</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-vvm-border">
                  <div className="text-vvm-muted text-[10px] uppercase">Download Speed</div>
                  <div className="font-bold text-vvm-text">Cloudflare R2 Multi-Thread</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(masterBundle)}
                  className="flex-1 py-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Unlock Master 100GB Vault</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href={`/product/${masterBundle.id}`}
                  className="px-6 py-4 rounded-xl bg-white hover:bg-vvm-soft text-vvm-text text-xs font-mono font-medium border border-vvm-border text-center transition-colors"
                >
                  Inspect All Files
                </Link>
              </div>

            </div>

          </div>

          {/* Interactive Folder Structure Explorer */}
          <div className="bg-[#F7F7F5] rounded-3xl border border-vvm-border p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-vvm-text flex items-center gap-2">
                  <Folder className="w-4 h-4 text-vvm-accent" />
                  <span>Inspect Directory Structure Inside the 100GB Vault</span>
                </h3>
                <p className="text-xs text-vvm-muted mt-0.5">
                  Click any root directory to see organized subfolders and asset counts. Zero clutter.
                </p>
              </div>
              <span className="text-xs font-mono text-vvm-muted">6 Root Directories • 2,500+ Assets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterBundle.folderTree.map((folder, idx) => {
                const isOpen = openFolderIndex === idx;
                return (
                  <div
                    key={folder.name}
                    onClick={() => setOpenFolderIndex(isOpen ? null : idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isOpen
                        ? 'border-vvm-accent/50 shadow-subtle'
                        : 'border-vvm-border hover:border-vvm-silver/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-vvm-text">
                        <Folder className={`w-4 h-4 ${isOpen ? 'text-vvm-accent' : 'text-vvm-muted'}`} />
                        <span>{folder.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-vvm-muted">{folder.size}</span>
                    </div>

                    {folder.subfolders && (
                      <div className="mt-3 pt-3 border-t border-vvm-border/60 space-y-1.5 text-[11px] font-mono text-vvm-muted">
                        {folder.subfolders.map((sub) => (
                          <div key={sub.name} className="flex justify-between items-center">
                            <span className="truncate pr-2">↳ {sub.name}</span>
                            <span className="text-vvm-text">{sub.count} files</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: WHY VVM? (THE CREATIVE VAULT ADVANTAGE) */}
      <section id="why-vvm" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted mb-2">
            <Shield className="w-3.5 h-3.5 text-vvm-accent" />
            <span>Studio Engineering Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-vvm-text">
            Why professional editors rely on Virtual Vision Media.
          </h2>
          <p className="text-sm text-vvm-muted mt-1">
            We reject the template-farm model in favor of uncompromised studio quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-white border border-vvm-border shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-vvm-soft flex items-center justify-center text-vvm-accent font-mono text-xs font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-vvm-text">Universal Format Guarantee</h3>
            <p className="text-xs text-vvm-muted leading-relaxed">
              We never lock you into obscure proprietary plugin formats. All LUTs are standard .CUBE mathematical tables, all audio is standard broadcast WAV, and all motion elements are rendered in industry-standard Apple ProRes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-vvm-border shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-vvm-soft flex items-center justify-center text-vvm-accent font-mono text-xs font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-vvm-text">Verified Zero Bloat</h3>
            <p className="text-xs text-vvm-muted leading-relaxed">
              Generic bundles pad their size with low-quality filler and 50 variations of the same sound. Every single gigabyte in the VVM 100GB vault is distinct, uncompressed, and curated for real commercial editorial workflows.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-vvm-border shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-vvm-soft flex items-center justify-center text-vvm-accent font-mono text-xs font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-vvm-text">Lifetime Commercial License</h3>
            <p className="text-xs text-vvm-muted leading-relaxed">
              Use all assets across unlimited client projects, YouTube monetized channels, theatrical films, and streaming television. No recurring monthly subscription or per-seat billing surprises.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 7: INTERACTIVE 3D TESTIMONIAL GLOBE (VERIFIED INDIAN EDITORS) */}
      <ReviewsGlobeSection />

      {/* SECTION 8: FREEBIES ("Start creating. On us.") */}
      <section id="freebies" className="py-20 bg-white border-y border-vvm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#F7F7F5] border border-vvm-border flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-accent font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free Starter Pack • 1.2 GB</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-vvm-text">
                Start creating. On us.
              </h2>
              <p className="text-sm text-vvm-muted leading-relaxed">
                Taste the difference before investing. Get 5 calibrated Hollywood LUTs, 15 broadcast 96kHz SFX, 5 ProRes film burns, and 10 kinetic editorial titles with full commercial licensing.
              </p>
            </div>

            <button
              onClick={() => setIsFreebiesOpen(true)}
              className="px-8 py-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated transition-all flex items-center gap-2 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Explore Free Assets</span>
            </button>

          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL BRAND STATEMENT */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted">
          <span>Virtual Vision Media</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tightest text-vvm-text leading-[1.05]">
          Your vision. Your style.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-text via-vvm-graphite to-vvm-accent">
            Your next creation.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-vvm-muted max-w-xl mx-auto leading-relaxed">
          Create beyond limits with digital assets calibrated for the next generation of visual storytellers.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => addToCart(masterBundle)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center justify-center gap-2 transition-all"
          >
            <span>Get 100GB Master Vault (₹49)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/store"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-vvm-soft text-vvm-text text-xs font-mono font-medium border border-vvm-border transition-colors text-center"
          >
            Explore All Collections
          </Link>
        </div>
      </section>

      {/* SECTION 9: 21ST.DEV STYLE INTERACTIVE CONTACT CARD (EMAIL & INSTAGRAM) */}
      <ContactCardSection />

    </div>
  );
}
