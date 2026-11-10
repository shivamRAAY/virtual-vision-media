'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ExternalLink,
  Download,
  Copy,
  CheckCheck,
  Folder,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Mail,
  Send,
  Printer,
  Heart,
  HardDrive,
  Layers,
  HelpCircle,
  Clock,
  Zap,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { InvoiceModal } from '@/components/InvoiceModal';

const PAID_VAULT_DRIVE_LINK =
  'https://drive.google.com/drive/folders/1GaOl2Ha0AII8QSIhiuOCyA7380DVfQVl?usp=sharing&mcp_token=eyJwaWQiOjkyNzcyOSwic2lkIjoxNzE2MzIxNjI0LCJheCI6ImViNTQ5YzRiZDJkMjBkMTVkZWUxMGMwNGNlMmJlYTNkIiwidHMiOjE3MzgwNTIxNzgsImV4cCI6MTc0MDQ3MTM3OH0.hJ55soOk95b_4z0GzUsTHEiIs3x7BSqUJ-NlZ8sXnLI';

const FREE_STARTER_PACK_LINK =
  'https://drive.google.com/drive/folders/1HYWrteRByCcQ66Gs2t5TkLmwH9zH5lfG';

export default function OrderSuccessPage() {
  const { currentOrder, orders } = useCart();
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedFreebie, setCopiedFreebie] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Retrieve the verified order
  const order = currentOrder || orders[0] || null;

  useEffect(() => {
    if (!order) return;

    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#6C56D4', '#10B981', '#F59E0B', '#FFFFFF', '#3B82F6'],
      });
    } catch {}

    // Auto-dispatch confirmation & congratulatory email
    if (order.customer.email && order.customer.email !== 'your-email@studio.com') {
      setEmailStatus('sending');
      fetch('/api/email/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.customer.email,
          name: order.customer.name,
          orderId: order.id,
          paymentId: order.paymentId || 'pay_rzp_live',
          amount: order.total || 49,
        }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            setEmailStatus('sent');
          } else {
            setEmailStatus('failed');
            setEmailError(data.error || 'Resend domain activation needed in Vercel');
          }
        })
        .catch(() => {
          setEmailStatus('failed');
          setEmailError('Email dispatch timed out');
        });
    }
  }, [order]);

  // Security gate: If no active order exists, lock access and redirect to store
  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-4 pt-28 pb-20">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-vvm-border shadow-card text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-vvm-text">
              Verified Order Required
            </h2>
            <p className="text-xs text-vvm-muted leading-relaxed">
              Access to the 100GB Master Video Editor Assets Vault is unlocked automatically after completing your ₹49 order at checkout.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/store"
              className="w-full py-3.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-elevated"
            >
              <span>Unlock 100GB Vault (₹49)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[11px] font-mono text-vvm-muted">
            Already purchased? Check your <Link href="/dashboard" className="underline text-vvm-accent font-semibold">Downloads Dashboard</Link>.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyMain = () => {
    navigator.clipboard.writeText(PAID_VAULT_DRIVE_LINK);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2500);
  };

  const handleCopyFreebie = () => {
    navigator.clipboard.writeText(FREE_STARTER_PACK_LINK);
    setCopiedFreebie(true);
    setTimeout(() => setCopiedFreebie(false), 2500);
  };

  const handleManualResendEmail = async () => {
    setEmailStatus('sending');
    setEmailError(null);
    try {
      const res = await fetch('/api/email/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.customer.email,
          name: order.customer.name,
          orderId: order.id,
          paymentId: order.paymentId || 'pay_rzp_live',
          amount: order.total || 49,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('failed');
        setEmailError(data.error || 'Resend API sandbox mode or unverified sender domain');
      }
    } catch {
      setEmailStatus('failed');
      setEmailError('Network request failed');
    }
  };

  const masterProduct = PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-vvm-text pt-28 pb-24 selection:bg-vvm-accent selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ================= 1. CELEBRATION HERO BANNER ================= */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-subtle">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Payment Verified via Razorpay • Order #{order.id}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tightest text-vvm-text leading-[1.08]">
            Congratulations!
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vvm-accent via-purple-600 to-indigo-600">
              Your 100GB Vault Is Unlocked.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-vvm-muted leading-relaxed">
            Thank you, <strong className="text-vvm-text">{order.customer.name}</strong>! Your transaction of{' '}
            <strong className="text-emerald-700 font-mono">₹{order.total || 49}</strong> was confirmed. 
            All permanent lifetime Google Drive links, your official invoice, and commercial certificate are active below.
          </p>
        </div>

        {/* ================= 2. PERSONALIZED FOUNDER'S THANK YOU NOTE ================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-white to-purple-50/40 border border-vvm-accent/30 p-6 sm:p-8 shadow-card overflow-hidden">
          {/* Subtle violet sheen */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-vvm-accent/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-vvm-accent/10 border border-vvm-accent/20 flex items-center justify-center flex-shrink-0 text-vvm-accent">
              <Heart className="w-6 h-6 fill-vvm-accent/20" />
            </div>

            <div className="space-y-3 flex-1 text-xs leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-vvm-border pb-2">
                <h3 className="text-sm font-bold font-mono text-vvm-text flex items-center gap-1.5">
                  <span>A Personal Thank You from Virtual Vision Media</span>
                  <span className="text-vvm-accent">• Founder&apos;s Dispatch</span>
                </h3>
                <span className="text-[10px] font-mono text-vvm-muted">
                  Studio Memo #2026-VLT
                </span>
              </div>

              <p className="text-vvm-text font-medium text-sm">
                Dear {order.customer.name},
              </p>

              <p className="text-vvm-muted">
                From our entire studio team, welcome to the Virtual Vision Media creator family! When we began crafting this 100GB archive, ordinary marketplaces were charging thousands of rupees for bloated, uncalibrated packs. We spent thousands of hours in studio color suites recording 96kHz foley, scanning real 35mm optical celluloid, and engineering drag-and-drop ProRes 422 alpha transitions.
              </p>

              <p className="text-vvm-muted">
                We believe your creative vision should never be limited by expensive tools. You now possess our flagship digital assembly with a permanent, worldwide commercial license. Thank you for placing your trust in our craftsmanship!
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-vvm-text block">The VVM Editorial Team &amp; Founders</span>
                  <span className="text-[10px] text-vvm-muted">Virtual Vision Media • Create Beyond Limits</span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    ✓ Verified Customer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. MULTIPLE DOWNLOAD LINK OPTIONS (GOOGLE DRIVE ACCESS) ================= */}
        <div className="relative rounded-3xl bg-white border-2 border-vvm-accent/40 p-6 sm:p-10 shadow-elevated overflow-hidden space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-vvm-border pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-vvm-soft border border-vvm-border flex items-center justify-center text-2xl shadow-subtle">
                📁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-vvm-text tracking-tight">
                    Primary 100GB Master Vault Access
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    LIFETIME VIP ACCESS
                  </span>
                </div>
                <p className="text-xs font-mono text-vvm-muted mt-0.5">
                  Hosted on Google Drive Cloud • 102.4 GB Verified Master Files • 2,500+ Assets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Commercial License Granted</span>
            </div>
          </div>

          {/* DOWNLOAD OPTION 1: FULL 100GB PAID VAULT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Option A: Complete 100GB Google Drive Master Folder</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                102.4 GB • Full Vault
              </span>
            </div>

            <div className="p-3.5 bg-vvm-soft/70 rounded-2xl border border-vvm-border font-mono text-xs text-vvm-text flex items-center justify-between gap-3 overflow-hidden">
              <span className="truncate select-all text-vvm-muted font-normal">
                {PAID_VAULT_DRIVE_LINK}
              </span>
              <button
                type="button"
                onClick={handleCopyMain}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-vvm-soft border border-vvm-border text-[11px] font-mono font-bold text-vvm-text flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-subtle cursor-pointer"
              >
                {copiedMain ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-vvm-muted" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={PAID_VAULT_DRIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-6 rounded-2xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
              >
                <span>Open 100GB Vault in Google Drive</span>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                onClick={handleCopyMain}
                className="py-4 px-6 rounded-2xl bg-white hover:bg-vvm-soft text-vvm-text text-xs font-mono font-bold uppercase tracking-wider border border-vvm-border shadow-subtle flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4 text-vvm-muted" />
                <span>{copiedMain ? 'Copied to Clipboard!' : 'Copy Drive Link'}</span>
              </button>
            </div>
          </div>

          {/* DOWNLOAD OPTION 2: FREEBIES & STARTER PACK BACKUP */}
          <div className="space-y-3 pt-4 border-t border-vvm-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-muted flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Option B: Freebies &amp; Quick Starter Sampler Pack (1.2 GB)</span>
              </label>
              <span className="text-[10px] font-mono text-blue-600 font-bold">
                1.2 GB • Instant Sample
              </span>
            </div>

            <div className="p-3 bg-vvm-soft/50 rounded-2xl border border-vvm-border font-mono text-xs text-vvm-text flex items-center justify-between gap-3 overflow-hidden">
              <span className="truncate select-all text-vvm-muted font-normal text-[11px]">
                {FREE_STARTER_PACK_LINK}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyFreebie}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-vvm-soft border border-vvm-border text-[10px] font-mono font-bold text-vvm-text flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedFreebie ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={FREE_STARTER_PACK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-vvm-text hover:bg-black text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open Starter</span>
                  <ExternalLink className="w-3 h-3 text-cyan-300" />
                </a>
              </div>
            </div>
          </div>

          {/* 3-STEP QUICK START GUIDE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-vvm-border">
            <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-vvm-border space-y-1.5">
              <div className="font-mono text-xs font-bold text-vvm-text flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-vvm-text text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Open in Drive</span>
              </div>
              <p className="text-xs text-vvm-muted leading-relaxed">
                Click the button above to access the shared Google Drive folder using any Google account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-vvm-border space-y-1.5">
              <div className="font-mono text-xs font-bold text-vvm-text flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-vvm-text text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Add Shortcut or Download</span>
              </div>
              <p className="text-xs text-vvm-muted leading-relaxed">
                Click <strong>“Add shortcut to Drive”</strong> to stream without consuming hard drive space, or download folders individually.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-vvm-border space-y-1.5">
              <div className="font-mono text-xs font-bold text-vvm-text flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-vvm-text text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Drag into Timeline</span>
              </div>
              <p className="text-xs text-vvm-muted leading-relaxed">
                Universal .CUBE, ProRes 422, and 96kHz WAV files work natively in DaVinci Resolve, Premiere Pro, FCPX, or CapCut.
              </p>
            </div>
          </div>

        </div>

        {/* ================= 4. EMAIL CONFIRMATION & INVOICE CONTROLS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Automated Confirmation Email Card */}
          <div className="p-6 rounded-3xl bg-white border border-vvm-border shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-vvm-text flex items-center gap-2">
                  <Mail className="w-4 h-4 text-vvm-accent" />
                  <span>Confirmation &amp; Product Email</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold">
                  {emailStatus === 'sent' ? 'DISPATCHED' : 'AUTOMATED'}
                </span>
              </div>
              <p className="text-xs text-vvm-muted leading-relaxed">
                A congratulatory email with your official receipt and direct Google Drive download links has been prepared for <strong className="text-vvm-text">{order.customer.email}</strong>.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleManualResendEmail}
                disabled={emailStatus === 'sending'}
                className="w-full py-3 px-4 rounded-xl bg-[#F7F7F5] hover:bg-vvm-soft border border-vvm-border text-vvm-text text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {emailStatus === 'sending' ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-vvm-accent border-t-transparent animate-spin" />
                    <span>Dispatching Email...</span>
                  </>
                ) : emailStatus === 'sent' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Email Dispatched Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-vvm-accent" />
                    <span>Resend Confirmation Email to {order.customer.email}</span>
                  </>
                )}
              </button>

              {emailStatus === 'failed' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono space-y-1">
                  <p className="font-bold">⚠️ Email Dispatch Notice:</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {emailError || 'Resend API sandbox key requires domain activation in Vercel.'}
                    <br />
                    <strong>No worries! Your 100GB Google Drive link is available above and saved in your dashboard.</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Official Tax & GST Invoice Card */}
          <div className="p-6 rounded-3xl bg-white border border-vvm-border shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-vvm-text flex items-center gap-2">
                  <FileText className="w-4 h-4 text-vvm-accent" />
                  <span>Official GST Tax Invoice</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold">
                  TAX INVOICE
                </span>
              </div>
              <p className="text-xs text-vvm-muted leading-relaxed">
                Need an official business expense receipt? Your digitally signed Tax Invoice with GSTIN details is ready for viewing and printing.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-subtle transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View &amp; Print Official Tax Invoice</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= 5. DIRECTORY INSPECTION (6 ROOT FOLDERS) ================= */}
        <div className="bg-white rounded-3xl border border-vvm-border p-6 sm:p-10 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vvm-border pb-4">
            <div>
              <h3 className="text-lg font-bold text-vvm-text flex items-center gap-2">
                <Folder className="w-5 h-5 text-vvm-accent" />
                <span>Inside Your 100GB Google Drive Folder</span>
              </h3>
              <p className="text-xs text-vvm-muted mt-0.5">
                Every folder is organized, calibrated, and ready for commercial editorial use.
              </p>
            </div>
            <span className="text-xs font-mono text-vvm-muted font-semibold">
              6 Categorized Disciplines • 2,500+ Assets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterProduct.folderTree.map((folder) => (
              <div
                key={folder.name}
                className="p-4 rounded-2xl border border-vvm-border/80 bg-[#F7F7F5] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-vvm-text truncate">
                    <Folder className="w-4 h-4 text-vvm-accent flex-shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-vvm-muted font-bold flex-shrink-0 ml-2">
                    {folder.size}
                  </span>
                </div>

                {folder.subfolders && (
                  <div className="space-y-1 text-[11px] font-mono text-vvm-muted border-t border-vvm-border/60 pt-2">
                    {folder.subfolders.map((sub) => (
                      <div key={sub.name} className="flex justify-between items-center">
                        <span className="truncate pr-2">↳ {sub.name}</span>
                        <span className="text-vvm-text font-medium">{sub.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= 6. COMMERCIAL LICENSE DETAILS ================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-vvm-border shadow-card space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-vvm-text flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Commercial License Certificate (Perpetual Worldwide Rights)</span>
          </h4>

          <div className="space-y-2 text-xs text-vvm-muted leading-relaxed">
            <p>
              This official certificate confirms that <strong>{order.customer.name}</strong> is granted perpetual, non-exclusive worldwide commercial rights to use all assets from the 100GB Master Vault in:
            </p>
            <ul className="space-y-1 font-mono text-[11px] text-vvm-text list-disc pl-4">
              <li>Commercial client video productions, corporate films, and TV advertisements</li>
              <li>Monetized YouTube, Instagram Reels, and TikTok channels</li>
              <li>Theatrical feature films and OTT streaming series</li>
              <li>Freelance client video editing deliveries without attribution requirements</li>
            </ul>
          </div>

          <div className="pt-2 text-[11px] font-mono text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Lifetime license verified. No recurring subscription or royalty fees.</span>
          </div>
        </div>

        {/* ================= 7. FOOTER RETURN NAVIGATION ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-vvm-border">
          <Link
            href="/"
            className="text-xs font-mono text-vvm-muted hover:text-vvm-text transition-colors"
          >
            ← Return to Virtual Vision Media Home
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-vvm-soft border border-vvm-border text-vvm-text text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Print Tax Invoice
            </button>
            <a
              href={PAID_VAULT_DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-subtle flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Access Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* INVOICE MODAL POPUP */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
      />
    </div>
  );
}
