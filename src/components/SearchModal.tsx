'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>(PRODUCTS);

  // Keyboard shortcut listener (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(PRODUCTS);
      return;
    }

    const q = query.toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.format.toLowerCase().includes(q) ||
        p.softwareCompatibility.some((soft) => soft.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-vvm-border overflow-hidden z-10 animate-fadeIn">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-vvm-border flex items-center gap-3">
          <Search className="w-5 h-5 text-vvm-muted ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search assets by keyword, software (Premiere, DaVinci), format (.CUBE, WAV)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-vvm-text placeholder:text-vvm-muted/70 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-vvm-muted hover:text-vvm-text font-mono"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full hover:bg-vvm-soft text-vvm-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-6 py-2.5 bg-vvm-bg/60 border-b border-vvm-border flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-vvm-muted">
          <span>Suggestions:</span>
          {['100GB Vault', 'LUTs', 'Sound Effects', 'ProRes', 'DaVinci', 'Premiere'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-vvm-soft border border-vvm-border/80 text-vvm-text transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-vvm-border/60">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-vvm-muted font-mono">
              No creative assets found matching &quot;{query}&quot;. Try searching for &quot;LUTs&quot; or &quot;SFX&quot;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="py-3 px-3 hover:bg-vvm-bg/50 rounded-2xl transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-vvm-soft overflow-hidden flex-shrink-0 border border-black/5">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-sm font-bold text-vvm-text group-hover:text-vvm-accent transition-colors block truncate"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted mt-0.5">
                      <span>{product.assetsCount}</span>
                      <span>•</span>
                      <span>{product.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-vvm-text">
                    {product.price === 0 ? 'FREE' : `₹${product.price.toLocaleString('en-IN')}`}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(product);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-vvm-text text-white text-xs font-medium hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-2.5 bg-vvm-bg border-t border-vvm-border flex items-center justify-between text-[11px] font-mono text-vvm-muted">
          <span>{results.length} assets indexed in the VVM catalog</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
};
