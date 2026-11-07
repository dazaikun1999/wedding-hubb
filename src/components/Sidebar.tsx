import React from 'react';
import {
  Heart,
  LayoutDashboard,
  Users,
  Receipt,
  Sparkles,
  CheckSquare,
  FileText,
  Calculator,
  Layers,
  X,
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { MessengerSphere, TelegramSphere } from './TeamChatSpheres';

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  spreadsheetUrl?: string;
  onOpenSpreadsheetSettings?: () => void;
  onOpenSettings?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
}) => {
  const handleNavClick = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setIsMobileMenuOpen?.(false);
  };

  return (
    <>
      {/* Backdrop Blur Overlay for Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen?.(false)}
        aria-hidden="true"
      />

      {/* Responsive Sidebar / Off-Canvas Mobile Drawer */}
      <aside
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:sticky top-0 inset-y-0 left-0 z-40
          w-64 h-screen flex-shrink-0
          flex flex-col justify-between
          overflow-y-auto overflow-x-hidden
          backdrop-blur-2xl
          bg-white/60 dark:bg-slate-950/80
          border-r border-white/80 dark:border-white/5
          transition-transform duration-300 ease-in-out
          select-none no-print
        `}
      >
        {/* Top brand header & nav */}
        <div className="p-6 flex-1 flex flex-col space-y-6">
          {/* Brand header with close button on mobile */}
          <div className="flex items-center justify-between mb-2">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('overview')}
              title="Return to Overview"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white leading-tight">
                Wedding Planner Dashboard
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen?.(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              title="Close navigation menu"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Workspace section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Workspace
            </div>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'overview'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 transition-colors ${activeScreen === 'overview' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('clients-events')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'clients-events'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <Users className={`w-4 h-4 transition-colors ${activeScreen === 'clients-events' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Clients & Events</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('budget-tracker')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'budget-tracker'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <Receipt className={`w-4 h-4 transition-colors ${activeScreen === 'budget-tracker' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Budget Tracker</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('vendors')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'vendors'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <Sparkles className={`w-4 h-4 transition-colors ${activeScreen === 'vendors' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Vendors</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('checklist')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'checklist'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <CheckSquare className={`w-4 h-4 transition-colors ${activeScreen === 'checklist' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Task List</span>
              </button>
            </nav>
          </div>

          {/* Pricing and Packages section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Pricing and Packages
            </div>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('packages')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'packages'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <Layers className={`w-4 h-4 transition-colors ${activeScreen === 'packages' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Packages</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('quotation-builder')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'quotation-builder'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <FileText className={`w-4 h-4 transition-colors ${activeScreen === 'quotation-builder' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Quotation builder</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('break-even')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ease-out cursor-pointer group min-h-[44px] ${
                  activeScreen === 'break-even'
                    ? 'bg-rose-500/10 text-rose-600 font-semibold border-l-2 border-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:border-l-2 dark:border-rose-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-slate-200 hover:bg-rose-500/10 dark:hover:bg-slate-800/60 hover:translate-x-1'
                }`}
              >
                <Calculator className={`w-4 h-4 transition-colors ${activeScreen === 'break-even' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'}`} />
                <span>Break-even calculator</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Team Communication Shortcuts */}
        <div className="mt-auto p-4 pb-10 sm:pb-6 border-t border-slate-200/60 dark:border-white/5">
          <div className="flex items-center justify-center gap-4">
            <MessengerSphere />
            <TelegramSphere />
          </div>
        </div>
      </aside>
    </>
  );
};

