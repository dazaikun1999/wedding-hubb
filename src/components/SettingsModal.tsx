/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { UserSession } from '../types';
import { updateUserProfile, apiCall } from '../services/dataService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onUserUpdate: (updatedUser: UserSession) => void;
  showToast: (msg: string, type?: 'success' | 'info') => void;
  apiUrl?: string;
  spreadsheetUrl?: string;
  isOnline?: boolean;
  onSaveSpreadsheetConfig?: (spreadsheetUrl: string, apiUrl: string, isOnline: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  showToast,
  apiUrl,
  spreadsheetUrl,
  isOnline = true,
  onSaveSpreadsheetConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'database'>('security');

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Spreadsheet settings states
  const [sheetUrl, setSheetUrl] = useState(spreadsheetUrl || '');
  const [apiEndpoint, setApiEndpoint] = useState(apiUrl || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('No active user session detected.');
      return;
    }

    if (!currentPassword) {
      setErrorMessage('Current password is required.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirmation do not match.');
        return;
      }
    }

    if (!newUsername.trim() && !newPassword) {
      setErrorMessage('Please provide a new username or new password to update.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        user_id: currentUser?.id || (currentUser as any)?.user_id,
        current_username: currentUser?.username || 'hasib',
        current_password: currentPassword,
        new_username: newUsername.trim() || undefined,
        new_password: newPassword.trim() || undefined,
      };

      const result = await updateUserProfile(payload);

      setIsSubmitting(false);

      if (result.status === 'success' || result.success) {
        const nextUsername = newUsername.trim() || currentUser.username;
        const updatedUser: UserSession = {
          ...currentUser,
          ...(result.user || {}),
          username: result.user?.username || nextUsername,
          displayName:
            result.user?.displayName ||
            (nextUsername.charAt(0).toUpperCase() + nextUsername.slice(1)),
          initial: (result.user?.username || nextUsername).charAt(0).toUpperCase(),
        };

        const sessionUser = result.user || updatedUser;
        localStorage.setItem('everafter_studio_user_v1', JSON.stringify(sessionUser));
        onUserUpdate(sessionUser);

        // Clear password inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewUsername('');
        setErrorMessage(null);

        showToast('Credentials updated successfully in database!');
        onClose();
      } else {
        setErrorMessage(
          result.message || result.error || 'Failed to update credentials. Check your current password.'
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        err.message || 'Failed to update credentials. Check your current password.'
      );
    }
  };

  const handleTestDatabase = async () => {
    setIsTesting(true);
    setTestResult(null);

    const res = await apiCall('PING', { test: true }, apiEndpoint);
    setIsTesting(false);

    if (res.success && (!apiEndpoint || !apiEndpoint.includes('placeholder'))) {
      setTestResult('Successfully connected to Google Apps Script backend.');
      onSaveSpreadsheetConfig?.(sheetUrl, apiEndpoint, true);
    } else {
      setTestResult(
        'Endpoint unreachable or demo placeholder configured. Operating in local storage mode.'
      );
      onSaveSpreadsheetConfig?.(sheetUrl, apiEndpoint, false);
    }
  };

  const handleSaveDatabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const online = Boolean(apiEndpoint && !apiEndpoint.includes('placeholder'));
    onSaveSpreadsheetConfig?.(sheetUrl, apiEndpoint, online);
    showToast('Database configuration saved.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close settings"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Studio Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage team security and database integration.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Team Member Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Database & Sheets
          </button>
        </div>

        {/* Tab 1: Team Member Security */}
        {activeTab === 'security' && (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Team Member Security
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Logged in as <span className="font-semibold text-rose-600 dark:text-rose-400">{currentUser?.username || 'user'}</span>.
                Rotate your password or customize your workspace username.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-rose-800 dark:text-rose-200 leading-relaxed">
                  {errorMessage}
                </span>
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              {/* Field 1: Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Field 2: New Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Field 3: New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Field 4: Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2.5 font-medium transition-all shadow-md hover:shadow-rose-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <span>Update Credentials</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Database & Sheets Configuration */}
        {activeTab === 'database' && (
          <form onSubmit={handleSaveDatabaseConfig} className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Google Sheets Integration
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your master spreadsheet or Google Apps Script Web App URL.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium leading-relaxed ${
                  testResult.includes('Successfully')
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}
              >
                {testResult}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Google Spreadsheet URL
              </label>
              <div className="relative">
                <FileSpreadsheet className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Apps Script Web App API URL
              </label>
              <input
                type="url"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={isTesting}
                className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                Save Config
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
