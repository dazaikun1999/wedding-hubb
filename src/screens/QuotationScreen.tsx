/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Printer,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { ClientEvent, PackageTier, QuotationData, QuotationItem } from '../types';
import { formatBDT, formatDateDisplay } from '../services/dataService';

interface QuotationScreenProps {
  quotation: QuotationData;
  setQuotation: React.Dispatch<React.SetStateAction<QuotationData>>;
  events: ClientEvent[];
  packages: PackageTier[];
  showToast: (msg: string) => void;
}

export const QuotationScreen: React.FC<QuotationScreenProps> = ({
  quotation,
  setQuotation,
  events,
  packages,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);

  // Financial calculations
  const subtotal = quotation.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmount = (subtotal * (Number(quotation.discountPercent) || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (Number(quotation.taxPercent) || 0)) / 100;
  const grandTotal = Math.round(taxableAmount + taxAmount);

  const quotationNumber = `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: `qi-${Date.now()}`,
      description: 'New service item',
      quantity: 1,
      unitPrice: 0,
    };
    setQuotation((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSelectPackage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    if (!pkgId) return;
    const selected = packages.find((p) => p.id === pkgId);
    if (!selected) return;

    setQuotation((prev) => ({
      ...prev,
      eventType: selected.category,
      items: [
        {
          id: `qi-${Date.now()}`,
          description: `${selected.name} (${selected.category})`,
          quantity: 1,
          unitPrice: selected.basePrice,
        },
        ...selected.inclusions.slice(0, 3).map((inc, i) => ({
          id: `qi-${Date.now()}-${i}`,
          description: inc,
          quantity: 1,
          unitPrice: 0,
        })),
      ],
    }));
    showToast(`Loaded ${selected.name} package into quote.`);
  };

  const handleSelectClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientName = e.target.value;
    if (!clientName) return;
    const clientEvent = events.find((ev) => ev.clientName === clientName);
    if (clientEvent) {
      setQuotation((prev) => ({
        ...prev,
        clientName: clientEvent.clientName,
        eventType: clientEvent.eventType,
        eventDate: clientEvent.date,
      }));
    } else {
      setQuotation((prev) => ({ ...prev, clientName }));
    }
  };

  const handleCopyQuotationText = () => {
    const lines = [
      `EVERAFTER WEDDING STUDIO : QUOTATION`,
      `Quote No: ${quotationNumber}`,
      `Date: ${new Date().toLocaleDateString('en-GB')}`,
      `Client: ${quotation.clientName || 'Valued Client'}`,
      `Event: ${quotation.eventType}`,
      `Event Date: ${formatDateDisplay(quotation.eventDate)}`,
      quotation.validUntil ? `Valid Until: ${formatDateDisplay(quotation.validUntil)}` : '',
      `------------------------------------`,
      `ITEMIZED SERVICES:`,
      ...quotation.items.map(
        (it) =>
          `- ${it.description} (Qty: ${it.quantity}) : ৳${(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toLocaleString()}`
      ),
      `------------------------------------`,
      `Subtotal: ৳${subtotal.toLocaleString()}`,
      quotation.discountPercent > 0 ? `Discount (${quotation.discountPercent}%): -৳${discountAmount.toLocaleString()}` : '',
      quotation.taxPercent > 0 ? `VAT (${quotation.taxPercent}%): +৳${taxAmount.toLocaleString()}` : '',
      `GRAND TOTAL: ৳${grandTotal.toLocaleString()}`,
      `------------------------------------`,
      quotation.notes ? `Terms: ${quotation.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    showToast('Quotation copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintQuotation = () => {
    try {
      const quotationElement = document.getElementById('printable-quotation');
      if (!quotationElement) {
        window.print();
        return;
      }

      const printWindow = window.open('', '_blank', 'width=850,height=900,top=80,left=80');
      if (!printWindow) {
        window.print();
        return;
      }

      const clientTitle = quotation.clientName ? `Quotation : ${quotation.clientName}` : 'Wedding Quotation';
      const documentContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${clientTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        background-color: #ffffff;
        color: #0f172a;
        margin: 0;
        padding: 24px;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm;
      }
      @media print {
        body {
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="max-w-3xl mx-auto">
      ${quotationElement.innerHTML}
    </div>
    <script>
      function triggerPrint() {
        window.focus();
        window.print();
        setTimeout(function() {
          window.close();
        }, 500);
      }
      if (document.readyState === 'complete') {
        setTimeout(triggerPrint, 350);
      } else {
        window.addEventListener('load', function() {
          setTimeout(triggerPrint, 350);
        });
      }
    </script>
  </body>
</html>`;

      printWindow.document.open();
      printWindow.document.write(documentContent);
      printWindow.document.close();
    } catch {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Quotation builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build a price quote for a client, then print it or save it as a PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyQuotationText}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all min-h-[44px] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintQuotation}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 min-h-[44px] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Split Screen Layout (Stack vertically on mobile, side-by-side on desktop) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
        {/* Left Form Pane: Quote Details */}
        <div className="w-full lg:w-1/2 quotation-form-pane p-4 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 space-y-6 no-print">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-white/5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Quote details
            </h3>
            {/* Quick Package Selector */}
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                onChange={handleSelectPackage}
                defaultValue=""
                className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="" disabled>
                  Load from Package Tier
                </option>
                {packages.map((pkg, idx) => (
                  <option key={pkg.id ? `${pkg.id}-${idx}` : `pkg-${idx}`} value={pkg.id}>
                    {pkg.name} ({formatBDT(pkg.basePrice)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client
                </label>
                {events.length > 0 && (
                  <select
                    onChange={handleSelectClient}
                    defaultValue=""
                    className="text-[10px] text-red-600 bg-transparent border-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Auto-fill from client
                    </option>
                    {events.map((ev, idx) => (
                      <option key={ev.id ? `${ev.id}-${idx}` : `ev-${idx}`} value={ev.clientName}>
                        {ev.clientName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={quotation.clientName}
                onChange={(e) =>
                  setQuotation((prev) => ({ ...prev, clientName: e.target.value }))
                }
                placeholder="Choose or type a name"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event type
              </label>
              <input
                type="text"
                value={quotation.eventType}
                onChange={(e) =>
                  setQuotation((prev) => ({ ...prev, eventType: e.target.value }))
                }
                placeholder="e.g. Wedding Reception"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event date
              </label>
              <input
                type="date"
                value={quotation.eventDate}
                onChange={(e) =>
                  setQuotation((prev) => ({ ...prev, eventDate: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quote valid until
              </label>
              <input
                type="date"
                value={quotation.validUntil}
                onChange={(e) =>
                  setQuotation((prev) => ({ ...prev, validUntil: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={quotation.discountPercent}
                onChange={(e) =>
                  setQuotation((prev) => ({
                    ...prev,
                    discountPercent: e.target.value === '' ? ('' as unknown as number) : Math.max(0, Math.min(100, Number(e.target.value))),
                  }))
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                VAT / tax (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={quotation.taxPercent}
                onChange={(e) =>
                  setQuotation((prev) => ({
                    ...prev,
                    taxPercent: e.target.value === '' ? ('' as unknown as number) : Math.max(0, Math.min(100, Number(e.target.value))),
                  }))
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes / terms
            </label>
            <textarea
              rows={3}
              value={quotation.notes}
              onChange={(e) =>
                setQuotation((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="e.g. 50% advance to confirm the booking. Balance due before the event date."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Dynamic Items Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Items
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add item</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-slate-400 px-1">
                <span className="col-span-5">Description</span>
                <span className="col-span-2">Qty</span>
                <span className="col-span-3">Unit Price (৳)</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {quotation.items.map((item) => {
                const lineTotal =
                  (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center bg-slate-50/70 dark:bg-slate-700/30 p-2 rounded-xl"
                  >
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, 'description', e.target.value)
                      }
                      placeholder="Service name"
                      className="col-span-5 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />

                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'quantity',
                          e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                        )
                      }
                      className="col-span-2 px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-center focus:outline-none"
                    />

                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'unitPrice',
                          e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                        )
                      }
                      className="col-span-3 px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-right focus:outline-none"
                    />

                    <div className="col-span-2 flex items-center justify-end gap-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {formatBDT(lineTotal)}
                      </span>
                      {quotation.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Preview Pane: QUOTATION Paper */}
        <div className="w-full lg:w-1/2 print-only-container">
          <div
            id="printable-quotation"
            className="quotation-paper p-8 rounded-2xl bg-white text-slate-900 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            {/* Header branding */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/20">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    Wedding Planner
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Wedding & Event Studio · Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-extrabold tracking-wider text-slate-900 uppercase">
                  Quotation
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  No. {quotationNumber}
                </div>
                <div className="text-[11px] text-slate-500">
                  Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Prepared for client section */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                Prepared for
              </div>
              <div className="text-sm font-bold text-slate-900">
                {quotation.clientName || '---'}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {quotation.eventType || 'Wedding Event'} {quotation.eventDate ? `· ${formatDateDisplay(quotation.eventDate)}` : ''}
              </div>
              {quotation.validUntil && (
                <div className="text-[11px] text-slate-400 mt-1">
                  Valid until: {formatDateDisplay(quotation.validUntil)}
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-center w-12">Qty</th>
                    <th className="pb-2 text-right w-24">Unit Price</th>
                    <th className="pb-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotation.items.map((item) => {
                    const total =
                      (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <tr key={item.id}>
                        <td className="py-2.5 text-slate-800 font-medium">
                          {item.description || 'Service line item'}
                        </td>
                        <td className="py-2.5 text-slate-600 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-slate-600 text-right">
                          {formatBDT(item.unitPrice)}
                        </td>
                        <td className="py-2.5 text-slate-900 font-semibold text-right">
                          {formatBDT(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations & Grand Total */}
            <div className="border-t border-slate-200 pt-4 space-y-1.5 mb-6">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formatBDT(subtotal)}</span>
              </div>

              {quotation.discountPercent > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Discount ({quotation.discountPercent}%)</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}

              {quotation.taxPercent > 0 && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span>VAT / Tax ({quotation.taxPercent}%)</span>
                  <span>+{formatBDT(taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-red-600 text-base">{formatBDT(grandTotal)}</span>
              </div>
            </div>

            {/* Notes / Terms */}
            {quotation.notes && (
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                  Notes / terms
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {quotation.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
