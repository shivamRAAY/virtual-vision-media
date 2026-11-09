'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { X, Gift, Download, Check, Sparkles, ShieldCheck, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

const FREEBIE_DRIVE_LINK = "https://drive.google.com/drive/folders/1HYWrteRByCcQ66Gs2t5TkLmwH9zH5lfG";

export const FreebiesModal: React.FC = () => {
  const { isFreebiesOpen, setIsFreebiesOpen, completeOrder } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [software, setSoftware] = useState('DaVinci Resolve');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isFreebiesOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    // Trigger instant free download activation
    completeOrder(
      {
        name,
        email,
        phone: phone || undefined,
      },
      'FREE_ACCESS',
      `free_token_${Date.now()}`
    );

    // Save lead to local storage
    try {
      const existingLeads = JSON.parse(localStorage.getItem('vvm_leads') || '[]');
      existingLeads.push({
        name,
        email,
        phone,
        software,
        date: new Date().toISOString(),
      });
      localStorage.setItem('vvm_leads', JSON.stringify(existingLeads));
    } catch (e) {
      // ignore
    }

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#A9B9FF', '#FFFFFF', '#10B981']
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(FREEBIE_DRIVE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setIsFreebiesOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-vvm-border overflow-hidden z-10 animate-fadeIn">
        
        {/* Header */}
        <div className="relative h-44 bg-[#F7F7F5] flex items-center justify-center p-6 border-b border-vvm-border overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#6C63FF_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-vvm-muted hover:text-vvm-text shadow-subtle z-10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative text-center space-y-1.5 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vvm-text text-white text-[11px] font-mono">
              <Gift className="w-3.5 h-3.5 text-vvm-accent" />
              <span>Zero Cost • Lifetime Commercial License</span>
            </div>
            <h3 className="text-2xl font-bold text-vvm-text tracking-tight">
              Start creating. On us.
            </h3>
            <p className="text-xs text-vvm-muted max-w-xs mx-auto">
              Download 35 master assets curated directly from our 100GB creative vault.
            </p>
          </div>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-6 md:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7" />
              </div>

              <h4 className="text-xl font-bold text-vvm-text">
                Free Starter Pack Unlocked!
              </h4>
              
              <p className="text-xs text-vvm-muted max-w-sm mx-auto">
                Thank you <strong className="text-vvm-text">{name}</strong>! Your access link has been generated and dispatched to <strong className="text-vvm-text">{email}</strong>.
              </p>
            </div>

            {/* Google Drive Link Box */}
            <div className="p-5 rounded-2xl bg-vvm-soft/60 border border-vvm-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-vvm-muted">
                <span className="flex items-center gap-1.5 font-bold text-vvm-text">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Google Drive Cloud Vault
                </span>
                <span className="text-emerald-700 font-semibold">1.2 GB Unrestricted</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-vvm-border/80 font-mono text-[11px] text-vvm-muted truncate select-all">
                {FREEBIE_DRIVE_LINK}
              </div>

              {/* Primary Action Button: Open in Google Drive */}
              <a
                href={FREEBIE_DRIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-elevated transition-colors"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Secondary Copy Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-vvm-soft border border-vvm-border text-vvm-text text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Google Drive Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-vvm-muted" />
                    <span>Copy Google Drive Link</span>
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-vvm-border/60 text-[11px] text-vvm-muted font-mono space-y-1">
                <div>✓ 5x Hollywood LUTs (.CUBE)</div>
                <div>✓ 15x 96kHz Sound Effects (.WAV)</div>
                <div>✓ 5x 4K ProRes Film Burns & 10x Editorial Titles</div>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={handleClose}
                className="text-xs font-mono text-vvm-muted hover:text-vvm-text underline"
              >
                Done and return to store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            
            {/* Asset checklist */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-vvm-soft/50 border border-vvm-border text-xs font-mono text-vvm-text">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vvm-accent" />
                <span>5x Hollywood LUTs (.CUBE)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vvm-accent" />
                <span>15x 96kHz SFX (WAV)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vvm-accent" />
                <span>5x 4K Film Burns (ProRes)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vvm-accent" />
                <span>10x Editorial Titles</span>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-vvm-text mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aryan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-vvm-border bg-vvm-bg/30 focus:outline-none focus:border-vvm-accent"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-vvm-text mb-1">
                Email Address (where to send download link) *
              </label>
              <input
                type="email"
                required
                placeholder="editor@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-vvm-border bg-vvm-bg/30 focus:outline-none focus:border-vvm-accent"
              />
            </div>

            {/* WhatsApp / Phone Input */}
            <div>
              <label className="block text-xs font-medium text-vvm-text mb-1">
                WhatsApp / Mobile Number <span className="text-vvm-muted font-normal">(Optional for instant link alert)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-vvm-border bg-vvm-bg/30 focus:outline-none focus:border-vvm-accent"
              />
            </div>

            {/* Editing Software Dropdown */}
            <div>
              <label className="block text-xs font-medium text-vvm-text mb-1">
                Primary Video Editing Software
              </label>
              <select
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-vvm-border bg-vvm-bg/30 focus:outline-none focus:border-vvm-accent font-sans"
              >
                <option value="DaVinci Resolve">DaVinci Resolve (Studio & Free)</option>
                <option value="Adobe Premiere Pro">Adobe Premiere Pro</option>
                <option value="Final Cut Pro">Final Cut Pro (Apple)</option>
                <option value="After Effects">Adobe After Effects</option>
                <option value="CapCut Pro">CapCut Desktop / Pro</option>
                <option value="Other">Other NLE</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-medium uppercase tracking-wider shadow-elevated transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock 35 Free Assets (1.2 GB)</span>
              <Download className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-vvm-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero cost • Direct Google Drive Access • No spam guarantee</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
