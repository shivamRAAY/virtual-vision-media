'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Order } from '@/context/CartContext';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-2026-${order.id.replace(/[^0-9A-Z]/g, '').slice(-6) || '749102'}`;
  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalAmount = order.total || 49;
  const taxableAmount = +(totalAmount / 1.18).toFixed(2);
  const gstAmount = +(totalAmount - taxableAmount).toFixed(2);
  const halfGst = +(gstAmount / 2).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Backdrop */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Invoice Card Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-vvm-border overflow-hidden z-10 flex flex-col my-auto print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-vvm-border bg-[#F7F7F5] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold font-mono uppercase text-vvm-text">
              Official Tax & GST Invoice
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-vvm-text text-white hover:bg-black font-mono text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-vvm-soft text-vvm-muted hover:text-vvm-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= PRINTABLE INVOICE SHEET ================= */}
        <div id="printable-invoice" className="p-8 sm:p-12 space-y-8 bg-white text-vvm-text print:p-8">
          
          {/* 1. Header & Brand Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-black/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/vvm-logo.png"
                    alt="Virtual Vision Media Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight uppercase leading-none">
                    Virtual Vision Media
                  </h1>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-vvm-muted">
                    Create Beyond Limits
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-vvm-muted leading-tight font-mono">
                Digital Production Asset Vaults & Media Labs<br />
                Mumbai, Maharashtra, India • support@virtualvisionmedia.com<br />
                GSTIN: 27AABCU9603R1ZM (Registered Digital Publisher)
              </p>
            </div>

            <div className="text-left sm:text-right font-mono space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                TAX INVOICE
              </span>
              <div className="text-xs font-bold text-vvm-text pt-2">
                Invoice No: <span className="font-mono">{invoiceNumber}</span>
              </div>
              <div className="text-[11px] text-vvm-muted">
                Date: {formattedDate}
              </div>
              <div className="text-[11px] text-vvm-muted">
                Payment Ref: {order.paymentId || 'pay_razor_live'}
              </div>
            </div>
          </div>

          {/* 2. Bill To & Licensee Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F7F7F5] p-5 rounded-2xl border border-black/5 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase font-bold text-vvm-muted block mb-1">
                Billed To (Licensee):
              </span>
              <div className="font-bold text-sm text-vvm-text">{order.customer.name}</div>
              <div className="text-vvm-muted">{order.customer.email}</div>
              {order.customer.phone && <div className="text-vvm-muted">{order.customer.phone}</div>}
              {order.customer.city && <div className="text-vvm-muted">{order.customer.city}, India</div>}
              {order.customer.gstin && (
                <div className="text-vvm-text font-bold pt-1">
                  Customer GSTIN: {order.customer.gstin}
                </div>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-vvm-muted block mb-1">
                Payment & Fulfillment:
              </span>
              <div className="text-vvm-text font-semibold">Method: UPI / Razorpay Gateway</div>
              <div className="text-emerald-700 font-bold flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Status: Paid in Full</span>
              </div>
              <div className="text-vvm-muted">Fulfillment: Instant Google Drive Cloud Access</div>
            </div>
          </div>

          {/* 3. Itemized Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black/10 text-vvm-muted text-[10px] uppercase tracking-wider">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">HSN/SAC</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Taxable Value</th>
                  <th className="py-2.5 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-bold text-vvm-text block">
                      100GB Master Video Editor Assets Vault
                    </span>
                    <span className="text-[10px] text-vvm-muted font-normal block mt-0.5">
                      Perpetual Commercial Royalty-Free Worldwide License (2,500+ Assets, 102.4 GB Verified Google Drive Archive)
                    </span>
                  </td>
                  <td className="py-3 text-center text-vvm-muted">998434</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">₹{taxableAmount}</td>
                  <td className="py-3 text-right font-bold text-vvm-text">₹{totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
            <div className="max-w-xs space-y-1.5 text-[10px] font-mono text-vvm-muted">
              <p>
                <strong>Terms:</strong> This invoice confirms worldwide, perpetual commercial usage rights. Digital download access is permanently granted via Google Drive.
              </p>
              <p>All prices inclusive of 18% Goods and Services Tax (GST).</p>
            </div>

            <div className="w-full sm:w-64 font-mono text-xs space-y-2 border-t border-black/10 pt-3">
              <div className="flex justify-between text-vvm-muted">
                <span>Taxable Amount:</span>
                <span>₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between text-vvm-muted">
                <span>CGST (9%):</span>
                <span>₹{halfGst}</span>
              </div>
              <div className="flex justify-between text-vvm-muted">
                <span>SGST (9%):</span>
                <span>₹{halfGst}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-vvm-text border-t-2 border-black/10 pt-2">
                <span>Grand Total:</span>
                <span className="text-emerald-700">₹{totalAmount}.00</span>
              </div>
            </div>
          </div>

          {/* 5. Stamp & Authorization Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-600/60 flex items-center justify-center text-emerald-700 p-1 text-center font-mono text-[8px] font-bold uppercase leading-tight rotate-12">
                PAID &amp;<br />VERIFIED
              </div>
              <div className="text-[11px] font-mono text-vvm-muted">
                Digitally Authorized by Virtual Vision Media<br />
                Computer Generated Invoice • No Physical Signature Required
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-vvm-muted">
              Page 1 of 1 • Official Customer Copy
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
