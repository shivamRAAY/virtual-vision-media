'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import NextImage from 'next/image';
import { ArrowRight, Play, Download, ChevronDown, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

const TOTAL_FRAMES = 235;
// The first 16% of scroll travel is dedicated to the frozen hero landing reading zone
const FREEZE_THRESHOLD = 0.16;

export const HeroSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number>(0);
  const isLoadedRef = useRef<boolean>(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { addToCart, setIsIntroOpen } = useCart();
  const masterBundle = PRODUCTS[0];

  // High-performance canvas frame renderer with contain/cover calculation and aspect scaling
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const images = imagesRef.current;
    let img = images[frameIdx];

    // If target frame is not yet fully decoded, search outward for the nearest loaded frame
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const before = frameIdx - offset;
        if (before >= 0 && images[before]?.complete) {
          img = images[before];
          break;
        }
        const after = frameIdx + offset;
        if (after < TOTAL_FRAMES && images[after]?.complete) {
          img = images[after];
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const width = canvas.width;
    const height = canvas.height;

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      // Screen is wider than 16:9
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
      offsetX = 0;
    } else {
      // Screen is taller/narrower than 16:9 (e.g. mobile or standard laptop)
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetY = 0;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Preload and asynchronously decode all 235 frames using a worker pool
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // 1. Immediately load & decode Frame 0 so the initial 3D hero landing frame appears instantly
    const loadFirstFrame = async () => {
      const img0 = new Image();
      img0.src = '/sequence/ezgif-frame-001.jpg';
      try {
        await img0.decode();
      } catch (e) {
        // Fallback for browsers that do not support decode()
      }
      if (!isCancelled) {
        images[0] = img0;
        renderFrame(0);
        lastRenderedFrameRef.current = 0;
      }
    };

    loadFirstFrame();

    // 2. Asynchronous parallel worker pool for the remaining frames
    let loadedCount = 1;
    const CONCURRENCY = 16;
    let nextIndex = 1;

    const worker = async () => {
      while (nextIndex < TOTAL_FRAMES && !isCancelled) {
        const idx = nextIndex++;
        const frameNum = String(idx + 1).padStart(3, '0');
        const img = new Image();
        img.src = `/sequence/ezgif-frame-${frameNum}.jpg`;

        try {
          await img.decode();
        } catch (e) {
          // Reliance remains on natural onload if decode rejects
        }

        if (!isCancelled) {
          images[idx] = img;
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(pct);

          // Once first 25 priority frames are cached, allow interaction
          if (loadedCount >= 25 && !isLoadedRef.current) {
            isLoadedRef.current = true;
            setIsLoaded(true);
          }
        }
      }
    };

    const workers: Promise<void>[] = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      workers.push(worker());
    }

    Promise.all(workers).then(() => {
      if (!isCancelled) {
        isLoadedRef.current = true;
        setIsLoaded(true);
        setLoadProgress(100);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // Handle canvas sizing with devicePixelRatio support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      const targetWidth = Math.round(displayWidth * dpr);
      const targetHeight = Math.round(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      if (lastRenderedFrameRef.current >= 0) {
        renderFrame(lastRenderedFrameRef.current);
      } else {
        renderFrame(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // Passive scroll listener: updates targetProgressRef with ZERO React re-renders
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Frame-rate independent continuous animation loop with LERP smoothing and frozen initial frames
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Exponential decay smoothing factor calibrated for silky smooth momentum
      const factor = 1 - Math.exp(-14 * deltaTime);
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * factor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // 1. Calculate Target Frame with Freeze Zone:
      // While p <= FREEZE_THRESHOLD, the frame is locked to 0 (the initial hero state)
      let targetFrame = 0;
      if (p > FREEZE_THRESHOLD) {
        const animProgress = (p - FREEZE_THRESHOLD) / (1 - FREEZE_THRESHOLD);
        targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(animProgress * (TOTAL_FRAMES - 1)))
        );
      }

      if (targetFrame !== lastRenderedFrameRef.current) {
        renderFrame(targetFrame);
        lastRenderedFrameRef.current = targetFrame;
      }

      // 2. Direct DOM transform & opacity on the Hero Text (0 React re-renders):
      if (heroTextRef.current) {
        const fadeStart = 0.03;
        const fadeEnd = FREEZE_THRESHOLD;
        let opacity = 1;
        if (p > fadeStart) {
          opacity = Math.max(0, 1 - (p - fadeStart) / (fadeEnd - fadeStart));
        }
        const translateY = Math.min(40, (p / fadeEnd) * 40);

        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translateY(-${translateY}px)`;
        heroTextRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrame]);

  const scrollToAnimation = () => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetScrollY = container.offsetTop + (FREEZE_THRESHOLD + 0.04) * totalScrollable;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#F7F7F5]"
      style={{ height: '520vh' }}
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Fullscreen 3D Canvas — Clean master frames with 0 overlay text during animation */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Studio Lighting Gradient Wash on Left for Maximum Typography Contrast */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 lg:w-[54%] bg-gradient-to-r from-[#F7F7F5]/90 via-[#F7F7F5]/75 to-transparent pointer-events-none z-10" />

        {/* Ambient Top & Bottom Edge Blenders */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#F7F7F5] via-[#F7F7F5]/70 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F7F7F5] via-[#F7F7F5]/80 to-transparent pointer-events-none z-10" />

        {/* HERO LANDING OVERLAY (FROZEN ON FIRST FRAMES, DISSOLVES ON SCROLL) */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-20 flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8 pointer-events-auto transition-transform will-change-transform"
        >
          {/* Main Hero Content Block matching the official visual reference */}
          <div className="max-w-2xl space-y-6 my-auto">
            
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">
                <NextImage
                  src="/vvm-logo.png"
                  alt="Virtual Vision Media Logo"
                  width={44}
                  height={44}
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

            {/* Master Headline: 100GB VIDEO EDITOR ASSETS BUNDLE */}
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
              <p className="text-base sm:text-lg font-medium text-vvm-text leading-snug">
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

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              
              {/* Primary CTA: GET INSTANT ACCESS */}
              <button
                onClick={() => addToCart(masterBundle)}
                className="px-8 py-4 rounded-2xl bg-vvm-text hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest shadow-elevated hover:shadow-glow transition-all flex items-center justify-center gap-3 group"
              >
                <span>GET INSTANT ACCESS</span>
                <span className="text-emerald-400 font-mono text-xs font-bold">₹49</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Instant Digital Download Badge */}
              <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted px-1">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Instant Digital Download</span>
              </div>

              {/* Replay 3D Intro Button */}
              <button
                onClick={() => setIsIntroOpen(true)}
                className="px-4 py-3 rounded-2xl bg-white/90 hover:bg-white text-vvm-text text-xs font-mono font-medium border border-vvm-border transition-colors flex items-center justify-center gap-2 shadow-subtle backdrop-blur-md"
                title="Re-watch the 3D element assembly animation"
              >
                <Play className="w-3.5 h-3.5 fill-current text-vvm-accent" />
                <span>Replay 3D Intro</span>
              </button>

            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-vvm-muted">
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

          {/* Bottom Interactive Scroll Down Cue */}
          <div className="flex items-center justify-between pt-4 border-t border-black/5">
            <button
              onClick={scrollToAnimation}
              className="inline-flex items-center gap-2.5 text-xs font-mono text-vvm-muted hover:text-vvm-text transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/90 border border-vvm-border flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform">
                <ChevronDown className="w-3.5 h-3.5 text-vvm-text animate-bounce" />
              </div>
              <span>Scroll down to unlock the 3D creative vault</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-vvm-muted">
              <Sparkles className="w-3.5 h-3.5 text-vvm-accent" />
              <span>235 Master 3D Frames • Scroll Scrubbed</span>
            </div>
          </div>

        </div>

        {/* Minimal Initial Cache Indicator — Only visible briefly during first load */}
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F7F7F5]/95 backdrop-blur-md transition-opacity duration-500">
            <div className="w-12 h-12 rounded-full border-2 border-vvm-silver/40 border-t-vvm-accent animate-spin mb-3" />
            <div className="font-mono text-[11px] tracking-widest uppercase text-vvm-text font-semibold">
              Loading 3D Vault • {loadProgress}%
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
