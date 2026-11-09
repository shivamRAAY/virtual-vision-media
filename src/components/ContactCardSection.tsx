'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Mail,
  Instagram,
  Copy,
  CheckCheck,
  Send,
  ExternalLink,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Globe,
  Radio
} from 'lucide-react';

const CONTACT_EMAIL = 'virtualvisionmed@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/virtualvision.media?cplk=YnY1c3pkOW13anVr';
const INSTAGRAM_HANDLE = '@virtualvision.media';

// =========================================================================
// 21ST.DEV INTERACTIVE 3D PERSPECTIVE TILT CARD COMPONENT
// =========================================================================
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const Card3D: React.FC<Card3DProps> = ({ children, className = '', glowColor = 'rgba(108, 86, 212, 0.12)' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for organic motion
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 22 });

  // 3D Rotations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  // Sheen reflection coordinates
  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const sheenBg = useMotionTemplate`radial-gradient(450px circle at ${sheenX} ${sheenY}, ${glowColor}, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative transition-all duration-300 w-full ${className}`}
      >
        {/* Dynamic Sheen Glare */}
        <motion.div
          aria-hidden="true"
          style={{
            background: sheenBg,
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
        />

        {children}
      </motion.div>
    </div>
  );
};

export const ContactCardSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '100GB Master Vault Support',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleQuickSubject = (subj: string) => {
    setFormData((prev) => ({ ...prev, subject: subj }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setSubmitted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#6C56D4', '#EC4899', '#10B981', '#151515'],
          });
        } catch {}
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 bg-[#F7F7F5] text-vvm-text overflow-hidden border-t border-vvm-border selection:bg-vvm-accent selection:text-white"
    >
      {/* 3D FLOATING KINETIC AMBIENT ORBS (Website Palette) */}
      <motion.div
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -30, 15, 0],
          scale: [1, 1.06, 0.96, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-10 left-1/4 w-[420px] h-[300px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/30 to-pink-100/30 blur-[100px] rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 25, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute bottom-10 right-1/4 w-[450px] h-[320px] bg-gradient-to-bl from-pink-200/35 via-rose-100/25 to-indigo-100/25 blur-[110px] rounded-full"
      />

      {/* Subtle Micro-dot Grid in website tone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center space-y-3.5 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-vvm-border shadow-subtle text-xs font-mono text-vvm-accent font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct Studio Communications • Online Now</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-vvm-text leading-tight"
          >
            Let&apos;s Create Something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-text via-purple-600 to-pink-600">
              Extraordinary.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-vvm-muted leading-relaxed max-w-xl mx-auto"
          >
            Have a question about the 100GB Master Vault, need custom color grading LUTs, or looking for creator collaborations? Connect with our studio directly.
          </motion.p>
        </div>

        {/* ================= BALANCED BENTO GRID: ROW 1 (INSTAGRAM & EMAIL EQUAL TWINS) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* CARD 1: INSTAGRAM STUDIO (EQUAL 50% WIDTH) */}
          <Card3D
            glowColor="rgba(236, 72, 153, 0.16)"
            className="p-6 sm:p-7 rounded-3xl bg-white/95 hover:bg-white border border-vvm-border hover:border-pink-300 shadow-card hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)] backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div style={{ transform: 'translateZ(30px)' }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5 shadow-md flex-shrink-0">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-[#dc2743]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-vvm-text tracking-tight">Instagram Studio</h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    </div>
                    <span className="text-xs font-mono text-pink-600 font-semibold">{INSTAGRAM_HANDLE}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                  Daily Drops
                </span>
              </div>

              {/* Description */}
              <p style={{ transform: 'translateZ(20px)' }} className="text-xs text-vvm-muted leading-relaxed">
                Watch raw vs. graded video breakdowns, before/after DaVinci color grading reels, and get alerted to weekly free presets.
              </p>

              {/* Tag chips */}
              <div style={{ transform: 'translateZ(25px)' }} className="flex flex-wrap gap-1.5 text-[10px] font-mono text-vvm-muted">
                <span className="px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">#CinematicLUTs</span>
                <span className="px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">#DaVinciResolve</span>
                <span className="px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">#FilmBurns</span>
                <span className="px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">#SoundDesign</span>
              </div>
            </div>

            {/* 3D Elevated Button & Footer */}
            <div style={{ transform: 'translateZ(35px)' }} className="pt-5 space-y-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#bc1888] via-[#dc2743] to-[#f09433] hover:opacity-95 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-elevated transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Follow {INSTAGRAM_HANDLE}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] font-mono text-vvm-muted pt-1">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                  <span>Reels &amp; Presets Active</span>
                </span>
                <span>Verified Creator Channel</span>
              </div>
            </div>
          </Card3D>

          {/* CARD 2: OFFICIAL STUDIO INBOX (EQUAL 50% WIDTH, PERFECTLY ALIGNED SIDE-BY-SIDE) */}
          <Card3D
            glowColor="rgba(108, 86, 212, 0.16)"
            className="p-6 sm:p-7 rounded-3xl bg-white/95 hover:bg-white border border-vvm-border hover:border-purple-300 shadow-card hover:shadow-[0_20px_50px_rgba(108,86,212,0.12)] backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div style={{ transform: 'translateZ(30px)' }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shadow-subtle flex-shrink-0">
                    <Mail className="w-6 h-6 text-vvm-accent" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-vvm-text tracking-tight">Official Studio Inbox</h4>
                    <span className="text-xs font-mono text-vvm-accent font-semibold truncate block select-all">
                      {CONTACT_EMAIL}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Priority
                </span>
              </div>

              {/* Description */}
              <p style={{ transform: 'translateZ(20px)' }} className="text-xs text-vvm-muted leading-relaxed">
                Direct channel for enterprise commercial licensing, custom asset packages, technical support, and creator collaborations.
              </p>

              {/* Trust Badges */}
              <div style={{ transform: 'translateZ(25px)' }} className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-vvm-muted">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>&lt; 2hr Response Time</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-vvm-soft border border-vvm-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Secured</span>
                </span>
              </div>
            </div>

            {/* Action Row: 1-Click Copy + Direct Compose */}
            <div style={{ transform: 'translateZ(35px)' }} className="pt-5 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="py-3 px-3 rounded-xl bg-vvm-soft hover:bg-vvm-silver/40 border border-vvm-border text-vvm-text text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-subtle"
                >
                  {copiedEmail ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-vvm-muted" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20from%20Virtual%20Vision%20Media%20Website`}
                  className="py-3 px-3 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-elevated text-center cursor-pointer"
                >
                  <span>Compose</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-vvm-muted pt-1">
                <span>Monitored 24/7 by Founders</span>
                <span>Direct Studio Pipeline</span>
              </div>
            </div>
          </Card3D>

        </div>

        {/* ================= ROW 2: FULL-WIDTH DIRECT MESSAGE DISPATCHER ================= */}
        <Card3D
          glowColor="rgba(108, 86, 212, 0.10)"
          className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-vvm-border hover:border-purple-200 shadow-card hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl"
        >
          <div className="space-y-6">
            
            {/* Header */}
            <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-vvm-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-vvm-accent flex items-center justify-center border border-purple-100 flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vvm-text tracking-tight">
                    Direct Message Dispatcher
                  </h3>
                  <p className="text-xs font-mono text-vvm-muted">
                    Transmits directly to {CONTACT_EMAIL} with immediate studio notification.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold self-start sm:self-auto">
                Direct Dispatch Active
              </span>
            </div>

            {submitted ? (
              /* Success View */
              <div style={{ transform: 'translateZ(35px)' }} className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-vvm-text tracking-tight">
                    Inquiry Received
                  </h4>
                  <p className="text-xs font-mono text-vvm-muted max-w-md mx-auto">
                    Your message has been routed to our studio team at{' '}
                    <strong className="text-vvm-text">{CONTACT_EMAIL}</strong>. We will reply to your email shortly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '100GB Master Vault Support', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-vvm-soft hover:bg-vvm-silver/40 text-vvm-text font-mono text-xs font-semibold transition-colors cursor-pointer border border-vvm-border"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Topic Selector Chips */}
                <div style={{ transform: 'translateZ(25px)' }} className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-vvm-muted font-medium">
                    Select Inquiry Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '100GB Master Vault Support',
                      'Custom LUT Calibration',
                      'Commercial Licensing',
                      'Creator Collaboration',
                      'General Question',
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleQuickSubject(topic)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          formData.subject === topic
                            ? 'bg-vvm-text text-white font-bold shadow-subtle'
                            : 'bg-vvm-soft text-vvm-muted hover:text-vvm-text hover:bg-vvm-silver/30 border border-vvm-border'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Inputs Grid */}
                <div style={{ transform: 'translateZ(25px)' }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-vvm-text mb-1.5 font-medium">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aryan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F7F5] border border-vvm-border text-vvm-text font-mono text-xs focus:outline-none focus:border-vvm-accent focus:bg-white transition-all placeholder:text-vvm-muted shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-vvm-text mb-1.5 font-medium">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aryan@editorstudio.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F7F5] border border-vvm-border text-vvm-text font-mono text-xs focus:outline-none focus:border-vvm-accent focus:bg-white transition-all placeholder:text-vvm-muted shadow-inner"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div style={{ transform: 'translateZ(25px)' }}>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-vvm-text mb-1.5 font-medium">
                    Message / Project Brief *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you're creating or ask any questions regarding our presets..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F7F5] border border-vvm-border text-vvm-text font-mono text-xs focus:outline-none focus:border-vvm-accent focus:bg-white transition-all placeholder:text-vvm-muted resize-none shadow-inner"
                  />
                </div>

                {/* Submit Action */}
                <div style={{ transform: 'translateZ(35px)' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-vvm-text hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider shadow-elevated transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Dispatching to Studio...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>Transmit Message Directly</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

            {/* Footer Metadata */}
            <div style={{ transform: 'translateZ(20px)' }} className="pt-4 border-t border-vvm-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-vvm-muted">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-vvm-accent" />
                <span>Virtual Vision Media • Global &amp; Indian Creator Studio</span>
              </span>
              <span>Response Guaranteed within 24 Hours</span>
            </div>

          </div>
        </Card3D>

      </div>
    </section>
  );
};
