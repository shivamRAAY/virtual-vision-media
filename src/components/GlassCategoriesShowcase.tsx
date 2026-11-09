'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Sparkles, ArrowRight, Download, Eye, Check, Folder } from 'lucide-react';
import GlassFolder, { FolderFile } from '@/components/ui/glass-folder-cards';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export const GlassCategoriesShowcase: React.FC = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedFileNotice, setSelectedFileNotice] = useState<string | null>(null);

  const masterBundle = PRODUCTS[0];

  const handleFileSelect = (file: FolderFile, index: number, folderName: string) => {
    setSelectedFileNotice(`Selected "${file.name}" from ${folderName}`);
    setTimeout(() => {
      setSelectedFileNotice(null);
    }, 3500);
  };

  return (
    <section id="categories" className="relative py-24 sm:py-32 bg-white border-y border-vvm-border overflow-hidden">
      
      {/* Subtle Studio Dotted Ambient Canvas Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-vvm-text opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.4px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vvm-soft text-xs font-mono text-vvm-accent font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>The Digital Creative Vault Architecture</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tightest text-vvm-text leading-[1.08]">
              Precision Folders for Modern Editors.
            </h2>
            
            <p className="text-sm sm:text-base text-vvm-muted leading-relaxed">
              Real frosted-glass pockets drawn in continuous mathematical depth. Hover any folder to lean its glass hinge forward; click or tap to fan out the uncompressed master files.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs font-mono text-vvm-muted">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vvm-bg border border-vvm-border shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive 3D Glass Physics</span>
            </div>
            <span>Hover to lean • Click to fan • Drag & drop ready</span>
          </div>
        </div>

        {/* Floating File Selection Notification Toast */}
        {selectedFileNotice && (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeIn flex items-center gap-3 px-4 py-3 rounded-2xl bg-vvm-text text-white shadow-2xl border border-white/20 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-vvm-accent flex-shrink-0" />
            <span>{selectedFileNotice}</span>
            <button
              onClick={() => setSelectedFileNotice(null)}
              className="ml-2 text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* 6 Glass Folder Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16 items-start justify-items-center pt-4">
          
          {/* 1. CINEMATIC LUTS & COLOR GRADING */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Cinematic LUTs"
              meta="650+ .CUBE Profiles"
              tone="light"
              art="ember"
              seed={101}
              action="more"
              appearDelay={0}
              labelPlacement="bottom-left"
              files={[
                { name: "Kodak Vision3 500T 5219", meta: ".CUBE · 65x Matrix", art: "ember" },
                { name: "Arri Alexa 709 Film Tone", meta: "Rec.709 · High DR", art: "aurora" },
                { name: "Fuji Eterna 250D Soft", meta: "Pastel Halation", art: "dusk" },
                { name: "Blockbuster Teal & Orange", meta: "Hollywood Contrast", art: "verdant" },
                { name: "Sony S-Log3 to CineEI", meta: "Highlight Roll-off" },
                { name: "Apple Log 10-bit HDR", meta: "ProRes Log Gamma" },
              ]}
              menu={[
                { label: "Inspect 65x Mathematical Curves" },
                { label: "Explore LUT Collection", onSelect: () => window.location.href = '/store?category=luts' },
                { label: "Add Master Vault to Cart", onSelect: () => addToCart(masterBundle) },
              ]}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Cinematic LUTs")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                01 / Color Science
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                Zero-banding 65x 3D LUT tables for DaVinci, Premiere, FCPX and CapCut.
              </p>
            </div>
          </div>

          {/* 2. TRANSITIONS & MOTION */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Transitions & Motion"
              meta="350+ ProRes 422"
              tone="dark"
              art="aurora"
              seed={202}
              action="more"
              labelPlacement="top-left"
              appearDelay={120}
              files={[
                { name: "Optical Glass Swipe 04", meta: "4K 60fps · Alpha", art: "glacier" },
                { name: "Kinetic Whip Pan Right", meta: "Motion Blur Stems", art: "aurora" },
                { name: "Analog Film Flash Burn", meta: "Kodak 35mm Gate", art: "ember" },
                { name: "Prism Lens Refraction", meta: "Optical Bokeh", art: "dusk" },
                { name: "Digital Glitch Impact", meta: "Cyber Distortion" },
              ]}
              menu={[
                { label: "Preview Motion Stems" },
                { label: "Explore Transitions Pack", onSelect: () => window.location.href = '/store?category=transitions' },
                { label: "Add Master Vault to Cart", onSelect: () => addToCart(masterBundle) },
              ]}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Transitions & Motion")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                02 / Motion Dynamics
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                Pre-keyed Apple ProRes 422 clips with native alpha transparency.
              </p>
            </div>
          </div>

          {/* 3. OVERLAYS & TEXTURES */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Overlays & Textures"
              meta="200+ 4K Optical Scans"
              tone="light"
              art="dusk"
              seed={303}
              action="more"
              appearDelay={240}
              files={[
                { name: "Kodak 500T 35mm Grain", meta: "ProRes 4444 · Scan", art: "dusk" },
                { name: "16mm Vintage Film Gate", meta: "Perforated Loop", art: "ember" },
                { name: "Anamorphic Blue Streaks", meta: "Optically Captured", art: "aurora" },
                { name: "Dust, Scratches & Hair", meta: "Alpha Matte 4K", art: "glacier" },
                { name: "CRT Phosphor Texture", meta: "Scanlines & Flicker" },
              ]}
              menu={[
                { label: "Inspect Optical Grain" },
                { label: "Explore Overlays Pack", onSelect: () => window.location.href = '/store?category=overlays' },
                { label: "Add Master Vault to Cart", onSelect: () => addToCart(masterBundle) },
              ]}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Overlays & Textures")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                03 / Analog Optics
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                Scanned from physical 35mm & 16mm celluloid rolls on Lasergraphics Director.
              </p>
            </div>
          </div>

          {/* 4. MEMES, SOCIAL STICKERS & REACTIONS */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Memes & Stickers"
              meta="500+ Viral Alpha PNGs"
              tone="light"
              art="verdant"
              seed={404}
              action="add"
              appearDelay={360}
              labelPlacement="bottom-left"
              files={[
                { name: "Kinetic Flame Skull", meta: "Transparent · 4K", art: "ember" },
                { name: "Viral Red Arrow & Circle", meta: "Vector Scalable", art: "aurora" },
                { name: "Pop-up Notification UI", meta: "iOS & Mac Glass", art: "glacier" },
                { name: "3D Glossy Emoji Pack", meta: "High Res Alpha", art: "verdant" },
                { name: "Creator Doodle Stems", meta: "Vector SVG & PNG" },
                { name: "Sound Reaction Badges", meta: "Meme SFX Stems" },
              ]}
              onAdd={(files) => ({
                name: `Custom Editor Meme #${files.length + 1}`,
                meta: "Just Added · 4K Alpha",
                art: "verdant",
              })}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Memes & Stickers")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                04 / Viral Creator Assets
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                High-engagement transparent stickers, reaction memes & viral UI popups.
              </p>
            </div>
          </div>

          {/* 5. LOGOS & VECTOR BRANDING */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Logos & Vector Assets"
              meta="250+ Clean Vectors"
              tone="dark"
              art="glacier"
              seed={505}
              action="more"
              labelPlacement="top-right"
              appearDelay={480}
              files={[
                { name: "YouTube / TikTok Badges", meta: "SVG · EPS · PNG", art: "glacier" },
                { name: "Kinetic Lower Third Tags", meta: "Customizable MOGRT", art: "aurora" },
                { name: "Sponsor Bug Watermarks", meta: "Alpha Clean Plates", art: "dusk" },
                { name: "Minimal Channel Monogram", meta: "DaVinci Macro", art: "ember" },
                { name: "Verified Creator Shield", meta: "3D Metallic Vector" },
              ]}
              menu={[
                { label: "Inspect Vector Assets" },
                { label: "Explore Titles & Typography", onSelect: () => window.location.href = '/store?category=titles' },
                { label: "Add Master Vault to Cart", onSelect: () => addToCart(masterBundle) },
              ]}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Logos & Vectors")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                05 / Vector Identity
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                Infinitely scalable SVG vector emblems, platform badges & lower-third bugs.
              </p>
            </div>
          </div>

          {/* 6. SOUND EFFECTS & BROADCAST FOLEY */}
          <div className="flex flex-col items-center space-y-4">
            <GlassFolder
              label="Sound FX 96kHz"
              meta="450+ 24-bit WAV"
              tone="dark"
              art="ember"
              seed={606}
              action="more"
              labelPlacement="bottom-left"
              appearDelay={600}
              files={[
                { name: "Deep Sub Cinematic Boom", meta: "96kHz · 24-bit WAV", art: "ember" },
                { name: "Organic Air Whip Whoosh", meta: "Stereo 3D Field", art: "aurora" },
                { name: "Mechanical Camera Shutter", meta: "Tactile Foley", art: "glacier" },
                { name: "Analog Tape Stop Glitch", meta: "Tape Saturation", art: "dusk" },
                { name: "Tension Drone Atmosphere", meta: "Low Sub Bass" },
              ]}
              menu={[
                { label: "Audition SFX Library" },
                { label: "Explore Sound FX Pack", onSelect: () => window.location.href = '/store?category=sfx' },
                { label: "Add Master Vault to Cart", onSelect: () => addToCart(masterBundle) },
              ]}
              onFileSelect={(file, i) => handleFileSelect(file, i, "Sound FX 96kHz")}
            />
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text block">
                06 / Surgical Audio
              </span>
              <p className="text-xs text-vvm-muted max-w-[280px]">
                Recorded at 96,000 Hz in anechoic chambers with Sennheiser MKH 416 & 8040.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Callout Bar */}
        <div className="p-8 rounded-3xl bg-[#F7F7F5] border border-vvm-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-subtle">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-vvm-text flex items-center justify-center sm:justify-start gap-2">
              <Folder className="w-4 h-4 text-vvm-accent" />
              <span>All 6 Disciplines Unified in the 100GB Vault</span>
            </h4>
            <p className="text-xs text-vvm-muted">
              Get all 2,500+ master files across LUTs, Motion, Overlays, Memes, Vectors, and 96kHz SFX in one download.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => addToCart(masterBundle)}
              className="px-6 py-3.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center gap-2 transition-all"
            >
              <span>Unlock All Folders (₹49)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/store"
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-vvm-soft text-vvm-text text-xs font-mono font-medium border border-vvm-border transition-colors"
            >
              Store Catalog
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
