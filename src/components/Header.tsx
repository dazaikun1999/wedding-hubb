import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  Menu,
  Heart,
  RotateCw,
  ChevronDown,
  Settings,
  LogOut,
} from 'lucide-react';
import { ActiveScreen, UserSession } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: UserSession | null;
  onSignOut: () => void;
  onOpenSettings?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  onForceSync: () => Promise<void>;
  isSyncing: boolean;
}

const SCREEN_TITLES: Record<ActiveScreen, string> = {
  overview: 'Workspace / Overview',
  'clients-events': 'Workspace / Clients & Events',
  'budget-tracker': 'Workspace / Budget Tracker',
  vendors: 'Workspace / Vendors',
  checklist: 'Workspace / Task List',
  packages: 'Pricing and Packages / Packages',
  'quotation-builder': 'Workspace / Quotation builder',
  'break-even': 'Pricing and Packages / Break-even calculator',
};

interface UserAvatarMenuProps {
  currentUser: UserSession | null;
  onOpenSettings?: () => void;
  onSignOut: () => void;
}

const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({
  currentUser,
  onOpenSettings,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setIsUserMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-rose-500/30 transition-all duration-200 cursor-pointer"
        title="User Account Menu"
        aria-expanded={isUserMenuOpen}
      >
        {/* Crimson Avatar Initial Circle */}
        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
          {currentUser?.username?.charAt(0).toUpperCase() || 'H'}
        </div>
        {/* Username Display (Hidden on very small screens, visible on tablet/desktop) */}
        <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
          {currentUser?.username || 'hasib'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl p-2 z-50 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-150">
          {/* User Identity Header */}
          <div className="px-3 py-2.5 border-b border-slate-200/60 dark:border-white/10 mb-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.username || 'hasib'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-0.5">
              {currentUser?.role || 'Lead Architect'}
            </p>
          </div>

          {/* Menu Actions */}
          <div className="space-y-0.5">
            {/* Account Settings Option */}
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(false);
                onOpenSettings?.();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Workspace Settings</span>
            </button>

            {/* Sign Out Option */}
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  isDarkMode,
  toggleDarkMode,
  user,
  onSignOut,
  onOpenSettings,
  setIsMobileMenuOpen,
  onForceSync,
  isSyncing,
}) => {
  return (
    <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:bg-slate-950/75 dark:backdrop-blur-2xl dark:border-b dark:border-white/5 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 transition-all duration-300 no-print">
      {/* Mobile Header Bar (Screen sizes below lg) */}
      <div className="flex lg:hidden items-center justify-between w-full gap-3">
        {/* Left: Hamburger trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen?.(true)}
          title="Open Navigation"
          aria-label="Open Navigation"
          className="p-2.5 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-slate-800 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
        >
          <Menu className="w-6 h-6 text-slate-800 dark:text-slate-100" />
        </button>

        {/* Middle: Brand Logo and Title */}
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-900 dark:text-white truncate">
            Wedding Planner Dashboard
          </span>
        </div>

        {/* Right: Force Sync, Theme Toggle & Avatar Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onForceSync}
            disabled={isSyncing}
            title="Force sync data from Google Spreadsheet"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all duration-200 disabled:opacity-50 cursor-pointer min-h-[36px]"
          >
            <RotateCw className={`w-3.5 h-3.5 text-rose-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Sheets'}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-800 transition-all cursor-pointer min-w-[44px] min-h-[44px]"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
            )}
          </button>

          {/* Interactive User Avatar Popover Menu */}
          <UserAvatarMenu
            currentUser={user}
            onOpenSettings={onOpenSettings}
            onSignOut={onSignOut}
          />
        </div>
      </div>

      {/* Desktop Header View (hidden on mobile, visible on lg:flex) */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{SCREEN_TITLES[activeScreen] || 'Workspace / Overview'}</span>
        </div>

        {/* Right utility bar */}
        <div className="flex items-center gap-4">
          {/* Force Sync button */}
          <button
            type="button"
            onClick={onForceSync}
            disabled={isSyncing}
            title="Force sync data from Google Spreadsheet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-rose-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Sheets'}</span>
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleDarkMode}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-800 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer select-none shrink-0"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
            )}
          </button>

          {/* Interactive User Avatar Popover Menu (Includes Settings & Sign Out) */}
          <UserAvatarMenu
            currentUser={user}
            onOpenSettings={onOpenSettings}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
};

