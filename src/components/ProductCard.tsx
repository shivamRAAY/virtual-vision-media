'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, ArrowRight, Check, Sparkles, Clock, Lock } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setQuickViewProduct } = useCart();
  const isUpcoming = Boolean(product.isUpcoming);

  return (
    <div
      className={`group rounded-3xl bg-white border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 relative ${
        isUpcoming
          ? 'border-vvm-border/80 hover:border-amber-400/50 shadow-subtle'
          : 'border-vvm-accent/40 shadow-card hover:shadow-glow ring-2 ring-vvm-accent/20'
      }`}
    >
      
      {/* Top Media Preview */}
      <div>
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-vvm-soft border border-black/5 mb-4 group-hover:shadow-subtle transition-all">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isUpcoming ? 'opacity-90 group-hover:opacity-100 group-hover:scale-102' : 'group-hover:scale-105'
            }`}
          />

          {/* UPCOMING SYMBOL BADGE vs ACTIVE LAUNCH BADGE */}
          {isUpcoming ? (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#121318]/90 text-amber-400 backdrop-blur-md border border-amber-400/40 text-[10px] font-mono font-bold tracking-wider shadow-subtle flex items-center gap-1.5 z-10">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Upcoming</span>
            </div>
          ) : (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white backdrop-blur-md border border-emerald-400/40 text-[10px] font-mono font-bold tracking-wider shadow-subtle flex items-center gap-1.5 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Active Release • ₹49</span>
            </div>
          )}

          {/* Quick View Button on Hover */}
          <button
            onClick={() => setQuickViewProduct(product)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-vvm-text backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-subtle z-10"
            title="Quick Inspect"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Category & Stats */}
        <div className="flex items-center justify-between text-[11px] font-mono text-vvm-muted mb-2">
          <span className="uppercase tracking-wider font-semibold text-vvm-accent">
            {product.category}
          </span>
          <span>{product.assetsCount} • {product.fileSize}</span>
        </div>

        {/* Title & Subtitle */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-vvm-text tracking-tight group-hover:text-vvm-accent transition-colors leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-vvm-muted mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </Link>

        {/* Software Compatibility Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-vvm-border/60">
          {product.softwareCompatibility.slice(0, 3).map((soft) => (
            <span
              key={soft}
              className="px-2 py-0.5 rounded-md bg-vvm-soft/70 text-[10px] font-mono text-vvm-muted"
            >
              {soft}
            </span>
          ))}
          {product.softwareCompatibility.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-vvm-soft/70 text-[10px] font-mono text-vvm-muted">
              +{product.softwareCompatibility.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Pricing & CTA */}
      <div className="mt-5 pt-4 border-t border-vvm-border flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-mono font-bold ${isUpcoming ? 'text-base text-vvm-muted' : 'text-xl text-vvm-text'}`}>
              {product.price === 0 ? 'FREE' : `₹${product.price.toLocaleString('en-IN')}`}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono text-vvm-muted line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {isUpcoming ? (
            <span className="text-[10px] font-mono text-amber-600 font-semibold flex items-center gap-1">
              <span>● Upcoming Release</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
              <span>✓ Ready for Instant Download</span>
            </span>
          )}
        </div>

        {/* Action Button: Disabled "Upcoming" vs Active "Add • ₹49" */}
        {isUpcoming ? (
          <button
            type="button"
            disabled
            className="px-3.5 py-2.5 rounded-xl bg-zinc-100 text-zinc-400 border border-zinc-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-not-allowed select-none shadow-none"
            title="This pack is upcoming. All assets are included in the active 100GB Master Vault!"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Upcoming</span>
          </button>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="px-5 py-2.5 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-elevated transition-all flex items-center gap-2 group-hover:bg-vvm-accent cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add • ₹49</span>
          </button>
        )}
      </div>

    </div>
  );
};
