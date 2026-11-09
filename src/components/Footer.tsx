'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Mail, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide Footer completely on private admin terminal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-vvm-border pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-vvm-border">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/vvm-logo.png"
                  alt="VVM Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold tracking-tight text-sm text-vvm-text">
                  VIRTUAL VISION MEDIA
                </span>
                <p className="text-[10px] font-mono tracking-widest uppercase text-vvm-muted">
                  Create Beyond Limits
                </p>
              </div>
            </div>

            <p className="text-xs text-vvm-muted max-w-sm leading-relaxed">
              Engineering ultra-premium digital assets, LUT profiles, optical film textures, and surgical sound design for professional filmmakers, editors, and modern digital creators worldwide.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-mono font-medium text-vvm-text block mb-2">
                Join the Creator Dispatch (Free weekly LUTs & SFX drops)
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You&apos;re subscribed to the weekly drop dispatch!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter creator email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-vvm-border bg-vvm-bg/30 focus:outline-none focus:border-vvm-accent font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-vvm-text hover:bg-black text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Col 1: Store & Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text">
              Store & Categories
            </h4>
            <ul className="space-y-2 text-xs text-vvm-muted font-sans">
              <li>
                <Link href="/store" className="hover:text-vvm-text transition-colors">
                  100GB Master Vault
                </Link>
              </li>
              <li>
                <Link href="/store?category=luts" className="hover:text-vvm-text transition-colors">
                  LUTs & Color Grading
                </Link>
              </li>
              <li>
                <Link href="/store?category=transitions" className="hover:text-vvm-text transition-colors">
                  ProRes Transitions
                </Link>
              </li>
              <li>
                <Link href="/store?category=sfx" className="hover:text-vvm-text transition-colors">
                  96kHz Sound Effects
                </Link>
              </li>
              <li>
                <Link href="/store?category=overlays" className="hover:text-vvm-text transition-colors">
                  35mm Film Grain & Burns
                </Link>
              </li>
              <li>
                <Link href="/store?category=titles" className="hover:text-vvm-text transition-colors">
                  Kinetic Typography
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Guides & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text">
              Documentation & Guides
            </h4>
            <ul className="space-y-2 text-xs text-vvm-muted font-sans">
              <li>
                <Link href="/#why-vvm" className="hover:text-vvm-text transition-colors">
                  DaVinci Resolve Installation Guide
                </Link>
              </li>
              <li>
                <Link href="/#why-vvm" className="hover:text-vvm-text transition-colors">
                  Premiere Pro MOGRT Setup
                </Link>
              </li>
              <li>
                <Link href="/#why-vvm" className="hover:text-vvm-text transition-colors">
                  Universal .CUBE 3D Compatibility
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-vvm-text transition-colors">
                  My Downloads & Invoices
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-vvm-text transition-colors">
                  Admin Management Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-vvm-text">
              Licensing & Legal
            </h4>
            <ul className="space-y-2 text-xs text-vvm-muted font-sans">
              <li>
                <span className="text-vvm-text font-medium">Commercial License:</span> Lifetime Royalty-Free
              </li>
              <li>
                <span className="text-vvm-text font-medium">Payment Gateway:</span> Razorpay (INR ₹)
              </li>
              <li>
                <span className="text-vvm-text font-medium">Refund Policy:</span> 14-Day Defect Guarantee
              </li>
              <li>
                <span className="text-vvm-text font-medium">Digital Delivery:</span> Instant Tokenized Link
              </li>
              <li>
                <span className="text-vvm-text font-medium">Support:</span>{' '}
                <a href="mailto:virtualvisionmed@gmail.com" className="hover:text-vvm-accent transition-colors underline">
                  virtualvisionmed@gmail.com
                </a>
              </li>
              <li>
                <span className="text-vvm-text font-medium">Instagram:</span>{' '}
                <a
                  href="https://www.instagram.com/virtualvision.media?cplk=YnY1c3pkOW13anVr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors underline font-semibold"
                >
                  @virtualvision.media
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-vvm-muted">
          <div>
            © {new Date().getFullYear()} Virtual Vision Media (VVM). All rights reserved. Built for creators.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-vvm-text">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Razorpay Server Secured • Currency: INR (₹)</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
