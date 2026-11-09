'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

interface HalftoneRepulsionTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  radius?: number; // Repulsion radius in px (default 85)
  maxPush?: number; // Max distance letters slide away (default 26)
  highlightColor?: string;
  halftoneEffect?: boolean;
}

interface CharState {
  char: string;
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  isSpace: boolean;
  warmth: number; // 0 to 1
}

export const HalftoneRepulsionText: React.FC<HalftoneRepulsionTextProps> = ({
  text,
  className = '',
  as: Component = 'div',
  radius = 90,
  maxPush = 28,
  highlightColor = '#6C56D4',
  halftoneEffect = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isHovered = useRef(false);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number | null>(null);

  // Split into character objects
  const chars = useMemo(() => {
    return text.split('').map((char, index) => ({
      char,
      id: index,
      isSpace: char === ' ',
    }));
  }, [text]);

  const [transforms, setTransforms] = useState<
    { x: number; y: number; warmth: number }[]
  >(() => chars.map(() => ({ x: 0, y: 0, warmth: 0 })));

  const charPositions = useRef<
    { x: number; y: number; curX: number; curY: number; curWarmth: number }[]
  >(chars.map(() => ({ x: 0, y: 0, curX: 0, curY: 0, curWarmth: 0 })));

  // Shockwave ripple effect
  const [shockwave, setShockwave] = useState<{
    x: number;
    y: number;
    radius: number;
    active: boolean;
  }>({ x: 0, y: 0, radius: 0, active: false });

  // Update layout positions of characters
  const measureChars = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    charRefs.current.forEach((el, idx) => {
      if (!el || !charPositions.current[idx]) return;
      const rect = el.getBoundingClientRect();
      charPositions.current[idx].x = rect.left + rect.width / 2 - containerRect.left;
      charPositions.current[idx].y = rect.top + rect.height / 2 - containerRect.top;
    });
  }, []);

  useEffect(() => {
    measureChars();
    window.addEventListener('resize', measureChars);
    return () => window.removeEventListener('resize', measureChars);
  }, [measureChars, text]);

  // Main spring physics loop
  const updatePhysics = useCallback(() => {
    const mx = mousePos.current.x;
    const my = mousePos.current.y;
    let hasMotion = false;

    const nextTransforms = charPositions.current.map((pos, idx) => {
      const isSpace = chars[idx]?.isSpace;
      if (isSpace) return { x: 0, y: 0, warmth: 0 };

      // Calculate distance to mouse
      const dx = pos.x - mx;
      const dy = pos.y - my;
      const dist = Math.hypot(dx, dy);

      let targetX = 0;
      let targetY = 0;
      let targetWarmth = 0;

      if (isHovered.current && dist < radius && dist > 0.01) {
        // Repulsion force: gives cursor space!
        const force = Math.pow((radius - dist) / radius, 1.4) * maxPush;
        const angle = Math.atan2(dy, dx);
        targetX = Math.cos(angle) * force;
        targetY = Math.sin(angle) * force;
        targetWarmth = (radius - dist) / radius;
      }

      // Spring lerp
      const spring = 0.18;
      pos.curX += (targetX - pos.curX) * spring;
      pos.curY += (targetY - pos.curY) * spring;
      pos.curWarmth += (targetWarmth - pos.curWarmth) * 0.2;

      if (
        Math.abs(targetX - pos.curX) > 0.05 ||
        Math.abs(targetY - pos.curY) > 0.05 ||
        Math.abs(targetWarmth - pos.curWarmth) > 0.02
      ) {
        hasMotion = true;
      }

      return {
        x: Math.round(pos.curX * 100) / 100,
        y: Math.round(pos.curY * 100) / 100,
        warmth: Math.round(pos.curWarmth * 100) / 100,
      };
    });

    setTransforms(nextTransforms);

    if (hasMotion || isHovered.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    } else {
      rafId.current = null;
    }
  }, [chars, radius, maxPush]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isHovered.current = true;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handleMouseEnter = () => {
    measureChars();
    isHovered.current = true;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    mousePos.current = { x: -9999, y: -9999 };
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  // Shockwave click pulse
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    setShockwave({ x: cx, y: cy, radius: 10, active: true });

    // Radial push impulse to all characters
    charPositions.current.forEach((pos) => {
      const dx = pos.x - cx;
      const dy = pos.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 180) {
        const impulse = ((180 - dist) / 180) * 35;
        pos.curX += (dx / dist) * impulse;
        pos.curY += (dy / dist) * impulse;
      }
    });

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
    }
  };

  return (
    <Component
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative select-none inline-block cursor-default ${className}`}
      aria-label={text}
    >
      {/* Halftone subtle dot grid backing inspired by 21st.dev */}
      {halftoneEffect && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply bg-[radial-gradient(#6C56D4_1px,transparent_1px)] [background-size:6px_6px] -z-10"
        />
      )}

      {chars.map(({ char, id, isSpace }, idx) => {
        const t = transforms[idx] || { x: 0, y: 0, warmth: 0 };

        if (isSpace) {
          return (
            <span
              key={id}
              ref={(el) => {
                charRefs.current[idx] = el;
              }}
              className="inline-block w-[0.28em]"
            >
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={id}
            ref={(el) => {
              charRefs.current[idx] = el;
            }}
            className="inline-block will-change-transform transition-[color] duration-150"
            style={{
              transform: `translate3d(${t.x}px, ${t.y}px, 0)`,
              color: t.warmth > 0.15 ? highlightColor : undefined,
              textShadow:
                t.warmth > 0.25
                  ? `0 0 12px ${highlightColor}40`
                  : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </Component>
  );
};

export default HalftoneRepulsionText;
