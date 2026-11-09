"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GlobeTestimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  city: string;
  country?: string;
  lat: number;
  lng: number;
  image: string;
  rating?: number;
  tone?: number;
};

export type TestimonialGlobeLabels = {
  previous?: string;
  next?: string;
  pin?: string;
};

export type TestimonialGlobeProps = {
  items: GlobeTestimonial[];
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  caption?: React.ReactNode;
  action?: React.ReactNode;
  autoRotate?: boolean;
  rotationSpeed?: number;
  autoplay?: boolean;
  interval?: number;
  active?: number;
  onActiveChange?: (index: number) => void;
  size?: number;
  labels?: TestimonialGlobeLabels;
  className?: string;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
};

// Physics and rendering constants
const GLOBE_RADIUS_SHARE = 0.82;
const GLOBE_THETA = 0.28; // Tilted ~16 degrees toward camera
const PIN_ELEVATION = 0.05;
const VELOCITY_DECAY = 0.92;
const RELEASE_CHECK_MS = 80;
const TURN_DURATION_MS = 1200;
const CARD_TRANSITION_MS = 220;
const DRAG_THRESHOLD_PX = 6;
const SWIPE_THRESHOLD_PX = 40;
const WIDE_BREAKPOINT_PX = 620;
const FRONT_MARGIN = 0.06;
const MAX_CONTAINER_WIDTH = 1200;

const DEFAULT_LABELS: Required<TestimonialGlobeLabels> = {
  previous: "Previous review",
  next: "Next review",
  pin: "Show review from",
};

const TONE_RINGS: Record<number, string> = {
  1: "ring-purple-500",
  2: "ring-amber-500",
  3: "ring-emerald-500",
  4: "ring-blue-500",
  5: "ring-rose-500",
};

const TONE_BORDERS: Record<number, string> = {
  1: "border-purple-500",
  2: "border-amber-500",
  3: "border-emerald-500",
  4: "border-blue-500",
  5: "border-rose-500",
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function smooth(n: number) {
  return n * n * (3 - 2 * n);
}

function toneOf(item: GlobeTestimonial, index: number): number {
  return item.tone ?? ((index % 5) + 1);
}

function toCartesian(lat: number, lng: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180 - Math.PI;
  const cosPhi = Math.cos(phi);
  return [-cosPhi * Math.cos(theta), Math.sin(phi), cosPhi * Math.sin(theta)];
}

function project(
  [x, y, z]: [number, number, number],
  phi: number,
  theta: number,
  elevation = PIN_ELEVATION
) {
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const r = GLOBE_RADIUS_SHARE * (1 + elevation);
  const px = (cosPhi * x + sinPhi * z) * r;
  const py = (sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z) * r;
  const depth = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z;
  return {
    x: (px + 1) / 2,
    y: (1 - py) / 2,
    depth,
    rim: Math.hypot(px, py) - GLOBE_RADIUS_SHARE,
  };
}

function facingPhi(lng: number) {
  return (3 * Math.PI) / 2 - (lng * Math.PI) / 180;
}

function nearestTurn(current: number, target: number) {
  const tau = Math.PI * 2;
  return target + tau * Math.round((current - target) / tau);
}

function pinOpacity(depth: number, rim: number) {
  return depth >= 0
    ? 0.45 + 0.55 * smooth(clamp01(depth / 0.3))
    : 0.45 * Math.max(clamp01(rim / 0.04), clamp01(1 + depth * 8)) * clamp01(1 + depth * 3);
}

function pinScale(depth: number) {
  return 0.62 + 0.38 * smooth(clamp01((depth + 0.2) / 0.7));
}

function easeOutExpo(x: number) {
  return x >= 1 ? 1 : (1 - Math.pow(2, -10 * x)) / (1 - Math.pow(2, -10));
}

function seededStars(count: number) {
  let seed = 11;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 2147483647;
    return seed / 2147483647;
  };
  const stars: Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }> = [];
  while (stars.length < count) {
    const l = 0.02 + rand() * 0.96;
    const t = 0.02 + rand() * 0.96;
    if (Math.hypot(l - 0.5, t - 0.5) >= 0.44) {
      stars.push({
        id: stars.length,
        left: l * 100,
        top: t * 100,
        size: rand() < 0.75 ? 1.5 : 2.5,
        delay: rand() * 4,
        duration: 2.5 + rand() * 3,
      });
    }
  }
  return stars;
}

const STATIC_STARS = seededStars(36);

// Star SVG Icon for reviews
function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9 0.94 5.51L10 14.12l-4.94 2.6 0.94-5.51-4-3.9 5.53-.8L10 1.5z" />
    </svg>
  );
}

// Quote Icon
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M9.6 5.5C6.4 6.5 4.4 9.3 4.4 12.9v5.6h6.2v-6.2H7.7c.2-2 1.4-3.6 3.2-4.3L9.6 5.5Zm9.4 0c-3.2 1-5.2 3.8-5.2 7.4v5.6H20v-6.2h-2.9c.2-2 1.4-3.6 3.2-4.3L19 5.5Z" />
    </svg>
  );
}

// Chevron Icon
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
    </svg>
  );
}

// Avatar image with fallback initials
function Portrait({ src, name, className }: { src: string; name: string; className?: string }) {
  const [error, setError] = React.useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (error || !src) {
    return (
      <span className={cn("grid place-items-center bg-zinc-800 text-white font-mono text-xs font-bold", className)}>
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      draggable={false}
      decoding="async"
      className={cn("object-cover", className)}
      onError={() => setError(true)}
    />
  );
}

// Individual Pin Button on the 3D globe
const Pin = React.memo(function Pin({
  item,
  index,
  tone,
  size,
  label,
  featured,
  approaching,
  register,
  onEnter,
  onLeave,
  onPress,
}: {
  item: GlobeTestimonial;
  index: number;
  tone: number;
  size: number;
  label: string;
  featured: boolean;
  approaching: boolean;
  register: (index: number, el: HTMLButtonElement | null) => void;
  onEnter: (index: number) => void;
  onLeave: (index: number) => void;
  onPress: (index: number) => void;
}) {
  return (
    <button
      ref={(el) => register(index, el)}
      type="button"
      data-pin={index}
      data-featured={featured ? "" : undefined}
      aria-label={label}
      aria-current={featured ? "true" : undefined}
      className="group/pin absolute left-0 top-0 rounded-full opacity-0 outline-none will-change-transform cursor-pointer"
      style={{ width: size, height: size }}
      onPointerEnter={() => onEnter(index)}
      onPointerLeave={() => onLeave(index)}
      onClick={() => onPress(index)}
    >
      {/* Outer Pulse Ping Effect */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full border-2 animate-ping [animation-duration:3s]",
          TONE_BORDERS[tone],
          featured || approaching ? "opacity-80" : "opacity-25"
        )}
        style={{ animationDelay: `${(index % 5) * 0.6}s` }}
      />

      {/* Main Avatar Face */}
      <span
        className={cn(
          "relative block size-full overflow-hidden rounded-full bg-zinc-900 shadow-md ring-offset-2 ring-offset-[#0d0e12] transition-all duration-200 ease-out",
          TONE_RINGS[tone],
          featured ? "scale-[1.35] ring-[3px] shadow-glow" : "ring-2 hover:scale-110"
        )}
      >
        <Portrait src={item.image} name={item.name} className="block size-full" />
      </span>
    </button>
  );
});

// Testimonial Quote Card
const QuoteCard = React.memo(function QuoteCard({
  item,
  tone,
  roomy,
  mode,
  cardRef,
}: {
  item: GlobeTestimonial;
  tone: number;
  roomy: boolean;
  mode: "sizer" | "current" | "leaving";
  cardRef?: React.Ref<HTMLElement>;
}) {
  const rating = item.rating === undefined ? 5 : Math.max(0, Math.min(5, Math.round(item.rating)));
  const subtitle = [item.role, item.company].filter(Boolean).join(" • ");

  return (
    <figure
      ref={cardRef}
      aria-hidden={mode !== "current" || undefined}
      tabIndex={mode !== "current" ? -1 : undefined}
      className={cn(
        "relative col-start-1 row-start-1 m-0 flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121318]/90 backdrop-blur-xl text-white shadow-2xl transition-all",
        roomy ? "p-8 sm:p-9" : "p-6",
        mode === "sizer" && "invisible",
        mode === "leaving" && "pointer-events-none absolute inset-0"
      )}
    >
      {/* Top Bar: Quote Mark + 5-Star Rating */}
      <div className={cn("relative flex items-center justify-between gap-3", roomy ? "h-8 pr-28" : "h-7 pr-24")}>
        <div className="flex items-center gap-3">
          <QuoteMark className={cn("shrink-0 text-white/20", roomy ? "size-8" : "size-7")} />
          <div className="flex items-center gap-1 text-amber-400">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className={cn("size-4", i < rating ? "text-amber-400" : "text-white/20")} />
            ))}
          </div>
        </div>
      </div>

      {/* Quote Text */}
      <blockquote
        className={cn(
          "relative m-0 line-clamp-4 text-pretty text-white/95 font-medium",
          roomy ? "mt-4 text-lg sm:text-xl leading-relaxed" : "mt-3 text-base leading-snug"
        )}
      >
        <p>“{item.quote}”</p>
      </blockquote>

      {/* Author Footer */}
      <figcaption className={cn("relative mt-auto flex items-center gap-4", roomy ? "pt-6 border-t border-white/10" : "pt-4 border-t border-white/5")}>
        <span
          className={cn(
            "relative block shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[#121318]",
            TONE_RINGS[tone],
            roomy ? "size-12" : "size-10"
          )}
        >
          {mode !== "sizer" && <Portrait src={item.image} name={item.name} className="size-full" />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-white tracking-tight">{item.name}</span>
          {subtitle && <span className="block truncate text-xs text-white/60 mt-0.5">{subtitle}</span>}
        </span>

        <span className="shrink-0 text-right text-xs text-white/70">
          <span className="block font-semibold text-white/90">{item.city}</span>
          {item.country && (
            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-vvm-accentSubtle font-bold">
              {item.country}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
});

// Master 3D Globe Drawing Function: Renders the Exact Wireframe Sphere from Reference Video
function draw3DGlobeWireframe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phi: number,
  theta: number,
  dpr: number
) {
  const cx = (width * dpr) / 2;
  const cy = (height * dpr) / 2;
  const R = (width * dpr * GLOBE_RADIUS_SHARE) / 2;

  ctx.clearRect(0, 0, width * dpr, height * dpr);

  // 1. Ambient atmospheric glow
  const glow = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.15);
  glow.addColorStop(0, "rgba(108, 99, 255, 0.20)");
  glow.addColorStop(0.6, "rgba(108, 99, 255, 0.08)");
  glow.addColorStop(1, "rgba(108, 99, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
  ctx.fill();

  // 2. Dark Sphere Body (radial shadow)
  const sphereBody = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.05,
    cx,
    cy,
    R
  );
  sphereBody.addColorStop(0, "rgba(45, 48, 62, 0.65)");
  sphereBody.addColorStop(0.5, "rgba(22, 24, 32, 0.90)");
  sphereBody.addColorStop(0.85, "rgba(14, 15, 20, 0.98)");
  sphereBody.addColorStop(1, "rgba(8, 8, 12, 1)");

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = sphereBody;
  ctx.fill();

  // Outer border ring - crisp and luminous
  ctx.strokeStyle = "rgba(255, 255, 255, 0.40)";
  ctx.lineWidth = 1.4 * dpr;
  ctx.stroke();

  // Clip all interior grid lines to the sphere
  ctx.clip();

  // 3. Latitude Parallels (tilted by theta)
  const lats = [-65, -45, -25, 0, 25, 45, 65];
  for (const lat of lats) {
    const rad = (lat * Math.PI) / 180;
    const r = R * Math.cos(rad);
    const Yc = cy - R * Math.sin(rad) * Math.cos(theta);
    const rx = Math.max(0.5, r);
    const ry = Math.max(0.5, r * Math.sin(theta));

    ctx.beginPath();
    ctx.ellipse(cx, Yc, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = lat === 0 ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = (lat === 0 ? 1.6 : 1.0) * dpr;
    ctx.stroke();
  }

  // 4. Longitude Meridians (rotate in 3D with phi)
  const numMeridians = 12; // 12 lines every 30 degrees
  for (let i = 0; i < numMeridians; i++) {
    const angle = (i * Math.PI * 2) / numMeridians + phi;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const rx = Math.max(0.5, R * Math.abs(sinA));
    const ry = R;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    // Frontside lines are clear and vivid, backside lines are faint
    ctx.strokeStyle = cosA >= 0 ? "rgba(255, 255, 255, 0.30)" : "rgba(255, 255, 255, 0.10)";
    ctx.lineWidth = (cosA >= 0 ? 1.2 : 0.7) * dpr;
    ctx.stroke();
  }

  // 5. Delicate Geo-Matrix Surface Points
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 8; j++) {
      const lat = ((j - 3.5) * Math.PI) / 8;
      const lng = (i * Math.PI * 2) / 16;
      const cosLat = Math.cos(lat);
      const x0 = -cosLat * Math.cos(lng);
      const y0 = Math.sin(lat);
      const z0 = cosLat * Math.sin(lng);

      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const cosTh = Math.cos(theta);
      const sinTh = Math.sin(theta);

      const px = (cosPhi * x0 + sinPhi * z0) * R;
      const py = (sinPhi * sinTh * x0 + cosTh * y0 - cosPhi * sinTh * z0) * R;
      const depth = -sinPhi * cosTh * x0 + sinTh * y0 + cosPhi * cosTh * z0;

      if (depth > 0.1) {
        ctx.beginPath();
        ctx.arc(cx + px, cy - py, 1.2 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(depth * 0.4).toFixed(2)})`;
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

// The Master Testimonial Globe Component
export function TestimonialGlobe({
  items,
  eyebrow,
  heading,
  caption,
  action,
  autoRotate = true,
  rotationSpeed = 0.12,
  autoplay = true,
  interval = 4000,
  active,
  onActiveChange,
  size = 460,
  labels,
  className,
  onFocus,
  onBlur,
  ...props
}: TestimonialGlobeProps & React.ComponentProps<"section">) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const total = items.length;
  const headingId = React.useId();

  const containerRef = React.useRef<HTMLElement>(null);
  const layoutWrapperRef = React.useRef<HTMLDivElement>(null);
  const globeBoxRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pinsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  const cardRegionRef = React.useRef<HTMLDivElement>(null);
  const currentCardRef = React.useRef<HTMLElement>(null);
  const leavingCardRef = React.useRef<HTMLElement>(null);

  // SVG Leader Line refs
  const leaderGroupRef = React.useRef<SVGGElement>(null);
  const leaderLineRef = React.useRef<SVGLineElement>(null);
  const leaderPinDotRef = React.useRef<SVGCircleElement>(null);
  const leaderCardDotRef = React.useRef<SVGCircleElement>(null);

  const kickFrameRef = React.useRef<() => void>(() => {});
  const touchStartRef = React.useRef<{ id: number; x: number; y: number } | null>(null);
  const pinDOMCache = React.useRef<Array<{ el: HTMLElement; opacity: number; z: string; hit: string }>>([]);

  const [containerWidth, setContainerWidth] = React.useState(1200);
  const [motionReduced, setMotionReduced] = React.useState(false);
  const [internalActive, setInternalActive] = React.useState<number | null>(total > 0 ? 0 : null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isDraggingState, setIsDraggingState] = React.useState(false);
  const [approachingIndex, setApproachingIndex] = React.useState<number | null>(null);

  const isControlled = active !== undefined;
  const currentActive = isControlled ? active : internalActive;
  const activeIndex = currentActive !== null && currentActive >= 0 && currentActive < total ? Math.floor(currentActive) : null;

  // Responsive sizing calculations
  const sidePadding = containerWidth >= 1024 ? 48 : containerWidth >= 620 ? 28 : 16;
  const availableWidth = Math.max(0, Math.min(containerWidth, MAX_CONTAINER_WIDTH) - sidePadding * 2);
  const isWideLayout = availableWidth >= WIDE_BREAKPOINT_PX;
  const globeSize = Math.max(
    300,
    Math.round(
      isWideLayout
        ? Math.min(size, availableWidth * 0.48)
        : Math.min(size, 360, availableWidth * 0.85)
    )
  );
  const pinSize = globeSize >= 380 ? 44 : globeSize >= 300 ? 38 : 34;
  const columnGap = containerWidth >= 1024 ? 72 : 36;
  const isRoomyCard = isWideLayout && Math.min(availableWidth - globeSize - columnGap, 544) >= 420;

  const isAutoplayActive = autoplay && !motionReduced && total > 1 && !isHovered && !isFocused && !isDraggingState;

  // Internal mutable animation physics state
  const physicsRef = React.useRef({
    phi: 0,
    theta: GLOBE_THETA,
    velocity: 0,
    dragging: false,
    interacting: false,
    pressed: false,
    moved: false,
    pointerId: -1,
    pressX: 0,
    pressY: 0,
    lastX: 0,
    lastMoveAt: 0,
    moveGap: 0,
    turn: null as { from: number; to: number; start: number; index: number; commit: boolean } | null,
    vectors: [] as [number, number, number][],
    longitudes: [] as number[],
    depths: [] as number[],
    size: globeSize,
    pin: pinSize,
    wide: isWideLayout,
    featured: null as number | null,
    requested: null as number | null,
    front: -1,
    spin: false,
    follow: false,
    speed: rotationSpeed,
    reduced: false,
    onScreen: true,
    started: false,
    globeX: 0,
    globeY: 0,
    anchorX: 0,
    anchorY: 0,
    anchored: false,
    leaderShown: false,
    growStart: 0,
    growing: false,
    controlled: isControlled,
    onChange: onActiveChange,
  });

  const callbacksRef = React.useRef({
    arrive: (idx: number) => {},
    front: (idx: number) => {},
    settle: () => {},
  });

  const requestActiveChange = React.useCallback(
    (index: number) => {
      const p = physicsRef.current;
      if (index !== p.featured) {
        p.requested = index;
        if (!p.controlled) {
          p.featured = index;
          p.growStart = performance.now();
          setInternalActive(index);
        }
        p.onChange?.(index);
      }
    },
    []
  );

  const turnToLocation = React.useCallback(
    (index: number, commit: boolean) => {
      const p = physicsRef.current;
      const lng = p.longitudes[index];
      if (lng === undefined || (p.turn && p.turn.index === index && p.turn.commit === commit)) return;
      const targetPhi = nearestTurn(p.phi, facingPhi(lng));
      p.velocity = 0;
      if (p.reduced) {
        p.phi = targetPhi;
        p.turn = null;
        if (commit) callbacksRef.current.arrive(index);
      } else {
        p.turn = {
          from: p.phi,
          to: targetPhi,
          start: performance.now(),
          index,
          commit,
        };
      }
      kickFrameRef.current();
    },
    []
  );

  const selectReview = React.useCallback(
    (index: number) => {
      requestActiveChange(index);
      turnToLocation(index, false);
    },
    [requestActiveChange, turnToLocation]
  );

  // Sync physics state
  React.useLayoutEffect(() => {
    const p = physicsRef.current;
    if (p.vectors.length !== items.length) {
      p.front = -1;
      p.depths = new Array(items.length).fill(0);
    }
    p.vectors = items.map((m) => toCartesian(m.lat, m.lng));
    p.longitudes = items.map((m) => m.lng);

    if (!p.started && globeSize > 0) {
      p.started = true;
      const initial = activeIndex !== null ? items[activeIndex] : items[0];
      if (initial) p.phi = facingPhi(initial.lng);
    }

    if (p.featured !== activeIndex) {
      const isExternalChange = isControlled && activeIndex !== p.requested;
      p.featured = activeIndex;
      p.requested = activeIndex;
      p.growStart = performance.now();
      if (isExternalChange && activeIndex !== null && p.started) {
        turnToLocation(activeIndex, false);
      }
    }

    p.size = globeSize;
    p.pin = pinSize;
    p.wide = isWideLayout;
    p.speed = rotationSpeed;
    p.reduced = motionReduced;
    p.controlled = isControlled;
    p.onChange = onActiveChange;
    p.spin = autoRotate && !motionReduced && !isFocused;
    p.follow = (!autoplay || isDraggingState) && !isFocused;

    callbacksRef.current = {
      arrive: (idx) => {
        setApproachingIndex(null);
        requestActiveChange(idx);
      },
      front: (idx) => requestActiveChange(idx),
      settle: () => setIsDraggingState(false),
    };

    kickFrameRef.current();
  });

  // Track container width
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Update layout anchor coordinates for leader line
  const updateAnchors = React.useCallback(() => {
    const layout = layoutWrapperRef.current;
    const globeBox = globeBoxRef.current;
    const card = cardRegionRef.current;
    const p = physicsRef.current;
    if (!layout || !globeBox || !card) {
      p.anchored = false;
      return;
    }
    const layoutRect = layout.getBoundingClientRect();
    const globeRect = globeBox.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    p.globeX = globeRect.left - layoutRect.left;
    p.globeY = globeRect.top - layoutRect.top;
    p.anchorX = cardRect.left - layoutRect.left;
    p.anchorY = cardRect.top - layoutRect.top + Math.min(44, cardRect.height / 2);
    p.anchored = cardRect.width > 0;
    kickFrameRef.current();
  }, []);

  React.useLayoutEffect(() => {
    updateAnchors();
    const layout = layoutWrapperRef.current;
    const card = cardRegionRef.current;
    if (!layout || !card) return;
    const ro = new ResizeObserver(updateAnchors);
    ro.observe(layout);
    ro.observe(card);
    return () => ro.disconnect();
  }, [updateAnchors, isWideLayout, globeSize]);

  // Motion reduction and visibility tracking
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const p = physicsRef.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      p.reduced = mq.matches;
      setMotionReduced(mq.matches);
      kickFrameRef.current();
    };
    const onVisibility = () => {
      kickFrameRef.current();
    };
    const observer = new IntersectionObserver(([entry]) => {
      p.onScreen = entry?.isIntersecting ?? true;
      kickFrameRef.current();
    });

    onMotion();
    mq.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(el);

    return () => {
      mq.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  // Frame update logic: updates pins and leader line on screen
  const updatePinsAndLeader = React.useCallback((now: number) => {
    const p = physicsRef.current;
    const cache = pinDOMCache.current;
    const { vectors, size: sz, phi, theta } = p;
    let frontIdx = -1;
    let maxDepth = -Infinity;
    let activePinPos: { x: number; y: number; depth: number; scale: number } | null = null;

    for (let i = 0; i < vectors.length; i++) {
      const vec = vectors[i];
      if (!vec) continue;
      const proj = project(vec, phi, theta, PIN_ELEVATION);
      p.depths[i] = proj.depth;
      if (proj.depth > maxDepth) {
        maxDepth = proj.depth;
        frontIdx = i;
      }
      const pinEl = pinsRef.current[i];
      if (!pinEl) continue;

      const isFeatured = i === p.featured;
      const op = Math.round(pinOpacity(proj.depth, proj.rim) * 100) / 100;
      const sc = pinScale(proj.depth);
      const zIndex = String((isFeatured ? 100 : 0) + Math.round((proj.depth + 1) * 40));
      const hit = op > 0.4 ? "auto" : "none";

      const prev = cache[i];
      if (!prev || prev.opacity !== op) pinEl.style.opacity = String(op);
      if (!prev || prev.z !== zIndex) pinEl.style.zIndex = zIndex;
      if (!prev || prev.hit !== hit) pinEl.style.pointerEvents = hit;
      cache[i] = { el: pinEl, opacity: op, z: zIndex, hit };

      if (op > 0) {
        pinEl.style.transform = `translate3d(${(proj.x * sz).toFixed(2)}px, ${(proj.y * sz).toFixed(2)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(3)})`;
      }
      if (isFeatured) {
        activePinPos = { x: proj.x * sz, y: proj.y * sz, depth: proj.depth, scale: sc };
      }
    }

    if (frontIdx >= 0 && frontIdx !== p.front) {
      const currentFrontDepth = p.depths[p.front] ?? -Infinity;
      if (p.front < 0) {
        p.front = frontIdx;
      } else if (maxDepth > currentFrontDepth + FRONT_MARGIN) {
        p.front = frontIdx;
        if (p.follow && !p.turn) callbacksRef.current.front(frontIdx);
      }
    }

    // Leader pointer line
    const group = leaderGroupRef.current;
    const line = leaderLineRef.current;
    const pinDot = leaderPinDotRef.current;
    const cardDot = leaderCardDotRef.current;
    if (!group || !line || !pinDot || !cardDot) return;

    p.growing = false;
    const showLeader = p.wide && p.anchored && !p.turn && !!activePinPos && activePinPos.depth > 0.15;
    if (showLeader !== p.leaderShown) {
      p.leaderShown = showLeader;
      group.style.opacity = showLeader ? "1" : "0";
      if (showLeader) p.growStart = now;
    }
    if (!showLeader || !activePinPos) return;

    const pinWorldX = p.globeX + activePinPos.x;
    const pinWorldY = p.globeY + activePinPos.y;
    const dx = p.anchorX - pinWorldX;
    const dy = p.anchorY - pinWorldY;
    const dist = Math.hypot(dx, dy) || 1;
    const pinOffset = (p.pin / 2) * 1.35 * activePinPos.scale + 6;
    const lineLength = Math.max(0, dist - pinOffset);
    const progress = p.reduced ? 1 : smooth(clamp01((now - p.growStart) / 360));
    p.growing = progress < 1;

    const startX = pinWorldX + (dx / dist) * pinOffset;
    const startY = pinWorldY + (dy / dist) * pinOffset;

    line.style.transform = `translate(${startX.toFixed(2)}px, ${startY.toFixed(2)}px) rotate(${Math.atan2(dy, dx).toFixed(4)}rad) scaleX(${Math.max(0.001, lineLength * progress).toFixed(2)})`;
    pinDot.style.transform = `translate(${startX.toFixed(2)}px, ${startY.toFixed(2)}px)`;
    cardDot.style.transform = `translate(${p.anchorX.toFixed(2)}px, ${p.anchorY.toFixed(2)}px) scale(${progress >= 1 ? 1 : 0})`;
  }, []);

  // Main 3D Canvas Rendering Loop (Guaranteed 100% Reliable & Native)
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || globeSize <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = globeSize * dpr;
    canvas.height = globeSize * dpr;

    const p = physicsRef.current;
    let rafId = 0;
    let lastTime = 0;

    const isBusy = () =>
      p.dragging ||
      p.interacting ||
      p.turn !== null ||
      p.growing ||
      Math.abs(p.velocity) > 0.0001 ||
      (p.spin && p.speed !== 0);

    const frame = (time: number) => {
      rafId = 0;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      const turn = p.turn;
      if (turn) {
        const tProgress = p.reduced ? 1 : clamp01((time - turn.start) / TURN_DURATION_MS);
        p.phi = turn.from + (turn.to - turn.from) * easeOutExpo(tProgress);
        p.velocity = 0;
        if (tProgress >= 1) {
          p.turn = null;
          p.phi = turn.to;
          if (turn.commit) callbacksRef.current.arrive(turn.index);
        }
      } else if (!p.dragging) {
        if (Math.abs(p.velocity) > 0.0001) {
          const step = dt * 60;
          p.phi += p.velocity * step;
          p.velocity *= Math.pow(VELOCITY_DECAY, step);
        } else {
          p.velocity = 0;
          if (p.spin) p.phi += p.speed * dt;
        }
      }

      if (p.interacting && !p.dragging && p.velocity === 0) {
        p.interacting = false;
        callbacksRef.current.settle();
      }

      // Draw the exact 3D wireframe globe from the reference video
      draw3DGlobeWireframe(ctx, globeSize, globeSize, p.phi, p.theta, dpr);

      // Project and animate pins + leader line
      updatePinsAndLeader(time);

      if (isBusy() && p.onScreen && !document.hidden) {
        rafId = requestAnimationFrame(frame);
      } else {
        lastTime = 0;
      }
    };

    kickFrameRef.current = () => {
      if (!rafId) rafId = requestAnimationFrame(frame);
    };

    // First render immediate
    draw3DGlobeWireframe(ctx, globeSize, globeSize, p.phi, p.theta, dpr);
    updatePinsAndLeader(performance.now());
    kickFrameRef.current();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [globeSize, updatePinsAndLeader]);

  // Autoplay timer: advances to next review
  React.useEffect(() => {
    if (!isAutoplayActive) return;
    const timer = window.setTimeout(() => {
      const next = ((physicsRef.current.featured ?? -1) + 1) % total;
      setApproachingIndex(next);
      turnToLocation(next, true);
    }, Math.max(0, interval - TURN_DURATION_MS));
    return () => window.clearTimeout(timer);
  }, [isAutoplayActive, activeIndex, interval, total, turnToLocation]);

  // Card slide transition state
  const [cardState, setCardState] = React.useState({
    shown: activeIndex,
    leaving: null as number | null,
    key: 0,
  });

  if (cardState.shown !== activeIndex) {
    setCardState({
      shown: activeIndex,
      leaving: motionReduced ? null : cardState.shown,
      key: cardState.key + 1,
    });
  }

  React.useLayoutEffect(() => {
    if (cardState.key === 0 || physicsRef.current.reduced) return;
    const cur = currentCardRef.current;
    const lvg = leavingCardRef.current;

    cur?.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], {
      duration: CARD_TRANSITION_MS,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    });

    lvg?.animate([{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(12px) scale(0.98)" }], {
      duration: CARD_TRANSITION_MS,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards",
    });

    const key = cardState.key;
    const timer = window.setTimeout(() => {
      setCardState((s) => (s.key === key ? { ...s, leaving: null } : s));
    }, CARD_TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [cardState.key]);

  // Step pagination (-1 or +1)
  const stepReview = (step: number) => {
    if (total === 0) return;
    const curr = activeIndex ?? 0;
    const next = (curr + step + total) % total;
    selectReview(next);
  };

  // Pointer drag interactions on Globe
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    const p = physicsRef.current;
    p.pressed = true;
    p.moved = false;
    p.pointerId = e.pointerId;
    p.pressX = p.lastX = e.clientX;
    p.pressY = e.clientY;
    p.lastMoveAt = e.timeStamp;
    p.moveGap = 0;
    p.velocity = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physicsRef.current;
    if (!p.pressed || e.pointerId !== p.pointerId) return;
    if (!p.dragging) {
      if (Math.hypot(e.clientX - p.pressX, e.clientY - p.pressY) < DRAG_THRESHOLD_PX) return;
      p.moved = true;
      p.dragging = true;
      p.interacting = true;
      p.turn = null;
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDraggingState(true);
      kickFrameRef.current();
    }
    const now = e.timeStamp;
    const delta = ((e.clientX - p.lastX) / Math.max(p.size, 1)) * Math.PI;
    const gap = Math.max(now - p.lastMoveAt, 1);
    p.moveGap = gap;
    p.lastX = e.clientX;
    p.lastMoveAt = now;
    p.phi += delta;
    p.velocity = (delta / gap) * (1000 / 60);
    if (Math.abs(e.clientX - p.pressX) > DRAG_THRESHOLD_PX) p.moved = true;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physicsRef.current;
    if (e.pointerId === p.pointerId) {
      if (p.dragging) {
        const threshold = Math.min(250, Math.max(RELEASE_CHECK_MS, p.moveGap * 1.5));
        if (p.reduced || e.timeStamp - p.lastMoveAt > threshold) {
          p.velocity = 0;
        }
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }
      p.dragging = false;
      p.pressed = false;
      p.pointerId = -1;
      kickFrameRef.current();
    }
  };

  // Header metrics
  const avgRating = React.useMemo(() => {
    const rated = items.filter((m) => typeof m.rating === "number");
    if (!rated.length) return "5.0";
    return (rated.reduce((acc, cur) => acc + (cur.rating ?? 5), 0) / rated.length).toFixed(1);
  }, [items]);

  const uniqueLocations = React.useMemo(() => {
    return new Set(items.map((m) => m.city)).size;
  }, [items]);

  const currentItem = cardState.shown !== null ? items[cardState.shown] : undefined;
  const leavingItem = cardState.leaving !== null ? items[cardState.leaving] : undefined;

  return (
    <section
      {...props}
      ref={containerRef}
      aria-labelledby={heading ? headingId : undefined}
      className={cn("relative isolate w-full overflow-hidden bg-[#0a0a0c] text-white py-20 sm:py-28", className)}
      onFocus={(e) => {
        onFocus?.(e);
        if (e.target.matches(":focus-visible")) setIsFocused(true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        const related = e.relatedTarget as Node | null;
        if (!related || !e.currentTarget.contains(related)) setIsFocused(false);
      }}
    >
      {/* Background radial atmosphere glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: isWideLayout
            ? "radial-gradient(42% 60% at 28% 50%, rgba(108, 99, 255, 0.15), transparent 72%)"
            : "radial-gradient(70% 38% at 50% 48%, rgba(108, 99, 255, 0.15), transparent 72%)",
        }}
      />

      {/* Main Grid Wrapper */}
      <div
        ref={layoutWrapperRef}
        className={cn(
          "relative mx-auto w-full",
          isWideLayout ? "grid items-center gap-y-6" : "flex flex-col items-center gap-6"
        )}
        style={{
          maxWidth: MAX_CONTAINER_WIDTH,
          paddingInline: sidePadding,
          ...(isWideLayout
            ? {
                gridTemplateColumns: `${globeSize}px minmax(0, 36rem)`,
                columnGap,
                justifyContent: "center",
              }
            : {}),
        }}
      >
        {/* Header Content */}
        <header
          className={cn(
            "flex min-w-0 flex-col",
            isWideLayout ? "col-start-2 row-start-1 items-start self-end text-left" : "w-full items-center text-center"
          )}
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-vvm-accentSubtle mb-2">
              <span className="w-2 h-2 rounded-full bg-vvm-accent animate-pulse" />
              <span>{eyebrow}</span>
            </div>
          )}

          {heading && (
            <h2
              id={headingId}
              className="m-0 mt-2 text-balance font-extrabold tracking-tight text-white text-3xl sm:text-4xl md:text-5xl leading-[1.08]"
            >
              {heading}
            </h2>
          )}

          {caption && (
            <p className="m-0 mt-3 max-w-prose text-pretty text-sm sm:text-base text-white/70 leading-relaxed">
              {caption}
            </p>
          )}

          {/* Social Proof Counters + CTA */}
          <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", isWideLayout ? "mt-6 justify-start" : "mt-4 justify-center")}>
            <dl className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/60">
              <div className="flex items-baseline gap-1.5">
                <dd className="order-1 m-0 font-bold font-mono text-white text-base">{total}</dd>
                <dt className="order-2 font-medium">Verified Editors</dt>
              </div>

              <span aria-hidden="true" className="h-3 w-px bg-white/15" />

              <div className="flex items-baseline gap-1.5">
                <dd className="order-1 m-0 inline-flex items-center gap-1 font-bold font-mono text-white text-base">
                  <StarIcon className="size-4 text-amber-400" />
                  {avgRating}
                </dd>
                <dt className="order-2 font-medium">Average Rating</dt>
              </div>

              <span aria-hidden="true" className="h-3 w-px bg-white/15" />

              <div className="flex items-baseline gap-1.5">
                <dd className="order-1 m-0 font-bold font-mono text-white text-base">{uniqueLocations}</dd>
                <dt className="order-2 font-medium">Indian Cities</dt>
              </div>
            </dl>

            {action}
          </div>
        </header>

        {/* 3D Globe Viewport */}
        <div
          ref={globeBoxRef}
          data-globe-box
          className={cn("relative shrink-0 touch-pan-y select-none", isWideLayout && "col-start-1 row-span-2 row-start-1 self-center")}
          style={{ width: globeSize, height: globeSize }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            physicsRef.current.velocity = 0;
            physicsRef.current.dragging = false;
            setIsDraggingState(false);
          }}
        >
          {/* Background Twinkling Stars */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {STATIC_STARS.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full bg-white/60 animate-pulse"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>

          {/* 3D Wireframe Canvas */}
          <canvas
            ref={canvasRef}
            data-globe-canvas
            aria-hidden="true"
            className="absolute inset-0 size-full cursor-grab active:cursor-grabbing"
            style={{ width: globeSize, height: globeSize }}
          />

          {/* Floating Pins Layer */}
          <div className="pointer-events-none absolute inset-0">
            {items.map((item, idx) => (
              <Pin
                key={item.id}
                item={item}
                index={idx}
                tone={toneOf(item, idx)}
                size={pinSize}
                label={`${resolvedLabels.pin} ${item.name}, ${item.city}`}
                featured={idx === activeIndex}
                approaching={approachingIndex === idx}
                register={(i, el) => {
                  pinsRef.current[i] = el;
                }}
                onEnter={(i) => {
                  setIsHovered(true);
                  requestActiveChange(i);
                }}
                onLeave={() => setIsHovered(false)}
                onPress={(i) => selectReview(i)}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Card Display Area */}
        <div
          className={cn("relative w-full min-w-0", isWideLayout ? "col-start-2 row-start-2 self-start" : "max-w-xl")}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {/* Card Backing Glow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 -bottom-4 -z-10 h-10 rounded-[100%] bg-vvm-accent opacity-20 blur-2xl"
          />

          {/* Cards Stack */}
          <div
            ref={cardRegionRef}
            data-quote-region
            aria-live={autoplay ? "off" : "polite"}
            aria-atomic="true"
            className="grid touch-pan-y"
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") {
                touchStartRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
              }
            }}
            onPointerUp={(e) => {
              const start = touchStartRef.current;
              if (!start || start.id !== e.pointerId) return;
              touchStartRef.current = null;
              const dx = e.clientX - start.x;
              const dy = e.clientY - start.y;
              if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
                stepReview(dx < 0 ? 1 : -1);
              }
            }}
            onPointerCancel={() => {
              touchStartRef.current = null;
            }}
          >
            {/* Invisible Sizer for Smooth Dynamic Layout Height */}
            {items.map((item, idx) => (
              <QuoteCard key={`sizer-${item.id}`} item={item} tone={toneOf(item, idx)} roomy={isRoomyCard} mode="sizer" />
            ))}

            {/* Leaving Card in Animation */}
            {leavingItem && cardState.leaving !== null && (
              <QuoteCard
                key={`leaving-${cardState.key}`}
                cardRef={leavingCardRef}
                item={leavingItem}
                tone={toneOf(leavingItem, cardState.leaving)}
                roomy={isRoomyCard}
                mode="leaving"
              />
            )}

            {/* Current Active Card */}
            {currentItem && cardState.shown !== null && (
              <QuoteCard
                key={`current-${cardState.key}`}
                cardRef={currentCardRef}
                item={currentItem}
                tone={toneOf(currentItem, cardState.shown)}
                roomy={isRoomyCard}
                mode="current"
              />
            )}
          </div>

          {/* Navigation Controls: Prev / Next */}
          {total > 1 && (
            <div className={cn("absolute z-10 flex items-center gap-1.5", isRoomyCard ? "right-6 top-6" : "right-4 top-4")}>
              <button
                type="button"
                aria-label={resolvedLabels.previous}
                className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-subtle cursor-pointer focus-visible:outline-2 focus-visible:outline-vvm-accent"
                onClick={() => stepReview(-1)}
              >
                <Chevron direction="left" />
              </button>

              <span className="min-w-12 text-center text-xs font-mono font-bold text-white/60 tabular-nums">
                {activeIndex === null ? "–" : activeIndex + 1} / {total}
              </span>

              <button
                type="button"
                aria-label={resolvedLabels.next}
                className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-subtle cursor-pointer focus-visible:outline-2 focus-visible:outline-vvm-accent"
                onClick={() => stepReview(1)}
              >
                <Chevron direction="right" />
              </button>
            </div>
          )}
        </div>

        {/* SVG Connecting Leader Pointer Line */}
        {isWideLayout && (
          <svg
            aria-hidden="true"
            data-leader
            className="pointer-events-none absolute left-0 top-0 z-[95] size-px overflow-visible text-vvm-accent"
          >
            <g ref={leaderGroupRef} className="opacity-0 transition-opacity duration-200">
              <line
                ref={leaderLineRef}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
                stroke="currentColor"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                vectorEffect="non-scaling-stroke"
              />
              <circle ref={leaderPinDotRef} r="3" className="fill-vvm-accent" />
              <circle
                ref={leaderCardDotRef}
                r="4.5"
                className="fill-[#121318] stroke-vvm-accent"
                strokeWidth="2"
              />
            </g>
          </svg>
        )}
      </div>
    </section>
  );
}

export default TestimonialGlobe;
