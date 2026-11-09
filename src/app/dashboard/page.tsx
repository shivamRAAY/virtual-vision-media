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
  Key
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

const PAID_VAULT_DRIVE_LINK = "https://drive.google.com/drive/folders/1GaOl2Ha0AII8QSIhiuOCyA7380DVfQVl?usp=sharing&mcp_token=eyJwaWQiOjkyNzcyOSwic2lkIjoxNzE2MzIxNjI0LCJheCI6ImViNTQ5YzRiZDJkMjBkMTVkZWUxMGMwNGNlMmJlYTNkIiwidHMiOjE3MzgwNTIxNzgsImV4cCI6MTc0MDQ3MTM3OH0.hJ55soOk95b_4z0GzUsTHEiIs3x7BSqUJ-NlZ8sXnLI";
const FREEBIE_DRIVE_LINK = "https://drive.google.com/drive/folders/1HYWrteRByCcQ66Gs2t5TkLmwH9zH5lfG";

export default function CustomerDashboardPage() {
  const { orders, setIsFreebiesOpen } = useCart();
  const [downloadingToken, setDownloadingToken] = useState<string | null>(null);

  const getDriveLinkForOrder = (order: typeof orders[0]) => {
    return order.total === 0 || order.paymentMethod === 'FREE_ACCESS'
      ? FREEBIE_DRIVE_LINK
      : PAID_VAULT_DRIVE_LINK;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-vvm-border text-xs font-mono text-vvm-muted mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Customer Vault Access</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-vvm-text">
              My Downloads & Licenses
            </h1>
            <p className="text-sm text-vvm-muted mt-1">
              Access your purchased creative files, time-limited download tokens, and commercial certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="px-4 py-2.5 rounded-xl bg-vvm-text text-white text-xs font-mono font-medium hover:bg-black transition-colors"
            >
              Browse More Packs
            </Link>
          </div>
        </div>

        {/* Orders Overview */}
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-vvm-border shadow-card max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-vvm-soft flex items-center justify-center text-vvm-muted mx-auto">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-vvm-text">No purchases yet</h3>
            <p className="text-xs text-vvm-muted leading-relaxed">
              When you purchase the 100GB Master Vault or unlock free starter assets, your encrypted download tokens and invoices will appear here automatically.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsFreebiesOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-vvm-accent text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-vvm-accentHover transition-colors"
              >
                Claim Free 1.2GB Starter Pack
              </button>
              <Link
                href="/store"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-vvm-border text-vvm-text text-xs font-mono font-medium hover:bg-vvm-soft transition-colors"
              >
                Explore Store
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
                      className="px-4 py-3 rounded-xl bg-white hover:bg-vvm-soft border border-vvm-border text-vvm-text text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
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

      </div>
    </div>
  );
}
