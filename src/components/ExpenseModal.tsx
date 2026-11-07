/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Receipt, Calendar, Link2 } from 'lucide-react';
import { ClientEvent, Expense, ExpenseCategory } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  events: ClientEvent[];
  expenseToEdit?: Expense | null;
}

const CATEGORIES: ExpenseCategory[] = [
  'Decoration',
  'Photography',
  'Flowers',
  'Venue',
  'Catering',
  'Logistics',
  'Misc',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  events,
  expenseToEdit,
}) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventName, setEventName] = useState(events[0]?.clientName || '');
  const [category, setCategory] = useState<ExpenseCategory>('Decoration');
  const [supplierNote, setSupplierNote] = useState('');
  const [amount, setAmount] = useState<number | string>(10000);
  const [receiptLink, setReceiptLink] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setDate(expenseToEdit.date);
      setEventName(expenseToEdit.eventName);
      setCategory(expenseToEdit.category);
      setSupplierNote(expenseToEdit.supplierNote);
      setAmount(expenseToEdit.amount);
      setReceiptLink(expenseToEdit.receiptLink || '');
      setNotes(expenseToEdit.notes || '');
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setEventName(events[0]?.clientName || 'General Studio Overhead');
      setCategory('Decoration');
      setSupplierNote('');
      setAmount(10000);
      setReceiptLink('');
      setNotes('');
    }
  }, [expenseToEdit, isOpen, events]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expensePayload: Expense = {
      id: expenseToEdit ? expenseToEdit.id : `exp-${Date.now()}`,
      date,
      eventName: eventName || 'General Studio Overhead',
      category,
      supplierNote: supplierNote.trim() || 'Vendor payment',
      amount: Number(amount) || 0,
      receiptLink: receiptLink.trim(),
      notes: notes.trim(),
    };
    onSave(expensePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-red-600" />
              <span>{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {expenseToEdit
                ? 'Update supplier payment or category allocation'
                : 'Log supplier payment, materials or sub-contractor cost'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Event *
              </label>
              <select
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.clientName}>
                    {ev.clientName} ({ev.eventType})
                  </option>
                ))}
                <option value="General Studio Overhead">General Studio Overhead</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (BDT ৳) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supplier / Note *
            </label>
            <input
              type="text"
              required
              value={supplierNote}
              onChange={(e) => setSupplierNote(e.target.value)}
              placeholder="e.g. Advance to decorator or Floral samples"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Receipt Link (Google Drive / Cloud URL)</span>
            </label>
            <input
              type="url"
              value={receiptLink}
              onChange={(e) => setReceiptLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via bKash, remaining balance due on delivery"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors interactive-spring cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-sm shadow-red-600/20 interactive-spring cursor-pointer"
            >
              {expenseToEdit ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
