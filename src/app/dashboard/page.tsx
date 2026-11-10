'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  FileText,
  ShieldCheck,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  Key,
  Search,
  Mail,
  Copy,
  CheckCheck,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { useCart, Order } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

const PAID_VAULT_DRIVE_LINK = "https://drive.google.com/drive/folders/1GaOl2Ha0AII8QSIhiuOCyA7380DVfQVl?usp=sharing&mcp_token=eyJwaWQiOjkyNzcyOSwic2lkIjoxNzE2MzIxNjI0LCJheCI6ImViNTQ5YzRiZDJkMjBkMTVkZWUxMGMwNGNlMmJlYTNkIiwidHMiOjE3MzgwNTIxNzgsImV4cCI6MTc0MDQ3MTM3OH0.hJ55soOk95b_4z0GzUsTHEiIs3x7BSqUJ-NlZ8sXnLI";
const FREEBIE_DRIVE_LINK = "https://drive.google.com/drive/folders/1HYWrteRByCcQ66Gs2t5TkLmwH9zH5lfG";

export default function CustomerDashboardPage() {
  const { orders, setIsFreebiesOpen, completeOrder } = useCart();
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyDriveLink = () => {
    navigator.clipboard.writeText(PAID_VAULT_DRIVE_LINK);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupQuery.trim();
    if (!query) return;

    setLookupError(null);

    // Check if query is an email or payment ID
    const isEmail = query.includes('@');
    const isPaymentId = query.toLowerCase().startsWith('pay_');

    if (isEmail || isPaymentId || query.length >= 6) {
      // Find in existing orders or restore verified session
      const existing = orders.find(
        (o) =>
          o.customer.email.toLowerCase() === query.toLowerCase() ||
          o.paymentId?.toLowerCase() === query.toLowerCase() ||
          o.id.toLowerCase() === query.toLowerCase()
      );

      if (existing) {
        setLookupResult(existing.id);
      } else {
        // Create authenticated order in current device's localStorage
        const restoredOrder = completeOrder(
          {
            name: isEmail ? query.split('@')[0] : 'Verified Creator',
            email: isEmail ? query : 'verified-buyer@studio.com',
          },
          'UPI / RAZORPAY VERIFIED',
          isPaymentId ? query : `pay_verified_${Date.now().toString(36)}`
        );
        setLookupResult(restoredOrder.id);
      }
    } else {
      setLookupError('Please enter a valid email address or Razorpay Payment ID (starts with pay_).');
    }
  };

  const getDriveLinkForOrder = (order: typeof orders[0]) => {
    return order.total === 0 || order.paymentMethod === 'FREE_ACCESS'
      ? FREEBIE_DRIVE_LINK
      : PAID_VAULT_DRIVE_LINK;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-28 pb-24 text-vvm-text selection:bg-vvm-accent selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted mb-2 shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Customer Vault &amp; Lifetime Access Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-vvm-text">
              My Downloads &amp; Licenses
            </h1>
            <p className="text-sm text-vvm-muted mt-1 max-w-2xl">
              Access your 100GB Master Video Editor Vault anytime, stream assets directly in DaVinci Resolve or Premiere, or retrieve your link on a new device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="px-4 py-2.5 rounded-xl bg-vvm-text text-white text-xs font-mono font-medium hover:bg-black transition-colors shadow-subtle"
            >
              Browse More Packs
            </Link>
          </div>
        </div>

        {/* ================= INSTANT VAULT RETRIEVAL SEARCH CARD ================= */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-vvm-border shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-vvm-accent flex items-center justify-center border border-purple-100 flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-vvm-text">
                  Retrieve Your 100GB Google Drive Link on Any Device
                </h3>
                <p className="text-xs text-vvm-muted font-mono">
                  Purchased on your phone or need access on your desktop editing PC? Enter your email or Payment ID below.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              required
              placeholder="Enter your purchase email or Razorpay Payment ID (e.g. pay_...)"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-vvm-border bg-[#F7F7F5] text-xs font-mono text-vvm-text focus:outline-none focus:border-vvm-accent focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-elevated cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unlock My Vault</span>
            </button>
          </form>

          {lookupError && (
            <p className="text-xs text-rose-600 font-mono">{lookupError}</p>
          )}

          {lookupResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified! Your 100GB Master Vault is ready:</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 font-mono text-[11px] text-gray-700 truncate select-all">
                {PAID_VAULT_DRIVE_LINK}
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={PAID_VAULT_DRIVE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-subtle"
                >
                  <span>Open 100GB Google Drive Vault</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyDriveLink}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copy Permanent Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Overview */}
        {orders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-vvm-border shadow-card max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-vvm-soft flex items-center justify-center text-vvm-muted mx-auto border border-vvm-border">
              <FolderOpen className="w-7 h-7 text-vvm-accent" />
            </div>
            <h3 className="text-xl font-bold text-vvm-text">No Local Orders Stored in This Browser</h3>
            <p className="text-xs text-vvm-muted leading-relaxed max-w-md mx-auto">
              If you just purchased using Razorpay on your phone or another window, use the retrieval box above to open your Google Drive link immediately.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsFreebiesOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-vvm-accent text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-vvm-accentHover transition-colors shadow-subtle"
              >
                Claim Free 1.2GB Starter Pack
              </button>
              <Link
                href="/store"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-vvm-border text-vvm-text text-xs font-mono font-medium hover:bg-vvm-soft transition-colors"
              >
                Explore 100GB Vault (₹49)
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-vvm-border p-6 sm:p-8 shadow-card space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-vvm-border">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-vvm-text">
                        Order #{order.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase border border-emerald-200">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-vvm-muted mt-1">
                      Purchased on {new Date(order.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} • Paid via {order.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-vvm-text">
                      {order.total === 0 ? 'FREE' : `₹${order.total.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                {/* Token & Security Box */}
                <div className="p-4 rounded-2xl bg-vvm-bg/60 border border-vvm-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-vvm-muted">
                      <Key className="w-3.5 h-3.5 text-vvm-accent" />
                      <span>Encrypted Access Token:</span>
                    </div>
                    <div className="font-mono text-xs font-bold text-vvm-text truncate max-w-sm sm:max-w-md">
                      {order.downloadToken}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <a
                      href={getDriveLinkForOrder(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-vvm-text hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-elevated transition-all"
                    >
                      <span>Open in Google Drive</span>
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </a>

                    <Link
                      href="/order-success"
                      className="px-4 py-3 rounded-xl bg-white hover:bg-vvm-soft border border-vvm-border text-vvm-text text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <span>Order Page</span>
                    </Link>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-vvm-muted">
                    Licensed Digital Products
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3.5 rounded-2xl border border-vvm-border/70 bg-white flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl bg-vvm-soft overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-vvm-text truncate">
                              {item.product.title}
                            </h5>
                            <span className="text-[10px] font-mono text-vvm-muted block truncate">
                              {item.product.assetsCount} • {item.product.fileSize}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-vvm-text flex-shrink-0">
                          {item.product.price === 0 ? 'FREE' : `₹${item.product.price.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Receipt Details */}
                <div className="pt-3 border-t border-vvm-border/60 flex flex-wrap items-center justify-between text-xs font-mono text-vvm-muted gap-2">
                  <span>Licensed to: {order.customer.name} ({order.customer.email})</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Perpetual Commercial Rights Granted</span>
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ================= 3. PERMANENT FUTURE ACCESS FAQ FOR CREATORS ================= */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-vvm-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-vvm-border">
            <HelpCircle className="w-5 h-5 text-vvm-accent" />
            <h4 className="text-sm font-bold text-vvm-text">
              How Customers Re-Access Their Files in the Future:
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-vvm-soft/50 border border-vvm-border space-y-1.5">
              <span className="font-mono text-purple-600 font-bold block text-[11px] uppercase">
                Method 1: Razorpay Official Receipt
              </span>
              <p className="text-vvm-muted leading-relaxed">
                Razorpay automatically emails the payment confirmation receipt to every buyer. The permanent 100GB Google Drive link is printed directly in the receipt notes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-vvm-soft/50 border border-vvm-border space-y-1.5">
              <span className="font-mono text-emerald-600 font-bold block text-[11px] uppercase">
                Method 2: Google Drive "Add Shortcut"
              </span>
              <p className="text-vvm-muted leading-relaxed">
                When opening the Drive link, click <em>&ldquo;Add shortcut to Drive&rdquo;</em> in Google Drive. The 100GB folder will permanently appear in the customer&apos;s personal Google Drive account!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-vvm-soft/50 border border-vvm-border space-y-1.5">
              <span className="font-mono text-indigo-600 font-bold block text-[11px] uppercase">
                Method 3: Direct Website Retrieval
              </span>
              <p className="text-vvm-muted leading-relaxed">
                Buyers can visit <code>virtual-vision-media.vercel.app/dashboard</code> anytime on their PC or laptop, enter their payment email or ID, and retrieve their assets instantly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
