'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Check,
  Folder,
  ShieldCheck,
  Download,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  MonitorCheck,
  ChevronRight,
  Clock
} from 'lucide-react';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const product = PRODUCTS.find((p) => p.id === productId);

  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'specs' | 'installation' | 'license'>('specs');
  const [selectedSoftwareTab, setSelectedSoftwareTab] = useState('DaVinci Resolve');

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold text-vvm-text">Product Not Found</h2>
        <p className="text-xs text-vvm-muted mt-2">The requested creative pack does not exist in the vault.</p>
        <Link href="/store" className="mt-4 inline-block px-4 py-2 bg-vvm-text text-white text-xs rounded-xl">
          Return to Store
        </Link>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-vvm-muted">
          <Link href="/" className="hover:text-vvm-text transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/store" className="hover:text-vvm-text transition-colors">Store</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-vvm-text font-semibold capitalize">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-vvm-muted truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Hero Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Media Preview Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-white border border-vvm-border shadow-card">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {product.isUpcoming ? (
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#121318]/90 text-amber-400 backdrop-blur-md border border-amber-400/50 text-xs font-mono font-bold tracking-wider shadow-subtle flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upcoming Release</span>
                </div>
              ) : product.badge ? (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-xs font-mono font-bold text-vvm-text shadow-subtle">
                  {product.badge}
                </div>
              ) : null}
            </div>

            {/* Micro specs grid below media */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-white rounded-2xl border border-vvm-border">
                <div className="text-[10px] text-vvm-muted uppercase">Uncompressed</div>
                <div className="font-bold text-vvm-text mt-0.5">{product.fileSize}</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-vvm-border">
                <div className="text-[10px] text-vvm-muted uppercase">Assets</div>
                <div className="font-bold text-vvm-text mt-0.5">{product.assetsCount}</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-vvm-border">
                <div className="text-[10px] text-vvm-muted uppercase">Format</div>
                <div className="font-bold text-vvm-text mt-0.5 truncate">{product.format.split(',')[0]}</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-vvm-border">
                <div className="text-[10px] text-vvm-muted uppercase">License</div>
                <div className="font-bold text-emerald-600 mt-0.5">Commercial</div>
              </div>
            </div>
          </div>

          {/* Product Purchase Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-vvm-border p-6 sm:p-8 shadow-card space-y-6">
            
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-vvm-soft text-vvm-accent font-mono text-xs font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-vvm-text tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-vvm-muted mt-2 leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Pricing Area */}
            <div className="p-4 rounded-2xl bg-vvm-bg/60 border border-vvm-border space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-vvm-text">
                  {product.price === 0 ? 'FREE' : `₹${product.price.toLocaleString('en-IN')}`}
                </span>
                {product.originalPrice && (
                  <span className="text-base font-mono text-vvm-muted line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-vvm-muted">
                Price inclusive of GST • Instant download token generated immediately after payment
              </p>
            </div>

            {/* Action Buttons */}
            {product.isUpcoming ? (
              <div className="space-y-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Standalone Pack Upcoming</span>
                </div>
                <p className="text-xs text-vvm-muted leading-relaxed">
                  This standalone pack is coming soon. <strong>However, all {product.assetsCount} from this collection are already included inside the 100GB Master Video Editor Vault!</strong>
                </p>
                <button
                  onClick={() => addToCart(PRODUCTS[0])}
                  className="w-full py-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-widest shadow-elevated transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-vvm-accentSubtle" />
                  <span>Get in 100GB Master Vault (₹49 Only)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-4 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-widest shadow-elevated transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ₹{product.price.toLocaleString('en-IN')}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-vvm-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Digital Download • Razorpay 256-bit Secured</span>
                </div>
              </div>
            )}

            {/* Software Compatibility List */}
            <div className="pt-4 border-t border-vvm-border/80 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-vvm-muted">
                Supported Editing Environments
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.softwareCompatibility.map((soft) => (
                  <span
                    key={soft}
                    className="px-2.5 py-1 rounded-lg bg-vvm-soft text-xs font-mono text-vvm-text"
                  >
                    {soft}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-3xl border border-vvm-border p-6 sm:p-10 shadow-card space-y-8">
          
          {/* Tabs Nav */}
          <div className="flex items-center gap-3 border-b border-vvm-border pb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 px-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'specs'
                  ? 'border-vvm-accent text-vvm-text'
                  : 'border-transparent text-vvm-muted hover:text-vvm-text'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('installation')}
              className={`pb-2 px-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'installation'
                  ? 'border-vvm-accent text-vvm-text'
                  : 'border-transparent text-vvm-muted hover:text-vvm-text'
              }`}
            >
              Installation Instructions
            </button>
            <button
              onClick={() => setActiveTab('license')}
              className={`pb-2 px-1 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'license'
                  ? 'border-vvm-accent text-vvm-text'
                  : 'border-transparent text-vvm-muted hover:text-vvm-text'
              }`}
            >
              Commercial License Terms
            </button>
          </div>

          {/* Tab 1: Technical Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-vvm-text mb-2">Detailed Architecture</h3>
                <p className="text-xs text-vvm-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {product.detailedSpecs.resolution && (
                  <div className="p-4 rounded-xl bg-vvm-soft/50 border border-vvm-border">
                    <span className="text-vvm-muted block text-[10px] uppercase">Master Resolution</span>
                    <span className="text-vvm-text font-bold">{product.detailedSpecs.resolution}</span>
                  </div>
                )}
                {product.detailedSpecs.colorSpace && (
                  <div className="p-4 rounded-xl bg-vvm-soft/50 border border-vvm-border">
                    <span className="text-vvm-muted block text-[10px] uppercase">Color Space Science</span>
                    <span className="text-vvm-text font-bold">{product.detailedSpecs.colorSpace}</span>
                  </div>
                )}
                {product.detailedSpecs.sampleRate && (
                  <div className="p-4 rounded-xl bg-vvm-soft/50 border border-vvm-border">
                    <span className="text-vvm-muted block text-[10px] uppercase">Audio Sampling Precision</span>
                    <span className="text-vvm-text font-bold">{product.detailedSpecs.sampleRate}</span>
                  </div>
                )}
                {product.detailedSpecs.compression && (
                  <div className="p-4 rounded-xl bg-vvm-soft/50 border border-vvm-border">
                    <span className="text-vvm-muted block text-[10px] uppercase">Codec & Container</span>
                    <span className="text-vvm-text font-bold">{product.detailedSpecs.compression}</span>
                  </div>
                )}
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-vvm-muted">
                  Verified Asset Manifest
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-vvm-text">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Installation */}
          {activeTab === 'installation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-vvm-text mb-2">NLE Setup Guide</h3>
                <p className="text-xs text-vvm-muted">
                  Step-by-step instructions for incorporating these master files into your favorite editing timeline.
                </p>
              </div>

              <div className="flex gap-2">
                {['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro'].map((soft) => (
                  <button
                    key={soft}
                    onClick={() => setSelectedSoftwareTab(soft)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                      selectedSoftwareTab === soft
                        ? 'bg-vvm-text text-white font-semibold'
                        : 'bg-vvm-soft text-vvm-muted hover:text-vvm-text'
                    }`}
                  >
                    {soft}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-vvm-soft/40 border border-vvm-border text-xs leading-relaxed space-y-3">
                {selectedSoftwareTab === 'DaVinci Resolve' && (
                  <>
                    <p className="font-semibold text-vvm-text">For DaVinci Resolve Studio & Free:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-vvm-muted">
                      <li>Open DaVinci Resolve Project Settings &gt; Color Management.</li>
                      <li>Click &quot;Open LUT Folder&quot; and copy the extracted VVM LUT folder.</li>
                      <li>Click &quot;Update Lists&quot; inside DaVinci Resolve to refresh the LUT browser.</li>
                      <li>For ProRes transitions & grain overlays, drag directly into your Media Pool and place on video track 2 with blend mode Screen or Normal.</li>
                    </ol>
                  </>
                )}
                {selectedSoftwareTab === 'Premiere Pro' && (
                  <>
                    <p className="font-semibold text-vvm-text">For Adobe Premiere Pro CC:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-vvm-muted">
                      <li>Select your video clip on the timeline and open the Lumetri Color panel.</li>
                      <li>Under &quot;Creative&quot; section, click the Look dropdown and choose &quot;Browse...&quot;.</li>
                      <li>Select any VVM .CUBE 3D file.</li>
                      <li>For .MOGRT kinetic titles, open Essential Graphics &gt; Install Motion Graphics Template.</li>
                    </ol>
                  </>
                )}
                {selectedSoftwareTab === 'Final Cut Pro' && (
                  <>
                    <p className="font-semibold text-vvm-text">For Apple Final Cut Pro X:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-vvm-muted">
                      <li>Open the Effects Browser &gt; Color &gt; Custom LUT.</li>
                      <li>Drag the Custom LUT effect onto your clip.</li>
                      <li>In the Inspector, select the LUT dropdown &gt; Choose Custom LUT &gt; select VVM .CUBE.</li>
                      <li>Audio WAV files can be dragged directly into the secondary storyline.</li>
                    </ol>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: License */}
          {activeTab === 'license' && (
            <div className="space-y-4 text-xs text-vvm-muted leading-relaxed">
              <h3 className="text-lg font-bold text-vvm-text">Lifetime Commercial License Agreement</h3>
              <p>
                Every purchase made on Virtual Vision Media grants the customer a worldwide, perpetual, non-exclusive, royalty-free commercial license.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="font-bold block mb-1">✓ What is Allowed:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Unlimited commercial client projects and advertisements</li>
                    <li>Monetized YouTube, TikTok, and social media channels</li>
                    <li>Theatrical feature films, documentary broadcasts, and streaming OTT</li>
                    <li>Personal portfolio edits and creative reels</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <span className="font-bold block mb-1">✗ What is Prohibited:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Re-selling, sublicensing, or redistributing the raw asset files</li>
                    <li>Uploading to public torrent repositories or shared cloud drives</li>
                    <li>Including raw files in open template distribution without embedding</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Related Products */}
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-bold text-vvm-text">Complementary Creative Packs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
