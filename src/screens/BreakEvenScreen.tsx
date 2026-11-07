/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, DollarSign, Target } from 'lucide-react';
import { formatBDT } from '../services/dataService';

export const BreakEvenScreen: React.FC = () => {
  // Monthly Fixed Costs
  const [studioRent, setStudioRent] = useState<number>(45000);
  const [coreSalaries, setCoreSalaries] = useState<number>(65000);
  const [marketingSoftware, setMarketingSoftware] = useState<number>(15000);
  const [studioUtilities, setStudioUtilities] = useState<number>(10000);

  // Per-Wedding Financials
  const [averagePackagePrice, setAveragePackagePrice] = useState<number>(140000);
  const [averageVariableCost, setAverageVariableCost] = useState<number>(75000);

  // Target Monthly Profit
  const [targetMonthlyProfit, setTargetMonthlyProfit] = useState<number>(100000);

  const totalFixedCosts =
    studioRent + coreSalaries + marketingSoftware + studioUtilities;

  const unitContributionMargin = Math.max(1, averagePackagePrice - averageVariableCost);
  const contributionMarginRatio = Math.round(
    (unitContributionMargin / Math.max(1, averagePackagePrice)) * 100
  );

  const breakEvenUnits = Math.ceil(totalFixedCosts / unitContributionMargin);
  const breakEvenRevenue = breakEvenUnits * averagePackagePrice;

  const targetUnits = Math.ceil(
    (totalFixedCosts + targetMonthlyProfit) / unitContributionMargin
  );
  const targetRevenue = targetUnits * averagePackagePrice;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Break-even calculator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Calculate overhead coverage, per-celebration margins and monthly profitability.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Monthly Fixed Overhead
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatBDT(totalFixedCosts)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Rent, core payroll & software
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Contribution Margin
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatBDT(unitContributionMargin)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {contributionMarginRatio}% margin per wedding
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
            Monthly Break-Even
          </div>
          <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
            {breakEvenUnits} weddings
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {formatBDT(breakEvenRevenue)} monthly revenue
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-5 rounded-2xl cursor-default hover:-translate-y-0.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Target Profit Goal
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {targetUnits} weddings
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            For {formatBDT(targetMonthlyProfit)} net profit
          </div>
        </div>
      </div>

      {/* Main Calculation Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fixed Costs Breakdown */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-slate-200/50 dark:border-white/5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-red-600" />
              <span>Studio Monthly Overhead (Fixed Costs)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Expenses incurred regardless of booked celebrations
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Studio Rent (Gulshan / Dhanmondi):</span>
                <span>{formatBDT(studioRent)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="120000"
                step="5000"
                value={studioRent}
                onChange={(e) => setStudioRent(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Core Staff & Planner Salaries:</span>
                <span>{formatBDT(coreSalaries)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={coreSalaries}
                onChange={(e) => setCoreSalaries(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Marketing & Software Subscriptions:</span>
                <span>{formatBDT(marketingSoftware)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="2500"
                value={marketingSoftware}
                onChange={(e) => setMarketingSoftware(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Studio Utilities & Internet:</span>
                <span>{formatBDT(studioUtilities)}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="30000"
                step="1000"
                value={studioUtilities}
                onChange={(e) => setStudioUtilities(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Per-Event Economics */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-slate-200/50 dark:border-white/5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Unit Economics (Per Wedding Event)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Average pricing and direct supplier cost per project
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Average Wedding Package Price:</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {formatBDT(averagePackagePrice)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="400000"
                step="5000"
                value={averagePackagePrice}
                onChange={(e) => setAveragePackagePrice(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Average Direct Cost (Florals, Venue, Photo, Props):</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {formatBDT(averageVariableCost)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={averageVariableCost}
                onChange={(e) => setAverageVariableCost(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Target Net Monthly Profit:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {formatBDT(targetMonthlyProfit)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="10000"
                value={targetMonthlyProfit}
                onChange={(e) => setTargetMonthlyProfit(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Studio Insight:</strong> Each booked event yields{' '}
              <span className="text-slate-900 dark:text-white font-bold">
                {formatBDT(unitContributionMargin)}
              </span>{' '}
              towards covering your {formatBDT(totalFixedCosts)} overhead.
              Once your team delivers {breakEvenUnits} weddings in a month, every subsequent event contributes direct net profit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
