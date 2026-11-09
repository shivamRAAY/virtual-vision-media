'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, ArrowRight, Play, Sparkles, X } from 'lucide-react';

interface OpeningAnimationProps {
  onComplete: () => void;
  isOpen: boolean;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(9.96);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFadingOut(false);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback: keep muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 9.96;
      setCurrentTime(curr);
      setDuration(dur);
      setProgress((curr / dur) * 100);
    }
  };

  const handleVideoEnd = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic Fullscreen Video */}
      <video
        ref={videoRef}
        src="/hero-sequence.mp4"
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      />

      {/* Ambient Vignette & Pearl White Transition Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 pointer-events-none" />

      {/* Top Floating Glass Bar */}
      <div className="absolute top-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between z-10">
        
        {/* Brand identifier */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <Image
              src="/vvm-logo-white.png"
              alt="VVM Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div>
            <span className="text-white font-bold text-xs tracking-wider font-mono">
              VIRTUAL VISION MEDIA
            </span>
            <span className="text-white/60 text-[10px] font-mono block">
              Opening Assembly • 100GB Creative Vault
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center gap-2 transition-all shadow-subtle"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-vvm-accent" />}
            <span className="hidden sm:inline">{isMuted ? 'Unmute Sound' : 'Mute'}</span>
          </button>

          {/* Skip Intro */}
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-elevated"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Bottom Progress Bar & State */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono text-white/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vvm-accent animate-pulse" />
            <span className="font-semibold">Assembly Sequence: Elements converging into 100GB Vault</span>
          </div>
          <span>
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vvm-accent to-vvm-accentSubtle transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
};
