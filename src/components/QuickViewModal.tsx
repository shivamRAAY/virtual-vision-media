'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, ShoppingBag, Folder, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();

  if (!quickViewProduct) return null;

  const isUpcoming = Boolean(quickViewProduct.isUpcoming);
  const masterBundle = PRODUCTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-vvm-border overflow-hidden z-10 animate-fadeIn">
        
        {/* Header Preview Banner */}
        <div className="relative h-64 bg-vvm-soft border-b border-vvm-border overflow-hidden">
          <Image
            src={quickViewProduct.image}
            alt={quickViewProduct.title}
            fill
            className="object-cover"
          />
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-vvm-text shadow-subtle z-10"
          >
            <X className="w-4 h-4" />
          </button>
          {isUpcoming ? (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-[#121318]/90 text-amber-400 backdrop-blur-md border border-amber-400/40 text-xs font-mono font-bold tracking-wider shadow-subtle flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming</span>
            </div>
          ) : quickViewProduct.badge ? (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white backdrop-blur-md text-xs font-mono font-bold shadow-subtle flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{quickViewProduct.badge}</span>
            </div>
          ) : null}
        </div>

        {/* Details Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-vvm-accent font-semibold mb-1">
              {quickViewProduct.category} • {quickViewProduct.assetsCount} ({quickViewProduct.fileSize})
            </div>
            <h3 className="text-2xl font-bold text-vvm-text tracking-tight">
              {quickViewProduct.title}
            </h3>
            <p className="text-xs text-vvm-muted mt-2 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-vvm-muted">
              Included In This Master Archive
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {quickViewProduct.features.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-vvm-text">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Software Support */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-vvm-muted mb-2">
              Verified Compatibility
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {quickViewProduct.softwareCompatibility.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-vvm-soft text-xs font-mono text-vvm-text border border-vvm-border/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-vvm-border flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-vvm-muted font-mono">Instant Digital Access</div>
              <div className="text-2xl font-bold text-vvm-text font-mono">
                {quickViewProduct.price === 0 ? 'FREE' : `₹${quickViewProduct.price.toLocaleString('en-IN')}`}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/product/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="px-4 py-3 rounded-xl border border-vvm-border text-vvm-text hover:bg-vvm-soft text-xs font-mono font-medium transition-colors"
              >
                Inspect
              </Link>
              {isUpcoming ? (
                <button
                  onClick={() => {
                    addToCart(masterBundle);
                    setQuickViewProduct(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center gap-2 transition-colors cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-vvm-accentSubtle" />
                  <span>Unlock in 100GB Vault (₹49)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated flex items-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ₹49</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
