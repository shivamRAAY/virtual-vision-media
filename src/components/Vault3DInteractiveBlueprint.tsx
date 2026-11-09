'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  ArrowRight,
  Tv,
  Film,
  Wand2,
  Palette,
  Volume2,
  Sliders,
  Layers,
  GraduationCap,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  FileText,
  CheckCircle,
  Eye,
  Maximize2,
  Cpu,
  Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { vvmSound } from '@/lib/vvmSoundFX';
import { vvmTelemetry } from '@/lib/vvmTelemetry';
import { HalftoneRepulsionText } from '@/components/ui/HalftoneRepulsionText';

interface Vault3DInteractiveBlueprintProps {
  isOpen: boolean;
  onClose: () => void;
}

// 8 Master Disciplines matching Image 3 Folders
export interface FolderData {
  id: string;
  name: string;
  category: string;
  color: string;
  borderColor: string;
  glowColor: string;
  emoji: string;
  filesCount: string;
  size: string;
  description: string;
  subfolders: string[];
  // Isometric position in 3D space (%)
  pos: { x: number; y: number; z: number };
}

const FOLDERS: FolderData[] = [
  {
    id: 'backgrounds',
    name: 'Backgrounds',
    category: 'Motion Backdrops & Wallpapers',
    color: 'from-blue-600/30 via-cyan-500/20 to-blue-900/40',
    borderColor: 'border-cyan-400/60',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    emoji: '🌌',
    filesCount: '450+ 4K Renders',
    size: '18.4 GB',
    description: 'Clean cycloramas, 4K animated loop backdrops, dark moody gradients, and 3D architectural sets.',
    subfolders: ['3D Abstract Voids', 'Studio Cycloramas', 'Dark Neo Gradients', 'Cyber Grid Loops', 'Volumetric Fog Plates'],
    pos: { x: 48, y: 14, z: 28 },
  },
  {
    id: 'animations',
    name: 'Animations',
    category: 'Kinetic Motion & Emojis',
    color: 'from-amber-500/30 via-orange-500/20 to-amber-900/40',
    borderColor: 'border-amber-400/60',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    emoji: '🎞️',
    filesCount: '320+ Elements',
    size: '12.8 GB',
    description: '3D animated emojis, kinetic stickers, dynamic call-to-actions, YouTube subscribe animations, and lower thirds.',
    subfolders: ['3D Apple/Fluent Emojis', 'Viral Meme Popups', 'Creator Lower Thirds', 'Kinetic Arrows & Pointers', 'Social Handles'],
    pos: { x: 68, y: 20, z: 22 },
  },
  {
    id: 'plugins',
    name: 'Plugins',
    category: 'Hardware Superpower Acceleration',
    color: 'from-purple-600/30 via-violet-500/20 to-indigo-900/40',
    borderColor: 'border-purple-400/60',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    emoji: '⚡',
    filesCount: '150+ Presets',
    size: '8.6 GB',
    description: 'Native drag-and-drop macros for Premiere Pro MOGRT, DaVinci Resolve Fusion, and Final Cut Pro XML templates.',
    subfolders: ['Premiere Pro MOGRTs', 'DaVinci Fusion Macros', 'After Effects Rig Templates', 'Final Cut Motion Generators'],
    pos: { x: 86, y: 30, z: 16 },
  },
  {
    id: 'luts',
    name: 'LUTs & Presets',
    category: 'Color Science & Gamma',
    color: 'from-emerald-500/30 via-teal-500/20 to-emerald-900/40',
    borderColor: 'border-emerald-400/60',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    emoji: '🎨',
    filesCount: '180+ .CUBE LUTs',
    size: '4.8 GB',
    description: 'Calibrated Hollywood film emulations for Sony S-Log3, Canon C-Log, Panasonic V-Log, Arri LogC, and DJI D-Log M.',
    subfolders: ['Kodak 500T Cine', 'Fujifilm Eterna 250D', 'Teal & Orange Blockbuster', 'Moody Emerald Noir', 'Golden Hour Cine'],
    pos: { x: 52, y: 38, z: 32 },
  },
  {
    id: 'sfx',
    name: 'Sound FX',
    category: '96kHz Broadcast Sound Design',
    color: 'from-slate-700/40 via-indigo-950/40 to-black/60',
    borderColor: 'border-indigo-400/60',
    glowColor: 'rgba(108, 99, 255, 0.7)',
    emoji: '🔊',
    filesCount: '850+ WAV Files',
    size: '18.2 GB',
    description: 'Broadcast-grade 96kHz / 24-bit uncompressed audio: cinematic sub-drops, whooshes, risers, mechanical clicks, and foley.',
    subfolders: ['Cinematic Sub Drops', 'High-Speed Whooshes', 'Mechanical UI Clicks', 'Analog Tape Stops', 'Broadcast Foley'],
    pos: { x: 70, y: 46, z: 24 },
  },
  {
    id: 'transitions',
    name: 'Transitions',
    category: 'ProRes 422 Alpha Wipes',
    color: 'from-indigo-600/30 via-purple-600/20 to-blue-900/40',
    borderColor: 'border-indigo-400/60',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    emoji: '🌀',
    filesCount: '350+ Clips',
    size: '28.4 GB',
    description: 'Seamless drag-and-drop optical transitions with embedded alpha channels: whip pans, glitch cuts, light leak wipes, and zooms.',
    subfolders: ['Whip Pan Alpha Wipes', 'Optical Light Leak Burns', 'Cyber Glitch Slices', 'Prism Glass Distortions', 'Film Roll Splicers'],
    pos: { x: 84, y: 56, z: 18 },
  },
  {
    id: 'overlays',
    name: 'Overlays',
    category: 'Fire, Cold, Water, Wind, Paper',
    color: 'from-pink-600/30 via-rose-500/20 to-red-900/40',
    borderColor: 'border-pink-400/60',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    emoji: '✨',
    filesCount: '300+ 4K Textures',
    size: '32.1 GB',
    description: 'Authentic 4K physical textures: blazing fire embers, frost ice crystals, rain droplets, atmospheric wind smoke, and ripped paper collages.',
    subfolders: ['Blazing Fire Embers', 'Cold Frost Ice Glass', 'Cinematic Rain Streaks', 'Atmospheric Wind Smoke', 'Torn Craft Paper'],
    pos: { x: 62, y: 64, z: 34 },
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    category: 'Trending Indian Memes & Workflows',
    color: 'from-amber-600/30 via-yellow-500/20 to-amber-900/40',
    borderColor: 'border-yellow-400/60',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    emoji: '🎓',
    filesCount: '15+ Hours & Meme Pack',
    size: '12.0 GB',
    description: 'Viral Indian creator memes, punchlines, and comprehensive step-by-step masterclasses for pacing, sound design, and retention.',
    subfolders: ['Arre Bhai Bhai Meme', 'Paisa Hi Paisa Hoga', 'Khatam Tata Bye Bye', 'Control Majnu Control', 'Scheme Bata De'],
    pos: { x: 80, y: 72, z: 28 },
  },
];

// Multiple Unique Wallpapers for "Backgrounds" folder clicks
const WALLPAPERS = [
  {
    id: 'tokyo-cyber',
    name: 'Tokyo Cyberpunk Neon',
    bgClass: 'bg-[#090A12]',
    gradient: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(108, 99, 255, 0.35), transparent 70%), radial-gradient(ellipse 70% 50% at 85% 85%, rgba(6, 182, 212, 0.25), transparent 60%)',
    textColor: 'text-white',
    gridColor: 'rgba(108, 99, 255, 0.12)',
    badgeColor: 'border-purple-400/40 text-purple-300',
  },
  {
    id: 'golden-hour',
    name: 'Hollywood Golden Hour',
    bgClass: 'bg-[#15110B]',
    gradient: 'radial-gradient(ellipse 80% 60% at 75% 20%, rgba(245, 158, 11, 0.35), transparent 70%), radial-gradient(ellipse 70% 50% at 20% 90%, rgba(217, 119, 6, 0.2), transparent 60%)',
    textColor: 'text-[#FFF7E8]',
    gridColor: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'border-amber-400/40 text-amber-300',
  },
  {
    id: 'studio-pearl',
    name: 'Studio Cyclorama Pearl',
    bgClass: 'bg-[#F6F7F9]',
    gradient: 'radial-gradient(circle at 50% 0%, rgba(108, 99, 255, 0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(240, 240, 245, 0.8), transparent 50%)',
    textColor: 'text-[#141416]',
    gridColor: 'rgba(0, 0, 0, 0.06)',
    badgeColor: 'border-black/15 text-gray-800',
  },
  {
    id: 'space-nebula',
    name: 'Cosmic Deep Space Nebula',
    bgClass: 'bg-[#06060A]',
    gradient: 'radial-gradient(ellipse at 30% 20%, rgba(236, 72, 153, 0.28), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(99, 102, 241, 0.3), transparent 70%)',
    textColor: 'text-white',
    gridColor: 'rgba(236, 72, 153, 0.1)',
    badgeColor: 'border-pink-400/40 text-pink-300',
  },
  {
    id: 'emerald-grid',
    name: 'Emerald Matrix Cyber Suite',
    bgClass: 'bg-[#08120E]',
    gradient: 'radial-gradient(ellipse at 50% 10%, rgba(16, 185, 129, 0.3), transparent 70%), radial-gradient(ellipse at 80% 90%, rgba(5, 150, 105, 0.2), transparent 60%)',
    textColor: 'text-emerald-50',
    gridColor: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'border-emerald-400/40 text-emerald-300',
  },
  {
    id: 'noir-shadow',
    name: 'Film Noir Architectural',
    bgClass: 'bg-[#0D0D10]',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
    textColor: 'text-gray-100',
    gridColor: 'rgba(255, 255, 255, 0.08)',
    badgeColor: 'border-gray-500/40 text-gray-300',
  },
];

// Indian Trending Memes for "Tutorials"
const INDIAN_MEMES = [
  {
    title: 'Arre Bhai Bhai Bhai!',
    subtitle: 'Nagar Palika Viral Cut',
    emoji: '🤣',
    dialogue: '“Bhai bhai bhai... ruko zara, sabar karo!”',
    color: 'from-amber-500 to-red-500',
    memeIcon: '🚨',
  },
  {
    title: 'Paisa Hi Paisa Hoga! 💰',
    subtitle: 'Phir Hera Pheri Raju Supreme',
    emoji: '🤑',
    dialogue: '“25 din mein paisa double! 100GB bundle ₹49 only!”',
    color: 'from-emerald-500 to-green-600',
    memeIcon: '💸',
  },
  {
    title: 'Khatam! Tata! Bye-Bye! 👋',
    subtitle: 'Iconic Farewell Export',
    emoji: '👋',
    dialogue: '“Khatam! Tata! Bye-bye! Goodbye! Gaya!”',
    color: 'from-blue-500 to-indigo-600',
    memeIcon: '🚀',
  },
  {
    title: 'Control Majnu Control! 🎨',
    subtitle: 'Welcome Movie Artistic Peak',
    emoji: '🎭',
    dialogue: '“Control Majnu control! Colors over-saturate mat karo!”',
    color: 'from-purple-500 to-pink-600',
    memeIcon: '🖌️',
  },
  {
    title: 'Chilla Chilla Ke Scheme Bata De! 🗣️',
    subtitle: 'High Retention Secret',
    emoji: '📢',
    dialogue: '“Chilla chilla ke sabko scheme bata de!”',
    color: 'from-orange-500 to-amber-600',
    memeIcon: '🔥',
  },
  {
    title: 'Kya Baat Hai Sir! 👏',
    subtitle: 'Master Edit Clap',
    emoji: '🌟',
    dialogue: '“Kya baat hai sir! Kya timing hai, kya cut hai!”',
    color: 'from-yellow-500 to-emerald-500',
    memeIcon: '🏆',
  },
];

// Overlays list
type OverlayType = 'fire' | 'cold' | 'water' | 'winds' | 'paper';
const OVERLAY_TYPES: { id: OverlayType; name: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'fire', name: '🔥 Fire & Ember Sparks', icon: <Flame className="w-4 h-4 text-orange-400" />, desc: 'Rising burning celluloid sparks & heat distortion' },
  { id: 'cold', name: '❄️ Cold Ice & Frost Crystals', icon: <Snowflake className="w-4 h-4 text-cyan-300" />, desc: 'Edge frost crystal creeping with blizzard chill' },
  { id: 'water', name: '💧 Rain Streaks & Water Ripples', icon: <Droplets className="w-4 h-4 text-blue-400" />, desc: 'Raindrops running down camera lens with ripples' },
  { id: 'winds', name: '💨 Volumetric Wind & Smoke', icon: <Wind className="w-4 h-4 text-gray-300" />, desc: 'Atmospheric cinematic fog & wind drafts' },
  { id: 'paper', name: '📜 Torn Craft Paper & Papercuts', icon: <FileText className="w-4 h-4 text-amber-200" />, desc: 'Ripped collage edges, crease folds & tape strips' },
];

// LUTs real images comparison
const LUTS_COMPARE = [
  {
    name: 'Kodak 500T Cine Golden Hour',
    src: '/showcase/cinematic_golden_lut.jpg',
    beforeLabel: 'Flat S-Log3 Raw (Flat Gamma)',
    afterLabel: 'Kodak 500T 3D Cine Matrix (Warm Golden)',
  },
  {
    name: 'Teal & Orange Hollywood Blockbuster',
    src: '/showcase/cyberpunk_color_grade.jpg',
    beforeLabel: 'Standard Rec.709 Video',
    afterLabel: 'Teal & Orange Hollywood Grade',
  },
  {
    name: '35mm Film Grain & Celluloid Emulsion',
    src: '/showcase/film_grain_texture.jpg',
    beforeLabel: 'Clean Digital Sensor',
    afterLabel: '35mm Optical Film Stock',
  },
  {
    name: 'Moody Film Noir Architectural Grade',
    src: '/showcase/atmospheric_film_smoke.jpg',
    beforeLabel: 'High-Key Standard Wash',
    afterLabel: 'Volumetric Film Noir Grade',
  },
];

export const Vault3DInteractiveBlueprint: React.FC<Vault3DInteractiveBlueprintProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const masterBundle = PRODUCTS[0];

  // Animation lifecycle: Folders emerge from SSD on open, suck back inside on close
  const [animStage, setAnimStage] = useState<'emerging' | 'floating' | 'retracting'>('emerging');
  const [activeFolder, setActiveFolder] = useState<FolderData>(FOLDERS[4]); // Sound FX default

  // Multiple click state counters
  const [bgIndex, setBgIndex] = useState(0);
  const [animIndex, setAnimIndex] = useState(0);
  const [sfxIndex, setSfxIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [memeIndex, setMemeIndex] = useState(0);
  const [lutIndex, setLutIndex] = useState(0);

  // Active active animation triggers
  const [showSuperpowerPlug, setShowSuperpowerPlug] = useState(false);
  const [showTransitionCut, setShowTransitionCut] = useState(false);
  const [showLutModal, setShowLutModal] = useState(false);
  const [lutSliderPos, setLutSliderPos] = useState(50);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType | null>(null);
  const [activeMeme, setActiveMeme] = useState<(typeof INDIAN_MEMES)[0] | null>(null);
  const [animParticles, setAnimParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [sfxPulseBars, setSfxPulseBars] = useState(false);

  const currentWallpaper = WALLPAPERS[bgIndex];

  // Handle open animation (emerge from SSD)
  useEffect(() => {
    if (isOpen) {
      setAnimStage('emerging');
      vvmTelemetry.trackFunnelStep('view_bundle', { label: '3D SSD Blueprint Opened' });
      const timer = setTimeout(() => {
        setAnimStage('floating');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle smooth close animation (suck back into SSD)
  const handleInitiateClose = useCallback(() => {
    setAnimStage('retracting');
    vvmSound.playOverlaySound('winds');
    setTimeout(() => {
      onClose();
      setActiveOverlay(null);
      setShowSuperpowerPlug(false);
      setShowLutModal(false);
      setActiveMeme(null);
    }, 450);
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleInitiateClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleInitiateClose]);

  // Master folder click dispatcher matching exact user specifications
  const handleFolderClick = useCallback(
    (folder: FolderData) => {
      setActiveFolder(folder);
      // Real-time telemetry tracking for admin dashboard
      vvmTelemetry.trackFolderClick(folder.id);

      switch (folder.id) {
        // 1. BACKGROUNDS: Cycles through unique wallpapers on per click
        case 'backgrounds': {
          vvmSound.playAmbientChime();
          setBgIndex((prev) => (prev + 1) % WALLPAPERS.length);
          break;
        }

        // 2. ANIMATIONS: Unique kinetic animations on per click
        case 'animations': {
          vvmSound.playSpringBounce();
          setAnimIndex((prev) => prev + 1);
          const currentMode = animIndex % 4;

          if (currentMode === 0) {
            // Exploding 3D Emojis & Memes
            const ems = ['😎', '🚀', '✨', '🔥', '🎬', '🍿', '🤩', '💎', '🎉', '⚡'];
            const newParticles = Array.from({ length: 14 }, (_, i) => ({
              id: Date.now() + i,
              x: 20 + Math.random() * 60,
              y: 20 + Math.random() * 50,
              text: ems[i % ems.length],
            }));
            setAnimParticles(newParticles);
          } else if (currentMode === 1) {
            // Kinetic Speed Typography
            const words = ['SPEED RAMP', 'KINETIC 4K', 'RETENTION +90%', 'VIRAL REEL'];
            const newParticles = words.map((w, i) => ({
              id: Date.now() + i,
              x: 25 + i * 15,
              y: 35 + (i % 2) * 15,
              text: w,
            }));
            setAnimParticles(newParticles);
          } else {
            // Floating 3D Clapperboards & Film Strips
            const icons = ['🎬', '🎞️', '📽️', '🎥', '⭐'];
            const newParticles = Array.from({ length: 8 }, (_, i) => ({
              id: Date.now() + i,
              x: 30 + Math.random() * 40,
              y: 25 + Math.random() * 40,
              text: icons[i % icons.length],
            }));
            setAnimParticles(newParticles);
          }

          setTimeout(() => setAnimParticles([]), 2000);
          break;
        }

        // 3. PLUGINS: Superpower Insertion Effect (Hardware Overclock Sequence)
        case 'plugins': {
          vvmSound.playSuperpowerPlug();
          setShowSuperpowerPlug(true);
          setTimeout(() => {
            setShowSuperpowerPlug(false);
          }, 3200);
          break;
        }

        // 4. LUTS & PRESETS: Real before/after photo slider on per click
        case 'luts': {
          vvmSound.playCameraShutter();
          setLutIndex((prev) => (prev + 1) % LUTS_COMPARE.length);
          setShowLutModal(true);
          break;
        }

        // 5. SOUND FX: Multiple distinct sounds on per click
        case 'sfx': {
          vvmSound.playSFX(sfxIndex);
          setSfxIndex((prev) => prev + 1);
          setSfxPulseBars(true);
          setTimeout(() => setSfxPulseBars(false), 900);
          break;
        }

        // 6. TRANSITIONS: Amazing cinematic optical transition on per click
        case 'transitions': {
          vvmSound.playTransition(transitionIndex);
          setTransitionIndex((prev) => (prev + 1) % 5);
          setShowTransitionCut(true);
          setTimeout(() => setShowTransitionCut(false), 700);
          break;
        }

        // 7. OVERLAYS: Fire, Cold, Water, Winds, Paper on per click
        case 'overlays': {
          const nextOverlay = OVERLAY_TYPES[overlayIndex % OVERLAY_TYPES.length];
          setOverlayIndex((prev) => prev + 1);
          setActiveOverlay(nextOverlay.id);
          vvmSound.playOverlaySound(nextOverlay.id);
          break;
        }

        // 8. TUTORIALS: Trending Indian Memes with sound on per click
        case 'tutorials': {
          const nextMeme = INDIAN_MEMES[memeIndex % INDIAN_MEMES.length];
          setMemeIndex((prev) => prev + 1);
          setActiveMeme(nextMeme);
          vvmSound.playIndianMemeSting(memeIndex);
          break;
        }

        default:
          vvmSound.playAmbientChime();
      }
    },
    [animIndex, sfxIndex, transitionIndex, overlayIndex, memeIndex]
  );

  // EXPLORE THE COLLECTION CTA ACTION
  const handleExploreCTA = () => {
    addToCart(masterBundle);
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#6C56D4', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch {}
    handleInitiateClose();
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn select-none">
      {/* Background dismiss */}
      <div className="fixed inset-0" onClick={handleInitiateClose} />

      {/* ================= MASTER 3D BLUEPRINT CONTAINER ================= */}
      <div
        className={`relative w-full max-w-7xl h-[92vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 transition-all duration-700 z-10 flex flex-col ${currentWallpaper.bgClass} ${currentWallpaper.textColor}`}
        style={{
          background: currentWallpaper.gradient,
        }}
      >
        {/* Subtle Isometric Grid Texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(${currentWallpaper.gridColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* TOP STATUS BAR */}
        <div className="relative z-30 px-6 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-xl bg-black/20">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Image
                src="/vvm-logo-white.png"
                alt="VVM Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-wider uppercase text-white">
                Virtual Vision Media
              </span>
              <span className="text-[10px] font-mono opacity-60">
                100GB Master Blueprint • Active Studio Engine
              </span>
            </div>
          </div>

          {/* Active status indicator & Controls */}
          <div className="flex items-center gap-3">
            {/* Active Wallpaper Indicator Badge */}
            <button
              onClick={() => handleFolderClick(FOLDERS[0])}
              title="Click to cycle wallpaper / background"
              className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 shadow-subtle text-white"
            >
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Wallpaper:</span>
              <span className="font-bold">{currentWallpaper.name}</span>
            </button>

            {/* Close Button (Triggers SSD Suck-In Animation) */}
            <button
              onClick={handleInitiateClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
              title="Close blueprint (Folders retract into SSD)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= MAIN SPLIT: TYPOGRAPHY + 3D STAGE ================= */}
        <div className="relative z-20 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
          
          {/* ================= LEFT COLUMN: KINETIC REPULSION TYPOGRAPHY ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 shadow-subtle text-[11px] font-mono font-semibold tracking-wider uppercase text-white">
              <Sparkles className="w-3.5 h-3.5 text-vvm-accentSubtle" />
              <span>THE ULTIMATE CREATOR LIBRARY</span>
            </div>

            {/* Master Headline with Halftone Cursor Repulsion (gives cursor space) */}
            <div className="space-y-1.5">
              <HalftoneRepulsionText
                text="150+ ORGANIZED FOLDERS"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tightest leading-[0.98] uppercase text-white block"
                highlightColor="#9369FF"
                radius={85}
                maxPush={28}
              />
              <HalftoneRepulsionText
                text="100GB+ CREATIVE ASSETS"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tightest leading-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-vvm-accent via-purple-400 to-cyan-400 block"
                highlightColor="#38BDF8"
                radius={85}
                maxPush={28}
              />
            </div>

            {/* Description Text */}
            <HalftoneRepulsionText
              text="Unleash your creative potential with a massive, high-quality collection of video editor assets, presets, and 3D resources."
              className="text-xs sm:text-sm md:text-base leading-relaxed opacity-80 max-w-md block"
              radius={60}
              maxPush={16}
              halftoneEffect={false}
            />

            {/* WORKING CTA BUTTON & PRICE */}
            <div className="pt-2 flex flex-wrap items-center gap-5">
              <button
                onClick={handleExploreCTA}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-vvm-accent via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm font-mono tracking-wider uppercase shadow-[0_15px_35px_-5px_rgba(108,99,255,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 overflow-hidden"
              >
                <span className="relative z-10">EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none text-white">
                  ₹49 ONLY
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-60 mt-1">
                  + 100+ MORE FOLDERS
                </span>
              </div>
            </div>

            {/* Interactive hint */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono opacity-75">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Click any folder to trigger unique animations & sound FX</span>
            </div>

            {/* ACTIVE FOLDER INSPECTOR CARD */}
            {activeFolder && (
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 shadow-2xl bg-black/40 backdrop-blur-xl ${activeFolder.borderColor}`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeFolder.emoji}</span>
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-white">
                        {activeFolder.name}
                      </h4>
                      <p className="text-[10px] font-mono text-cyan-300/80">
                        {activeFolder.category} • {activeFolder.filesCount} ({activeFolder.size})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFolderClick(activeFolder)}
                    className="px-3 py-1 rounded-lg bg-vvm-accent text-white text-[10px] font-mono font-semibold flex items-center gap-1.5 hover:bg-vvm-accentHover transition-colors shadow-subtle"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Play Effect</span>
                  </button>
                </div>

                <p className="text-[11px] opacity-80 mt-2 leading-relaxed text-gray-200">
                  {activeFolder.description}
                </p>

                {/* Subfolder pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeFolder.subfolders.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-gray-300 border border-white/5"
                    >
                      📁 {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: 3D STAGE (SSD + FLOATING FOLDERS) ================= */}
          <div className="lg:col-span-7 relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center">
            
            <div className="relative w-full max-w-xl aspect-[16/11] flex items-center justify-center">
              
              {/* ATMOSPHERIC SHADOW BENEATH SSD */}
              <div className="absolute bottom-4 right-14 sm:right-24 w-60 h-20 rounded-full bg-black/60 blur-2xl pointer-events-none transform -rotate-12 scale-y-50" />

              {/* METALLIC BRUSHED ALUMINUM SSD HARD DRIVE BASE (Bottom Right) */}
              <div
                id="master-ssd-drive"
                className="absolute bottom-4 sm:bottom-8 right-8 sm:right-16 w-52 sm:w-64 h-32 sm:h-40 rounded-3xl bg-gradient-to-tr from-[#1E1F24] via-[#32343C] to-[#25272F] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-2 border-white/20 transform -rotate-12 skew-y-6 hover:scale-105 transition-all duration-300 flex flex-col justify-between p-4 overflow-hidden group cursor-pointer z-10"
                onClick={() => {
                  vvmSound.playSFX(0);
                  try {
                    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
                  } catch {}
                }}
                title="Virtual Vision Media 100GB SSD Vault Chassis (Folders emerge from here)"
              >
                {/* Radial brushed aluminum specular reflection */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.25),transparent_70%)] pointer-events-none" />

                {/* Laser Ejection Beam when emerging */}
                {animStage === 'emerging' && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22D3EE] animate-pulse" />
                )}

                {/* Top LED & Drive Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34D399]" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white font-bold">
                      VVM DRIVE
                    </span>
                  </div>
                  {/* USB-C Connector Slot */}
                  <div className="w-6 h-2 rounded-full bg-black border border-white/30" />
                </div>

                {/* Center Badge */}
                <div className="text-center py-1">
                  <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-white block">
                    100GB MASTER VAULT
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400/80">
                    USB 4.0 • 102.4 GB Verified
                  </span>
                </div>

                {/* Footer Serial */}
                <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
                  <span>SN: VVM-2026-X1</span>
                  <span>96kHz / 4K ProRes</span>
                </div>
              </div>

              {/* ================= FLOATING 3D GLASS FOLDERS ================= */}
              {/* Animation: Emerge from SSD (bottom right) -> Floating -> Retract to SSD */}
              <div className="absolute inset-0 pointer-events-none">
                {FOLDERS.map((folder, index) => {
                  const isActive = activeFolder.id === folder.id;

                  // Compute translation for emerge / retract
                  // SSD is at approx left: 75%, top: 80%
                  let styleTransform = '';
                  let styleOpacity = 1;

                  if (animStage === 'emerging') {
                    // Staggered emergence from SSD
                    styleTransform = `translate(-50%, -50%) translate3d(${folder.pos.x - 75}%, ${folder.pos.y - 80}%, ${folder.pos.z}px) scale(0.2)`;
                    styleOpacity = 0;
                  } else if (animStage === 'retracting') {
                    // Retract back into SSD
                    styleTransform = `translate(-50%, -50%) translate3d(25%, 35%, 0px) scale(0.1)`;
                    styleOpacity = 0;
                  } else {
                    // Normal floating position
                    styleTransform = `translate(-50%, -50%) translate3d(0, 0, ${folder.pos.z}px) scale(${isActive ? 1.08 : 1.0})`;
                    styleOpacity = 1;
                  }

                  return (
                    <div
                      key={folder.id}
                      className="absolute pointer-events-auto cursor-pointer transition-all duration-700 ease-out"
                      style={{
                        left: `${folder.pos.x}%`,
                        top: `${folder.pos.y}%`,
                        transform: styleTransform,
                        opacity: styleOpacity,
                        transitionDelay: `${index * 50}ms`,
                        zIndex: Math.round(folder.pos.z + (isActive ? 40 : 0)),
                      }}
                      onClick={() => handleFolderClick(folder)}
                    >
                      {/* Glowing Ambient Halo */}
                      <div
                        className="absolute -inset-2.5 rounded-3xl blur-xl transition-all duration-300"
                        style={{
                          backgroundColor: folder.glowColor,
                          opacity: isActive ? 0.9 : 0.35,
                        }}
                      />

                      {/* 3D Glass Folder Shell */}
                      <div
                        className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl backdrop-blur-2xl border bg-gradient-to-br ${
                          folder.color
                        } ${folder.borderColor} shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-2.5 ${
                          isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent shadow-[0_0_30px_rgba(6,182,212,0.8)]' : ''
                        }`}
                      >
                        {/* Realistic Acrylic Folder Tab */}
                        <div
                          className={`absolute -top-2 left-4 w-9 h-2.5 rounded-t-lg border-t border-x ${folder.borderColor} bg-white/20 backdrop-blur-md`}
                        />

                        {/* Folder Emoji */}
                        <span className="text-xl sm:text-2xl filter drop-shadow">
                          {folder.emoji}
                        </span>

                        {/* Label & Asset Count */}
                        <div className="flex flex-col text-left">
                          <span className="text-xs sm:text-sm font-bold font-mono tracking-tight leading-none text-white drop-shadow">
                            {folder.name}
                          </span>
                          <span className="text-[9px] font-mono text-cyan-200/90 mt-0.5">
                            {folder.filesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Premiere / Resolve Timeline Monitors in Background */}
              <div
                className="absolute top-6 right-2 sm:right-6 w-32 sm:w-40 h-24 rounded-2xl bg-black/85 border border-white/20 p-2.5 shadow-2xl transform rotate-6 pointer-events-none select-none"
                style={{ zIndex: 6 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[8px] font-mono text-cyan-300">NLE Master</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded bg-indigo-500/70 w-5/6 animate-pulse" />
                  <div className="h-2 rounded bg-purple-500/70 w-full" />
                  <div className="h-2 rounded bg-cyan-400/70 w-4/6" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            DYNAMIC FULL-SCREEN FX LAYERS FOR EACH OF THE 8 FOLDERS
           ========================================================================= */}

        {/* 1. PLUGINS SUPERPOWER INJECTION EFFECT */}
        {showSuperpowerPlug && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fadeIn">
            {/* Screen edge electric neon lightning border */}
            <div className="absolute inset-0 border-4 border-cyan-400 shadow-[inset_0_0_50px_#22D3EE,0_0_50px_#A855F7] animate-pulse" />
            
            <div className="max-w-lg w-full mx-4 p-6 rounded-3xl bg-black/95 border-2 border-cyan-400 shadow-2xl font-mono text-white space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-400/40 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Zap className="w-5 h-5 animate-bounce" />
                  <span>HARDWARE SUPERPOWER INJECTION</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Overclocking NLE Neural Engine...</span>
                  <span className="text-cyan-400 font-bold">100% DONE</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-cyan-400/40">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-pulse" />
                </div>
              </div>

              {/* Beast mode telemetry specs */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">CPU CLOCK</span>
                  <span className="text-cyan-300 font-bold">9.8 GHz LIQUID NITROGEN</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">GPU MATRIX</span>
                  <span className="text-purple-300 font-bold">128-CORE ACCELERATION</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">REALTIME PLAYBACK</span>
                  <span className="text-emerald-400 font-bold">8K ProRes 4444 (120 FPS)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">STATUS</span>
                  <span className="text-amber-300 font-bold">⚡ BEAST MODE ENGAGED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TRANSITIONS CINEMATIC WHIP PAN CUT */}
        {showTransitionCut && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-white/30 backdrop-blur-sm animate-fadeIn">
            {/* High-speed light ray slice */}
            <div className="w-full h-4 bg-gradient-to-r from-transparent via-cyan-400 via-indigo-400 to-transparent transform -skew-y-12 animate-pulse shadow-[0_0_40px_#22D3EE]" />
            <div className="absolute px-6 py-2.5 rounded-full bg-black/90 text-white font-mono text-xs font-bold uppercase tracking-widest border border-cyan-400 shadow-2xl">
              ⚡ ProRes 422 Optical Whip Transition
            </div>
          </div>
        )}

        {/* 3. LUTS & PRESETS INTERACTIVE REAL IMAGE COMPARISON */}
        {showLutModal && (
          <div className="absolute inset-0 z-40 p-4 sm:p-8 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fadeIn">
            <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-black flex flex-col">
              {/* Header */}
              <div className="px-5 py-3 border-b border-white/10 bg-black/60 flex items-center justify-between text-white font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">{LUTS_COMPARE[lutIndex].name}</span>
                </div>
                <button
                  onClick={() => setShowLutModal(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Real Photo Split Screen */}
              <div className="relative w-full aspect-[16/9] overflow-hidden select-none">
                <Image
                  src={LUTS_COMPARE[lutIndex].src}
                  alt={LUTS_COMPARE[lutIndex].name}
                  fill
                  className="object-cover"
                />

                {/* Left Side: Flat LOG Emulation */}
                <div
                  className="absolute inset-y-0 left-0 bg-slate-800/85 backdrop-blur-[1px] border-r-2 border-emerald-400 flex flex-col justify-between p-4"
                  style={{ width: `${lutSliderPos}%` }}
                >
                  <span className="px-2.5 py-1 rounded bg-black/70 text-gray-300 font-mono text-[10px] w-fit">
                    BEFORE: Flat S-Log3 RAW
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    Uncompressed Cinema Sensor
                  </span>
                </div>

                {/* Right Side: Graded Hollywood LUT */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/90 text-white font-mono text-[10px] font-bold shadow-elevated">
                    AFTER: Hollywood 3D LUT Applied
                  </span>
                </div>

                {/* Slider bar draggable */}
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={lutSliderPos}
                  onChange={(e) => setLutSliderPos(Number(e.target.value))}
                  className="absolute inset-x-4 bottom-4 z-20 cursor-ew-resize opacity-80 hover:opacity-100"
                />
              </div>

              {/* Controls footer */}
              <div className="px-5 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-300">
                <span>Drag slider to compare • {lutIndex + 1}/{LUTS_COMPARE.length} Presets</span>
                <button
                  onClick={() => {
                    vvmSound.playCameraShutter();
                    setLutIndex((prev) => (prev + 1) % LUTS_COMPARE.length);
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  Next Preset →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. OVERLAYS REALTIME EFFECTS: Fire, Cold, Water, Winds, Paper */}
        {activeOverlay && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            
            {/* Overlay banner notification */}
            <div className="absolute top-20 right-6 px-4 py-2 rounded-full bg-black/90 text-white text-xs font-mono border border-pink-400 shadow-2xl flex items-center gap-2">
              <span>{OVERLAY_TYPES.find((o) => o.id === activeOverlay)?.name}</span>
              <button
                onClick={() => setActiveOverlay(null)}
                className="pointer-events-auto p-0.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FIRE OVERLAY */}
            {activeOverlay === 'fire' && (
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/25 via-orange-500/10 to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(#F97316_2px,transparent_2px)] [background-size:24px_24px] opacity-40 animate-pulse" />
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-orange-600/40 via-yellow-500/20 to-transparent blur-xl" />
              </div>
            )}

            {/* COLD / FROST OVERLAY */}
            {activeOverlay === 'cold' && (
              <div className="absolute inset-0 border-[16px] sm:border-[28px] border-cyan-300/30 shadow-[inset_0_0_80px_rgba(6,182,212,0.4)]">
                <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-[0.5px]" />
                <div className="absolute top-4 left-4 text-3xl opacity-60">❄️</div>
                <div className="absolute top-4 right-4 text-3xl opacity-60">❄️</div>
                <div className="absolute bottom-4 left-4 text-3xl opacity-60">❄️</div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-60">❄️</div>
              </div>
            )}

            {/* WATER / RAIN OVERLAY */}
            {activeOverlay === 'water' && (
              <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(59,130,246,0.15)_20px,rgba(59,130,246,0.15)_40px)] animate-pulse" />
                <div className="absolute bottom-8 left-1/3 w-32 h-32 rounded-full border border-cyan-400/40 animate-ping" />
              </div>
            )}

            {/* WINDS / SMOKE OVERLAY */}
            {activeOverlay === 'winds' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 blur-xl animate-pulse" />
            )}

            {/* PAPER / PAPERCUTS OVERLAY */}
            {activeOverlay === 'paper' && (
              <div className="absolute inset-0 border-x-[18px] border-amber-100/30 border-dashed">
                <div className="absolute top-0 inset-x-0 h-10 border-b-4 border-dashed border-amber-200/40 bg-amber-50/5" />
                <div className="absolute bottom-0 inset-x-0 h-10 border-t-4 border-dashed border-amber-200/40 bg-amber-50/5" />
              </div>
            )}

          </div>
        )}

        {/* 5. INDIAN TRENDING MEMES OVERLAY (Tutorials) */}
        {activeMeme && (
          <div className="pointer-events-none absolute bottom-8 left-6 sm:left-10 z-40 max-w-sm w-full p-4 rounded-3xl bg-black/95 border-2 border-yellow-400 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white font-mono space-y-2 animate-bounce">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeMeme.memeIcon}</span>
                <span className="font-bold text-yellow-400 text-xs uppercase">
                  {activeMeme.title}
                </span>
              </div>
              <button
                onClick={() => setActiveMeme(null)}
                className="pointer-events-auto p-1 rounded-full hover:bg-white/20 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {activeMeme.dialogue}
            </p>
            <p className="text-[10px] text-gray-400">
              {activeMeme.subtitle} • Trending Indian Reel Sound
            </p>
          </div>
        )}

        {/* 6. ANIMATIONS BURST PARTICLES */}
        {animParticles.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            {animParticles.map((p) => (
              <div
                key={p.id}
                className="absolute text-2xl sm:text-3xl font-black font-mono text-cyan-300 drop-shadow animate-bounce"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transition: 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {p.text}
              </div>
            ))}
          </div>
        )}

        {/* 7. SFX OSCILLOSCOPE BARS PULSE */}
        {sfxPulseBars && (
          <div className="pointer-events-none absolute bottom-12 right-12 z-30 flex items-center gap-1 p-3 rounded-2xl bg-black/90 border border-indigo-400 shadow-2xl">
            <Volume2 className="w-4 h-4 text-indigo-400 mr-2 animate-bounce" />
            {[40, 80, 100, 60, 90, 70, 95, 50, 85].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-indigo-400 rounded-full animate-pulse"
                style={{ height: `${h * 0.3}px` }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Vault3DInteractiveBlueprint;
