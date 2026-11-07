/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Lock, User, Mail, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MASTER_KEY, loginUserLive, registerUser } from '../services/dataService';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');

  // Sign In state
  const [signInUsername, setSignInUsername] = useState('hasib');
  const [signInPassword, setSignInPassword] = useState('');

  // Create Account state
  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createMasterKey, setCreateMasterKey] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [masterKeyError, setMasterKeyError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const triggerShake = (msg: string, isMasterKeyErr: boolean = false) => {
    setErrorMessage(msg);
    setMasterKeyError(isMasterKeyErr);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setMasterKeyError(false);

    const cleanUser = signInUsername.trim().toLowerCase();
    if (!cleanUser) {
      triggerShake('Please enter your username.');
      return;
    }

    if (!signInPassword) {
      triggerShake('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await loginUserLive(cleanUser, signInPassword);
      onSuccess(authenticatedUser);
    } catch (err: any) {
      triggerShake(
        err.message || 'Invalid credentials. Please verify your username and password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setMasterKeyError(false);

    const cleanUser = createUsername.trim().toLowerCase();
    const cleanEmail = createEmail.trim().toLowerCase();

    // 1. Strict Master Key Enforcement: Compare immediately before network dispatch
    if (createMasterKey !== MASTER_KEY) {
      triggerShake(
        'Access Denied: Invalid Master Security Key. Contact Hasib, Emon, or Armeen for authorization.',
        true
      );
      return;
    }

    if (!cleanUser) {
      triggerShake('Please choose a username.');
      return;
    }

    if (createPassword.length < 6) {
      triggerShake('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser(cleanUser, cleanEmail, createPassword, createMasterKey);
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMessage('Account verified and registered successfully. Signing you in...');
      setTimeout(() => {
        onSuccess(result.user);
      }, 700);
    } else {
      triggerShake(result.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-[440px] bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-2xl p-7 relative transition-all ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Header: Glowing heart icon & bold branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 mb-3">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            EverAfter
          </h2>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
            Welcome back
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sign in to open your wedding planning workspace
          </p>
        </div>

        {/* Dual Tab Selector: Segmented pill control */}
        <div className="flex bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage('');
              setMasterKeyError(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              setErrorMessage('');
              setMasterKeyError(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-900 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Sign In */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signInUsername}
                  onChange={(e) => setSignInUsername(e.target.value)}
                  placeholder="e.g. hasib"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}</span>
            </button>
          </form>
        ) : (
          /* Tab 2: Create Account */
          <form onSubmit={handleCreateAccount} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={createUsername}
                  onChange={(e) => setCreateUsername(e.target.value)}
                  placeholder="e.g. armeen"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="you@everafter.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Master Security Key *</span>
                <span className="text-[10px] text-red-500 font-normal">Required for team access</span>
              </label>
              <div className="relative">
                <KeyRound
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                    masterKeyError ? 'text-red-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="password"
                  required
                  value={createMasterKey}
                  onChange={(e) => {
                    setCreateMasterKey(e.target.value);
                    if (masterKeyError) setMasterKeyError(false);
                  }}
                  placeholder="Enter team master key"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none transition-all ${
                    masterKeyError
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-red-500'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Create Account'}</span>
            </button>

            {/* Explanatory Note */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed pt-1">
              New account creation is restricted to authorized team members. Master Security Key required.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
