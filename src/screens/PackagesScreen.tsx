/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Check, ArrowRight } from 'lucide-react';
import { PackageTier, PackageStatus } from '../types';
import { formatBDT, updatePackageLive } from '../services/dataService';

interface PackagesScreenProps {
  packages: PackageTier[];
  onAddPackage: () => void;
  onEditPackage: (pkg: PackageTier) => void;
  onDeletePackage: (pkgId: string) => void;
  onSelectForQuotation: (pkg: PackageTier) => void;
  onUpdatePackage?: (pkg: PackageTier) => void;
}

export const PackagesScreen: React.FC<PackagesScreenProps> = ({
  packages,
  onAddPackage,
  onEditPackage,
  onDeletePackage,
  onSelectForQuotation,
  onUpdatePackage,
}) => {
  const [pkgToDelete, setPkgToDelete] = useState<PackageTier | null>(null);

  const confirmDelete = () => {
    if (pkgToDelete) {
      onDeletePackage(pkgToDelete.id);
      setPkgToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Package directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage curated wedding tiers, inclusions, and design categories.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddPackage}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add package</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id ? `${pkg.id}-${idx}` : `pkg-${idx}`}
            className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between group relative hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {pkg.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {pkg.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={pkg.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as PackageStatus;
                      const updatedPkg = { ...pkg, status: newStatus };
                      if (onUpdatePackage) {
                        onUpdatePackage(updatedPkg);
                      }
                      try {
                        await updatePackageLive(updatedPkg);
                      } catch (err) {
                        console.error('[Status Update Failed]:', err);
                      }
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer focus:outline-none transition-colors ${
                      pkg.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : pkg.status === 'Archived'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    <option value="Active" className="bg-slate-900 text-white font-medium">Active</option>
                    <option value="Draft" className="bg-slate-900 text-white font-medium">Draft</option>
                    <option value="Archived" className="bg-slate-900 text-white font-medium">Archived</option>
                  </select>
                </div>
              </div>

              {/* Price Banner */}
              <div className="my-4 p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                    Starting Base Price
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {formatBDT(pkg.basePrice)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectForQuotation(pkg)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex items-center gap-1 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>Build Quote</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {pkg.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {pkg.description}
                </p>
              )}

              {/* Inclusions List */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Deliverables & Inclusions:
                </div>
                <ul className="space-y-1.5">
                  {pkg.inclusions.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer controls */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {pkg.inclusions.length} core services
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEditPackage(pkg)}
                  title="Edit Package"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPkgToDelete(pkg)}
                  title="Delete Package"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {pkgToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Package Tier?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Remove tier <strong className="text-slate-800 dark:text-slate-200">{pkgToDelete.name}</strong> from your available studio catalog?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPkgToDelete(null)}
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
