'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
    discount,
    total,
    couponCode,
    couponError,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
    }
  };

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-vvm-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-vvm-soft flex items-center justify-center text-vvm-text">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-vvm-text">Your Creative Vault Cart</h2>
                <p className="text-xs text-vvm-muted font-mono">{cartCount} {cartCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-vvm-muted hover:text-vvm-text hover:bg-vvm-soft transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-vvm-soft flex items-center justify-center text-vvm-muted mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-bold text-vvm-text">Your cart is empty</h3>
                <p className="text-xs text-vvm-muted max-w-xs mt-1 mb-6">
                  Add the 100GB Master Vault or individual packs to begin elevating your video edits.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-vvm-text text-white text-xs font-medium hover:bg-black transition-colors"
                >
                  Explore Master Vault
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl border border-vvm-border/80 bg-vvm-bg/30 flex gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-vvm-soft flex-shrink-0 border border-black/5">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-vvm-text truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-vvm-muted hover:text-rose-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-vvm-muted truncate mt-0.5">
                      {item.product.assetsCount} • {item.product.fileSize}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-vvm-border text-vvm-text">
                        {item.product.badge ? item.product.badge.split('•')[0] : 'Universal'}
                      </span>
                      <span className="text-sm font-bold text-vvm-text font-mono">
                        {item.product.price === 0 ? 'FREE' : `₹${item.product.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-vvm-border bg-vvm-bg/50 space-y-4">
              
              {/* Promo Coupon Code Form */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{couponCode} applied ({couponDiscountPercent}% OFF)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. CREATOR20)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-vvm-border bg-white focus:outline-none focus:border-vvm-accent font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-vvm-soft hover:bg-vvm-silver/50 text-vvm-text text-xs font-medium rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-mono">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-vvm-muted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({couponDiscountPercent}%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-vvm-muted">
                  <span>Digital Delivery & GST</span>
                  <span>Included</span>
                </div>
                <div className="pt-2 border-t border-vvm-border flex justify-between text-base font-bold text-vvm-text">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={proceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-vvm-text hover:bg-black text-white text-sm font-medium tracking-wide shadow-elevated flex items-center justify-center gap-2 group transition-all"
              >
                <span>Proceed to Instant Download</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-vvm-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Digital Access • Razorpay Protected</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
