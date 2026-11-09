'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, Sparkles, Check } from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ContactCardSection } from '@/components/ContactCardSection';

function StoreContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedSoftware, setSelectedSoftware] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'size'>('featured');

  const softwareList = ['All', 'DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'After Effects', 'CapCut Pro'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Software filter
      if (selectedSoftware !== 'All' && !product.softwareCompatibility.includes(selectedSoftware)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesFormat = product.format.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesFormat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'size') {
        const sizeA = parseFloat(a.fileSize);
        const sizeB = parseFloat(b.fileSize);
        return sizeB - sizeA;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedSoftware, searchQuery, sortBy]);

  return (
    <div className="space-y-10">
      {/* Store Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted">
          <span className="w-2 h-2 rounded-full bg-vvm-accent" />
          <span>Virtual Vision Media • Official Storefront</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-vvm-text">
          Creative Asset Catalog
        </h1>

        <p className="text-sm sm:text-base text-vvm-muted max-w-2xl">
          Explore uncompressed 3D LUTs, seamless ProRes transitions, 96kHz foley stems, and 35mm optical grain overlays. All purchases include lifetime commercial licensing.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-3xl border border-vvm-border p-5 shadow-card space-y-4">
        
        {/* Top row: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-vvm-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by asset title, format, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-vvm-border bg-vvm-bg/40 focus:outline-none focus:border-vvm-accent font-sans"
            />
          </div>

          {/* Sort & Software dropdowns */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Software:</span>
              <select
                value={selectedSoftware}
                onChange={(e) => setSelectedSoftware(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-vvm-border bg-white text-xs font-mono text-vvm-text focus:outline-none focus:border-vvm-accent"
              >
                {softwareList.map((soft) => (
                  <option key={soft} value={soft}>
                    {soft}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-vvm-border bg-white text-xs font-mono text-vvm-text focus:outline-none focus:border-vvm-accent"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="size">Largest File Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom row: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-vvm-border/60 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-vvm-text text-white shadow-subtle font-semibold'
                  : 'bg-vvm-soft/70 text-vvm-muted hover:text-vvm-text hover:bg-vvm-soft'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-xs font-mono text-vvm-muted">
        <span>
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'collection' : 'collections'}
        </span>
        <span>Currency: INR (₹) • Instant Delivery</span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-vvm-border p-8">
          <h3 className="text-base font-bold text-vvm-text">No digital assets match your filter criteria</h3>
          <p className="text-xs text-vvm-muted mt-1 mb-4">
            Try resetting your search query or selecting &quot;All Products&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSoftware('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-vvm-text text-white text-xs font-mono font-medium"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={
          <div className="py-32 text-center text-xs font-mono text-vvm-muted">
            Loading Creative Vault Catalog...
          </div>
        }>
          <StoreContent />
        </Suspense>
      </div>

      {/* 21st.dev Style Interactive Contact Card */}
      <ContactCardSection />
    </div>
  );
}
