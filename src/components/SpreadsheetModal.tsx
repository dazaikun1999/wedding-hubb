/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FileSpreadsheet, ExternalLink, Check, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { apiCall } from '../services/dataService';

interface SpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetUrl: string;
  apiUrl: string;
  isOnline: boolean;
  onSaveConfig: (spreadsheetUrl: string, apiUrl: string, isOnline: boolean) => void;
  showToast: (msg: string) => void;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({
  isOpen,
  onClose,
  spreadsheetUrl,
  apiUrl,
  isOnline,
  onSaveConfig,
  showToast,
}) => {
  const [currentSheetUrl, setCurrentSheetUrl] = useState(spreadsheetUrl);
  const [currentApiUrl, setCurrentApiUrl] = useState(apiUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const res = await apiCall('PING', { test: true }, currentApiUrl);
    setTesting(false);

    if (res.success && (!currentApiUrl || !currentApiUrl.includes('placeholder'))) {
      setTestResult('Successfully connected to Google Apps Script endpoint!');
      onSaveConfig(currentSheetUrl, currentApiUrl, true);
    } else {
      setTestResult(
        'Endpoint unreachable or demo placeholder configured. Operating in local storage fallback mode.'
      );
      onSaveConfig(currentSheetUrl, currentApiUrl, false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isNowOnline = Boolean(
      currentApiUrl && !currentApiUrl.includes('placeholder')
    );
    onSaveConfig(currentSheetUrl, currentApiUrl, isNowOnline);
    showToast('Spreadsheet integration preferences saved.');
    onClose();
  };

  const sampleAppsScript = `// EverAfter Google Apps Script backend template
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var payload = data.payload;
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Return success response with CORS
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    action: action,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(sampleAppsScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheets integration & storage engine</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure connected Google Sheet URL and Apps Script API Webhook
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Current Storage Status:
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isOnline ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Online (Synchronizing with Google Sheets API)
                  </span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full border border-slate-400"></span>
                    Local Storage (Demo Mode with zero latency)
                  </span>
                )}
              </div>
            </div>
            {currentSheetUrl && (
              <a
                href={currentSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                <span>Open Sheet</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Spreadsheet URL (for "Check spreadsheet" button)
              </label>
              <input
                type="url"
                value={currentSheetUrl}
                onChange={(e) => setCurrentSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Apps Script Web App URL (doPost API Endpoint)
              </label>
              <input
                type="url"
                value={currentApiUrl}
                onChange={(e) => setCurrentApiUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave empty or default for instant local storage demo mode. When configured, EverAfter dispatches asynchronous updates to your spreadsheet.
              </p>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{testResult}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-white/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors interactive-spring cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test connection'}</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-2 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-sm shadow-red-600/20 interactive-spring cursor-pointer"
              >
                Save preferences
              </button>
            </div>
          </form>

          {/* Apps Script Helper snippet */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Google Apps Script boilerplate (Optional):
              </span>
              <button
                type="button"
                onClick={copyScript}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[10px] overflow-x-auto font-mono max-h-24">
              {sampleAppsScript}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
