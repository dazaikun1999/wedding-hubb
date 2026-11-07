/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, ExternalLink, Receipt } from 'lucide-react';
import { ClientEvent, Expense } from '../types';
import { formatBDT, formatDateDisplay } from '../services/dataService';

interface BudgetTrackerScreenProps {
  events: ClientEvent[];
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onUpdateExpense?: (expense: Expense) => void;
}

export const BudgetTrackerScreen: React.FC<BudgetTrackerScreenProps> = ({
  events,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onUpdateExpense,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Financial calculations
  const totalPackageValue = events.reduce((sum, e) => sum + e.packageValue, 0);
  const paymentsReceived = events.reduce((sum, e) => sum + e.paidAmount, 0);
  const outstandingBalance = totalPackageValue - paymentsReceived;
  const recordedExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const confirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Budget tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare client package value, collections and event costs.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddExpense}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add expense</span>
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Total package value
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatBDT(totalPackageValue)}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Payments received
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatBDT(paymentsReceived)}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Outstanding
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatBDT(outstandingBalance)}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Recorded expenses
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatBDT(recordedExpenses)}
          </div>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Expense ledger
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-red-600 dark:text-red-400">
            BDT ৳
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl -mx-2 px-2 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead>
              <tr className="bg-white/40 text-slate-500 border-b border-slate-200/60 text-xs font-semibold dark:bg-slate-950/40 dark:text-slate-400 dark:border-b dark:border-white/5 uppercase">
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Event</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Supplier / Note</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No expense records logged yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-slate-200/40 dark:border-b dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {formatDateDisplay(exp.date)}
                    </td>

                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                      {exp.eventName}
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {exp.category}
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{exp.supplierNote}</span>
                        {exp.receiptLink && (
                          <a
                            href={exp.receiptLink}
                            target="_blank"
                            rel="noreferrer"
                            title="View receipt"
                            className="text-red-500 hover:text-red-600 p-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white">
                      {formatBDT(exp.amount)}
                    </td>

                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => onEditExpense(exp)}
                          title="Edit Expense"
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all mr-1 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpenseToDelete(exp)}
                          title="Delete Expense"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Expense?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Delete entry for <strong className="text-slate-800 dark:text-slate-200">{expenseToDelete.supplierNote}</strong> ({formatBDT(expenseToDelete.amount)})?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
