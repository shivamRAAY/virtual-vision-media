'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Share2,
  X,
  Copy,
  CheckCheck,
  Send,
  ExternalLink,
  Sparkles,
  Smartphone,
  Eye,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const SharePreviewModal: React.FC = () => {
  const { isShareOpen, setIsShareOpen } = useCart();
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'whatsapp' | 'telegram' | 'instagram'>('whatsapp');

  if (!isShareOpen) return null;

  const handleClose = () => setIsShareOpen(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://virtualvisionmedia.com';
  const shareTitle = '150+ Folders | 100GB+ Master Video Editor Assets Vault (₹49 Only)';
  const shareText = `🔥 Get 100GB+ of Master Video Editing Assets for just ₹49! Universal .CUBE LUTs, ProRes 422 transitions, 96kHz SFX & 4K overlays. Instant delivery:\n${currentUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('🔥 150+ Folders of 100GB+ Master Video Editor Assets for ₹49 Only!')}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-vvm-border overflow-hidden z-10 animate-fadeIn text-vvm-text">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-vvm-border flex items-center justify-between bg-vvm-bg/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-vvm-text text-white flex items-center justify-center shadow-subtle">
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-vvm-text">
                Social Link Preview &amp; Share
              </h3>
              <p className="text-xs text-vvm-muted font-mono">
                Live OpenGraph card for WhatsApp, Instagram &amp; Telegram
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-vvm-muted hover:text-vvm-text hover:bg-vvm-soft transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-6">

          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vvm-soft border border-vvm-border text-xs font-mono">
            <button
              onClick={() => setActivePlatform('whatsapp')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'whatsapp'
                  ? 'bg-white text-emerald-600 shadow-subtle font-bold'
                  : 'text-vvm-muted hover:text-vvm-text'
              }`}
            >
              <span>WhatsApp Preview</span>
            </button>
            <button
              onClick={() => setActivePlatform('telegram')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'telegram'
                  ? 'bg-white text-sky-600 shadow-subtle font-bold'
                  : 'text-vvm-muted hover:text-vvm-text'
              }`}
            >
              <span>Telegram Preview</span>
            </button>
            <button
              onClick={() => setActivePlatform('instagram')}
              className={`flex-1 py-2 px-3 rounded-xl transition-all font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                activePlatform === 'instagram'
                  ? 'bg-white text-pink-600 shadow-subtle font-bold'
                  : 'text-vvm-muted hover:text-vvm-text'
              }`}
            >
              <span>Instagram / iMessage</span>
            </button>
          </div>

          {/* REALISTIC SOCIAL CHAT PREVIEW CONTAINER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#ECE5DD] border border-[#d1c7bc] space-y-2 shadow-inner">
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider flex items-center justify-between pb-1">
              <span>{activePlatform.toUpperCase()} BUBBLE SIMULATOR</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Rich Preview
              </span>
            </div>

            {/* Chat Message Bubble */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-black/5 max-w-sm ml-auto">
              
              {/* Poster Image Preview */}
              <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden group">
                <Image
                  src="/og-image.jpg"
                  alt="Virtual Vision Media Master Vault Poster"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-[10px] font-mono font-bold uppercase tracking-wider">
                    ₹49 Limited Vault
                  </span>
                </div>
              </div>

              {/* Title & Snippet */}
              <div className="p-3.5 space-y-1 bg-white">
                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wide truncate">
                  virtualvisionmedia.com
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  150+ Folders | 100GB+ Master Video Editor Assets Vault
                </h4>
                <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                  Universal .CUBE LUTs, ProRes 422 transitions, 96kHz broadcast sound effects &amp; 4K overlays.
                </p>
                <div className="text-[10px] text-blue-600 font-mono pt-1">
                  https://virtualvisionmedia.com
                </div>
              </div>

            </div>

            <div className="text-right text-[10px] text-gray-500 font-mono pt-1">
              Sent just now • Read ✓✓
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
              >
                <span>Share on WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              {/* Telegram Button */}
              <button
                type="button"
                onClick={handleTelegramShare}
                className="py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1f8ec3] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
              >
                <span>Share on Telegram</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-4 rounded-xl bg-vvm-soft hover:bg-vvm-silver/40 border border-vvm-border text-vvm-text text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-vvm-muted" />
                    <span>Copy Share Link &amp; Text</span>
                  </>
                )}
              </button>

              {/* Twitter Button */}
              <button
                type="button"
                onClick={handleTwitterShare}
                className="py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
              >
                <span>Post on X / Twitter</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] font-mono text-center text-vvm-muted">
            The poster, headline, and ₹49 badge automatically attach whenever anyone sends this link across all messaging apps.
          </p>

        </div>

      </div>
    </div>
  );
};
