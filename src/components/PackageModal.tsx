/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2 } from 'lucide-react';
import { PackageTier, PackageStatus } from '../types';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: PackageTier) => void;
  packageToEdit?: PackageTier | null;
}

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  packageToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Full Wedding');
  const [basePrice, setBasePrice] = useState<number | string>(150000);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<PackageStatus>('Active');
  const [inclusions, setInclusions] = useState<string[]>(['']);

  useEffect(() => {
    if (packageToEdit) {
      setName(packageToEdit.name);
      setCategory(packageToEdit.category);
      setBasePrice(packageToEdit.basePrice);
      setDescription(packageToEdit.description);
      setStatus(packageToEdit.status);
      setInclusions(packageToEdit.inclusions.length ? packageToEdit.inclusions : ['']);
    } else {
      setName('');
      setCategory('Full Wedding');
      setBasePrice(150000);
      setDescription('');
      setStatus('Active');
      setInclusions([
        'Custom stage backdrop and lighting',
        'Lead photographer and digital album',
        'On-site event coordination',
      ]);
    }
  }, [packageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const handleInclusionChange = (index: number, val: string) => {
    const updated = [...inclusions];
    updated[index] = val;
    setInclusions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInclusions = inclusions.map((i) => i.trim()).filter(Boolean);
    const payload: PackageTier = {
      id: packageToEdit ? packageToEdit.id : `pkg-${Date.now()}`,
      name: name.trim() || 'Custom Package',
      category: category.trim() || 'Custom',
      basePrice: Number(basePrice) || 0,
      description: description.trim(),
      inclusions: cleanInclusions.length ? cleanInclusions : ['Comprehensive studio services'],
      status,
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              <span>{packageToEdit ? 'Edit wedding package' : 'Create wedding package'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure package tier, base price and standard client deliverables
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tier / Package Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elegance Tier"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Full Wedding, Intimate, Holud"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Price (BDT ৳) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PackageStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the package scope and aesthetic"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Package Inclusions & Deliverables
              </label>
              <button
                type="button"
                onClick={handleAddInclusion}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add line</span>
              </button>
            </div>
            <div className="space-y-2">
              {inclusions.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleInclusionChange(index, e.target.value)}
                    placeholder="e.g. Stage backdrop, 2-day photography"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInclusion(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              {packageToEdit ? 'Save package' : 'Create package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
