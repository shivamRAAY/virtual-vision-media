'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, Radio } from 'lucide-react';

interface AudioSample {
  id: string;
  title: string;
  category: string;
  duration: string;
  waveformProfile: number[];
  type: 'boom' | 'whoosh' | 'click' | 'drone';
}

const SAMPLES: AudioSample[] = [
  {
    id: 'sfx-01',
    title: 'Deep Cinematic Sub Boom Impact',
    category: 'Cinematic Impacts',
    duration: '0:04',
    type: 'boom',
    waveformProfile: [10, 45, 95, 80, 65, 45, 30, 20, 15, 10, 8, 5, 3, 2],
  },
  {
    id: 'sfx-02',
    title: 'Kinetic Whip Whoosh & Speed Passby',
    category: 'Motion Transients',
    duration: '0:02',
    type: 'whoosh',
    waveformProfile: [5, 12, 28, 60, 95, 75, 40, 15, 8, 4],
  },
  {
    id: 'sfx-03',
    title: 'Mechanical Camera Shutter & Tactile UI Click',
    category: 'Tactile Foley',
    duration: '0:01',
    type: 'click',
    waveformProfile: [15, 85, 30, 12, 8, 4],
  },
  {
    id: 'sfx-04',
    title: 'Analog Dystopian Sci-Fi Drone Atmosphere',
    category: 'Atmospheres',
    duration: '0:06',
    type: 'drone',
    waveformProfile: [35, 45, 60, 55, 65, 70, 60, 55, 50, 45, 40, 35],
  },
];

export const AudioPlayerPreview: React.FC = () => {
  const [activeSample, setActiveSample] = useState<AudioSample>(SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const timerRef = useRef<any>(null);

  // Synthesize realistic cinematic audio effects using Web Audio API
  const playSound = (sample: AudioSample) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous
      stopSound();

      const now = ctx.currentTime;

      if (sample.type === 'boom') {
        // Deep sub boom: 80Hz descending to 28Hz with lowpass filter
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(26, now + 1.8);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
        activeNodesRef.current = [osc, gain];

      } else if (sample.type === 'whoosh') {
        // Whoosh: noise buffer with swept bandpass filter
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);
        filter.Q.value = 3.0;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 1.2);
        activeNodesRef.current = [noise, filter, gain];

      } else if (sample.type === 'click') {
        // Shutter click: high transient impulse
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        activeNodesRef.current = [osc, gain];

      } else if (sample.type === 'drone') {
        // Atmospheric drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(55, now);
        osc2.frequency.setValueAtTime(110.5, now);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.linearRampToValueAtTime(700, now + 2.0);
        filter.frequency.linearRampToValueAtTime(350, now + 4.0);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 3.8);
        osc2.stop(now + 3.8);
        activeNodesRef.current = [osc1, osc2, filter, gain];
      }

      setIsPlaying(true);
      setPlaybackProgress(0);

      // Animate progress bar
      const durationSeconds = sample.type === 'boom' ? 2.5 : sample.type === 'whoosh' ? 1.2 : sample.type === 'click' ? 0.3 : 3.8;
      const startTime = Date.now();

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(1, elapsed / durationSeconds);
        setPlaybackProgress(progress * 100);

        if (progress >= 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          setPlaybackProgress(0);
        }
      }, 30);

    } catch (e) {
      console.error('Audio synthesis failed:', e);
    }
  };

  const stopSound = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {}
    });
    activeNodesRef.current = [];
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const togglePlay = (sample: AudioSample) => {
    if (isPlaying && activeSample.id === sample.id) {
      stopSound();
    } else {
      setActiveSample(sample);
      playSound(sample);
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-3xl border border-vvm-border p-6 md:p-8 shadow-card">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-vvm-accent uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive 96kHz Sound Laboratory</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-vvm-text tracking-tight">
            Surgical Audio Precision & Headroom
          </h3>
          <p className="text-sm text-vvm-muted mt-0.5">
            Click any master stem below to audition in real-time Web Audio.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vvm-soft text-xs font-mono text-vvm-text border border-vvm-border/60">
          <Volume2 className="w-3.5 h-3.5 text-vvm-accent" />
          <span>24-bit / 96,000 Hz Stereo WAV</span>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-3">
        {SAMPLES.map((sample) => {
          const isThisActive = activeSample.id === sample.id;
          const isThisPlaying = isThisActive && isPlaying;

          return (
            <div
              key={sample.id}
              onClick={() => togglePlay(sample)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isThisActive
                  ? 'border-vvm-accent/40 bg-vvm-accentLight/40 shadow-subtle'
                  : 'border-vvm-border/60 hover:border-vvm-border bg-white hover:bg-vvm-bg/50'
              }`}
            >
              {/* Left Play button + Title */}
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isThisPlaying
                      ? 'bg-vvm-accent text-white shadow-glow scale-105'
                      : 'bg-vvm-soft text-vvm-text hover:bg-vvm-silver/40'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="text-sm font-semibold text-vvm-text">
                    {sample.title}
                  </div>
                  <div className="text-xs font-mono text-vvm-muted flex items-center gap-2 mt-0.5">
                    <span>{sample.category}</span>
                    <span>•</span>
                    <span>{sample.duration}</span>
                  </div>
                </div>
              </div>

              {/* Right Waveform Display */}
              <div className="flex items-center gap-1.5 sm:w-48 h-8 px-2 bg-vvm-soft/50 rounded-lg">
                {sample.waveformProfile.map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isThisPlaying
                        ? 'bg-vvm-accent animate-pulse'
                        : 'bg-vvm-silver/70'
                    }`}
                    style={{
                      height: `${isThisPlaying ? Math.max(20, Math.random() * 100) : val}%`,
                      transitionDelay: `${idx * 20}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar of active playing track */}
      {isPlaying && (
        <div className="mt-4 pt-3 border-t border-vvm-border/60 flex items-center gap-3">
          <span className="text-[11px] font-mono text-vvm-accent font-semibold uppercase">
            Auditioning {activeSample.title}
          </span>
          <div className="flex-1 h-1.5 bg-vvm-soft rounded-full overflow-hidden">
            <div
              className="h-full bg-vvm-accent transition-all duration-75"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
