'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  couponCode?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    gstin?: string;
  };
  paymentMethod: string;
  paymentId: string;
  status: 'completed' | 'processing';
  downloadToken: string;
  downloadExpiry: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  couponError: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Modals & Drawers & Intro
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isFreebiesOpen: boolean;
  setIsFreebiesOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isIntroOpen: boolean;
  setIsIntroOpen: (open: boolean) => void;
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;
  
  // Orders & Downloads
  orders: Order[];
  currentOrder: Order | null;
  completeOrder: (customer: Order['customer'], paymentMethod: string, paymentId: string) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, number> = {
  'CREATOR20': 20,
  'VVM50': 50,
  'LAUNCH10': 10,
  'YOUTUBE15': 15,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFreebiesOpen, setIsFreebiesOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load cart and orders from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vvm_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem('vvm_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vvm_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vvm_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscountPercent(0);
    setCouponError(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      setCouponCode(cleanCode);
      setCouponDiscountPercent(VALID_COUPONS[cleanCode]);
      setCouponError(null);
      return true;
    } else {
      setCouponError('Invalid coupon code. Try CREATOR20 or LAUNCH10');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
    setCouponError(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = Math.round((subtotal * couponDiscountPercent) / 100);
  const total = Math.max(0, subtotal - discount);

  const completeOrder = (
    customer: Order['customer'],
    paymentMethod: string,
    paymentId: string
  ): Order => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 72); // 72-hour secure download window

    const newOrder: Order = {
      id: `VVM-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      discount,
      couponCode: couponCode || undefined,
      customer,
      paymentMethod,
      paymentId,
      status: 'completed',
      downloadToken: `vault_sec_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      downloadExpiry: expiry.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isFreebiesOpen,
        setIsFreebiesOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isIntroOpen,
        setIsIntroOpen,
        isShareOpen,
        setIsShareOpen,
        orders,
        currentOrder,
        completeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
