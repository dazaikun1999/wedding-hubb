/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { Vendor } from '../types';

interface VendorsScreenProps {
  vendors: Vendor[];
  onAddVendor: () => void;
  onEditVendor: (vendor: Vendor) => void;
  onDeleteVendor: (vendorId: string) => void;
  onUpdateVendor?: (vendor: Vendor) => void;
}

export const VendorsScreen: React.FC<VendorsScreenProps> = ({
  vendors,
  onAddVendor,
  onEditVendor,
  onDeleteVendor,
  onUpdateVendor,
}) => {
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const confirmDelete = () => {
    if (vendorToDelete) {
      onDeleteVendor(vendorToDelete.id);
      setVendorToDelete(null);
    }
  };

  const renderReliability = (reliability: 'Verified' | 'Review needed') => {
    if (reliability === 'Verified') {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          Verified
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        Review needed
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Vendor directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Keep trusted suppliers and backup contacts handy.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddVendor}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add vendor</span>
        </button>
      </div>

      {/* Supplier Network Table Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Supplier network
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-red-600 dark:text-red-400">
            {vendors.length} vendors
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl -mx-2 px-2 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="bg-white/40 text-slate-500 border-b border-slate-200/60 text-xs font-semibold dark:bg-slate-950/40 dark:text-slate-400 dark:border-b dark:border-white/5 uppercase">
                <th className="py-3 px-3 font-semibold">Vendor</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Phone / Email</th>
                <th className="py-3 px-3 font-semibold">Rate Note</th>
                <th className="py-3 px-3 font-semibold">Reliability</th>
                <th className="py-3 px-3 font-semibold">Notes</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No vendors registered yet.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-slate-200/40 dark:border-b dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                      {vendor.name}
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {vendor.category}
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        {vendor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {vendor.phone}
                          </span>
                        )}
                        {vendor.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {vendor.email}
                          </span>
                        )}
                        {!vendor.phone && !vendor.email && (
                          <span className="text-slate-400 italic">No direct contact</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {vendor.rateNote}
                    </td>

                    <td className="py-4 px-3">{renderReliability(vendor.reliability)}</td>

                    <td className="py-4 px-3">
                      {vendor.notes ? (
                        <div
                          className="text-xs text-slate-600 dark:text-slate-400 font-normal max-w-[220px] truncate"
                          title={vendor.notes}
                        >
                          {vendor.notes}
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic">No notes</span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditVendor(vendor)}
                          title="Edit Vendor"
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setVendorToDelete(vendor)}
                          title="Delete Vendor"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
      {vendorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Vendor?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Remove <strong className="text-slate-800 dark:text-slate-200">{vendorToDelete.name}</strong> from your active supplier list?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVendorToDelete(null)}
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
