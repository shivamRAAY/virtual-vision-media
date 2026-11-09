'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ArrowRight, Play, Sparkles, Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, setIsFreebiesOpen, setIsIntroOpen, setIsShareOpen } = useCart();

  // Hide Navbar completely on private admin terminal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Store', href: '/store' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Freebies', href: '#freebies', onClick: () => setIsFreebiesOpen(true) },
    { name: '3D Intro', href: '#intro', onClick: () => setIsIntroOpen(true) },
    { name: 'Vault Specs', href: '/#bundle-showcase' },
    { name: 'Why VVM', href: '/#why-vvm' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-black/5 shadow-subtle py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: VVM Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/vvm-logo.png"
                alt="Virtual Vision Media Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-vvm-text group-hover:text-vvm-accent transition-colors">
                VIRTUAL VISION MEDIA
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-vvm-muted -mt-0.5">
                Create Beyond Limits
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Apple-style pill) */}
          <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/5 shadow-subtle">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.onClick) {
                return (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="px-3.5 py-1 text-xs font-medium text-vvm-muted hover:text-vvm-text hover:bg-vvm-soft/50 rounded-full transition-all"
                  >
                    {link.name}
                  </button>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                    isActive
                      ? 'text-vvm-text bg-white shadow-subtle font-semibold'
                      : 'text-vvm-muted hover:text-vvm-text hover:bg-vvm-soft/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Share, Cart & Primary CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Social Share Preview Modal trigger */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 rounded-full text-vvm-muted hover:text-vvm-text hover:bg-white/80 transition-all border border-transparent hover:border-black/5"
              title="Share Poster & Link (WhatsApp, Telegram, IG)"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
            </button>

            {/* Quick Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-vvm-muted hover:text-vvm-text hover:bg-white/80 transition-all border border-transparent hover:border-black/5"
              title="Search Assets (Cmd + K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-vvm-text hover:bg-white/80 transition-all border border-transparent hover:border-black/5"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-vvm-accent text-white text-[10px] font-mono font-bold flex items-center justify-center animate-fadeIn shadow-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary CTA */}
            <Link
              href="/store"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-vvm-text hover:bg-black text-white shadow-subtle hover:shadow-card transition-all"
            >
              <span>Explore Store</span>
              <ArrowRight className="w-3.5 h-3.5 text-vvm-silver" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-vvm-text hover:bg-white/80"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-white/95 backdrop-blur-xl border-b border-vvm-border mt-2 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.onClick ? (
                  <button
                    onClick={() => {
                      link.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-vvm-text hover:bg-vvm-soft rounded-lg"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-vvm-text hover:bg-vvm-soft rounded-lg"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-vvm-border flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsShareOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium flex items-center justify-center gap-2 border border-purple-200 transition-colors"
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span>Share Website Poster</span>
              </button>

              <Link
                href="/store"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-vvm-text text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Explore Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
