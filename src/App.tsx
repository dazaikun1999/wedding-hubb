/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveScreen,
  AppState,
  ChecklistTask,
  ClientEvent,
  Expense,
  PackageTier,
  QuotationData,
  UserSession,
  Vendor,
} from './types';
import {
  API_URL,
  DEFAULT_SPREADSHEET_URL,
  INITIAL_EVENTS,
  INITIAL_EXPENSES,
  INITIAL_PACKAGES,
  INITIAL_QUOTATION,
  INITIAL_TASKS,
  INITIAL_VENDORS,
  loadUserSession,
  saveUserSession,
  fetchLiveDatabase,
  addEventLive,
  updateEventLive,
  deleteEventLive,
  addExpenseLive,
  updateExpenseLive,
  deleteExpenseLive,
  addVendorLive,
  updateVendorLive,
  deleteVendorLive,
  addTaskLive,
  toggleTaskLive,
  deleteTaskLive,
  updatePackageLive,
  deletePackageLive,
  apiCall,
} from './services/dataService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessengerSphere, TelegramSphere } from './components/TeamChatSpheres';
import { AuthModal } from './components/AuthModal';
import { EventModal } from './components/EventModal';
import { ExpenseModal } from './components/ExpenseModal';
import { VendorModal } from './components/VendorModal';
import { TaskModal } from './components/TaskModal';
import { PackageModal } from './components/PackageModal';
import { SpreadsheetModal } from './components/SpreadsheetModal';
import { SettingsModal } from './components/SettingsModal';
import { OverviewScreen } from './screens/OverviewScreen';
import { ClientsEventsScreen } from './screens/ClientsEventsScreen';
import { BudgetTrackerScreen } from './screens/BudgetTrackerScreen';
import { VendorsScreen } from './screens/VendorsScreen';
import { ChecklistScreen } from './screens/ChecklistScreen';
import { PackagesScreen } from './screens/PackagesScreen';
import { QuotationScreen } from './screens/QuotationScreen';
import { BreakEvenScreen } from './screens/BreakEvenScreen';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const DEFAULT_FALLBACK_STATE: AppState = {
  events: INITIAL_EVENTS,
  expenses: INITIAL_EXPENSES,
  vendors: INITIAL_VENDORS,
  tasks: INITIAL_TASKS,
  packages: INITIAL_PACKAGES,
  quotation: INITIAL_QUOTATION,
  spreadsheetUrl: DEFAULT_SPREADSHEET_URL,
  apiUrl: API_URL,
  isOnline: true,
};

export default function App() {
  // Theme state: Dark mode is default according to specification
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('everafter_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode
  });

  // User session
  const [user, setUser] = useState<UserSession | null>(() => loadUserSession());
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Resilient State: Initialized with fallback seed data so metrics never show 0
  const [appState, setAppState] = useState<AppState>(DEFAULT_FALLBACK_STATE);

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('overview');

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<ClientEvent | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<PackageTier | null>(null);

  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync dark mode class on html and body tags
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('everafter_theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('everafter_theme', 'light');
    }
  }, [isDarkMode]);

  // Initial Hydration Safety
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const remote = await fetchLiveDatabase();
        if (isMounted && remote && remote.events && remote.events.length > 0) {
          setAppState((prev) => ({
            ...prev,
            events: remote.events,
            expenses:
              remote.expenses && remote.expenses.length > 0 ? remote.expenses : prev.expenses,
            vendors:
              remote.vendors && remote.vendors.length > 0 ? remote.vendors : prev.vendors,
            tasks:
              remote.tasks && remote.tasks.length > 0 ? remote.tasks : prev.tasks,
            packages:
              remote.packages && remote.packages.length > 0 ? remote.packages : prev.packages,
            isOnline: true,
          }));
        }
      } catch (err) {
        console.warn('[Sync] Using current state, remote fetch failed:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Theme toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Auth handlers
  const handleAuthSuccess = (newSession: UserSession) => {
    setUser(newSession);
    saveUserSession(newSession);
    setShowAuthModal(false);
    showToast(`Welcome back, ${newSession.displayName}!`);
  };

  const handleSignOut = () => {
    setUser(null);
    saveUserSession(null);
    setShowAuthModal(true);
    showToast('Signed out of wedding studio workspace.');
  };

  // Force sync state and handler for manual synchronization
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleForceSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const remote = await fetchLiveDatabase();
      if (remote && remote.events && remote.events.length > 0) {
        setAppState((prev) => ({
          ...prev,
          events: remote.events,
          expenses: remote.expenses.length > 0 ? remote.expenses : prev.expenses,
          vendors: remote.vendors.length > 0 ? remote.vendors : prev.vendors,
          tasks: remote.tasks.length > 0 ? remote.tasks : prev.tasks,
          packages: remote.packages.length > 0 ? remote.packages : prev.packages,
          isOnline: true,
        }));
        console.log(`[Sync Success] Loaded ${remote.events.length} events from Google Sheets`);
        showToast(`Synchronized ${remote.events.length} events from Google Sheets.`);
      } else {
        console.warn('[Sync Warning] Remote data was empty or fetch failed. Preserving current view.');
        showToast('Preserving current view: remote data returned no events.', 'info');
      }
    } catch (error) {
      console.error('[Force Sync Failed]:', error);
      alert('Could not sync with Google Sheets. Please verify connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Non-destructive optimistic saving for adding new events
  const handleSaveEvent = async (newEventData: ClientEvent) => {
    const isExisting = appState.events.some((e) => e.id === newEventData.id);
    if (isExisting) {
      await handleUpdateEvent(newEventData);
      return;
    }

    // 1. Immediately update UI state so nothing ever disappears
    setAppState((prev) => ({
      ...prev,
      events: [newEventData, ...prev.events],
    }));

    // 2. Dispatch write to Google Sheets in parallel
    try {
      await addEventLive(newEventData);
    } catch (error) {
      console.error('[Add Event Failed]:', error);
      alert('Could not save event to Google Sheets: ' + (error as any).message);
      // Revert only if network call failed
      setAppState((prev) => ({
        ...prev,
        events: prev.events.filter((e) => e.id !== newEventData.id),
      }));
    }
  };

  const handleAddEvent = handleSaveEvent;

  // Non-destructive optimistic editing for updating events
  const handleUpdateEvent = async (updatedEvent: ClientEvent) => {
    // 1. Optimistic UI update
    setAppState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    }));

    // 2. Dispatch to Google Sheets
    try {
      await updateEventLive(updatedEvent);
      console.log('[Event Edit Saved to Sheets]:', updatedEvent.id);
    } catch (error) {
      console.error('[Event Edit Failed]:', error);
      alert('Could not save edit to Google Sheets: ' + (error as any).message);
    }
  };

  // Modal event dispatcher: routes between add and update based on event state
  const handleEventModalSave = async (eventData: ClientEvent) => {
    const isEdit = Boolean(eventToEdit) || appState.events.some((e) => e.id === eventData.id);
    if (isEdit) {
      await handleUpdateEvent(eventData);
      showToast(`Updated celebration details for ${eventData.clientName}.`);
    } else {
      await handleSaveEvent(eventData);
      showToast(`Added new event for ${eventData.clientName}.`);
    }
    setEventToEdit(null);
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const originalEvents = appState.events;
    setAppState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId),
    }));
    showToast('Event removed from pipeline.');
    try {
      await deleteEventLive(eventId);
    } catch (err) {
      console.error('Error deleting event:', err);
      setAppState((prev) => ({
        ...prev,
        events: originalEvents,
      }));
      showToast('Error removing event from cloud database.', 'info');
    }
  };

  // Expense handlers
  const handleUpdateExpense = async (updatedExpense: Expense) => {
    // 1. Optimistic UI update
    setAppState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)),
    }));

    // 2. Dispatch to Google Sheets
    try {
      await updateExpenseLive(updatedExpense);
      console.log('[Expense Edit Saved to Sheets]:', updatedExpense.id);
    } catch (error) {
      console.error('[Expense Edit Failed]:', error);
      alert('Could not save expense edit to Google Sheets: ' + (error as any).message);
    }
  };

  const handleSaveExpense = async (savedExpense: Expense) => {
    const isEdit = Boolean(expenseToEdit) || appState.expenses.some((e) => e.id === savedExpense.id);
    if (isEdit) {
      await handleUpdateExpense(savedExpense);
      showToast(`Updated expense: ${savedExpense.supplierNote}.`);
    } else {
      setAppState((prev) => ({
        ...prev,
        expenses: [savedExpense, ...prev.expenses],
      }));
      showToast(`Recorded expense: ${savedExpense.supplierNote}.`);
      try {
        await addExpenseLive(savedExpense);
      } catch (err) {
        console.error('Error saving expense:', err);
        showToast('Error saving expense to cloud database.', 'info');
      }
    }
    setExpenseToEdit(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setAppState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
    showToast('Expense record deleted.');
    try {
      await deleteExpenseLive(expenseId);
    } catch (err) {
      console.error('Error deleting expense:', err);
      showToast('Error removing expense from cloud database.', 'info');
    }
  };

  // Vendor handlers
  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    // 1. Optimistic UI update
    setAppState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === updatedVendor.id ? updatedVendor : v)),
    }));

    // 2. Dispatch to Google Sheets
    try {
      await updateVendorLive(updatedVendor);
      console.log('[Vendor Edit Saved to Sheets]:', updatedVendor.id);
    } catch (error) {
      console.error('[Vendor Edit Failed]:', error);
      alert('Could not save vendor edit to Google Sheets: ' + (error as any).message);
    }
  };

  const handleSaveVendor = async (savedVendor: Vendor) => {
    const isEdit = Boolean(vendorToEdit) || appState.vendors.some((v) => v.id === savedVendor.id);
    if (isEdit) {
      await handleUpdateVendor(savedVendor);
      showToast(`Saved supplier ${savedVendor.name}.`);
    } else {
      setAppState((prev) => ({
        ...prev,
        vendors: [savedVendor, ...prev.vendors],
      }));
      showToast(`Saved supplier ${savedVendor.name}.`);
      try {
        await addVendorLive(savedVendor);
      } catch (err) {
        console.error('Error saving vendor:', err);
        showToast('Error saving vendor to cloud database.', 'info');
      }
    }
    setVendorToEdit(null);
    setIsVendorModalOpen(false);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    setAppState((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== vendorId),
    }));
    showToast('Vendor removed from directory.');
    try {
      await deleteVendorLive(vendorId);
    } catch (err) {
      console.error('Error deleting vendor:', err);
      showToast('Error removing vendor from cloud database.', 'info');
    }
  };

  // Task handlers
  const handleAddTask = async (newTask: ChecklistTask) => {
    // 1. Optimistic UI update so the task shows immediately
    setAppState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    showToast(`Scheduled task: ${newTask.taskName}.`);
    setIsTaskModalOpen(false);

    // 2. Dispatch to Google Sheets
    try {
      await addTaskLive(newTask);
      console.log('[Task Saved to Cloud]:', newTask.taskName);
    } catch (error) {
      console.error('[Add Task Failed]:', error);
      alert('Could not save task to Google Sheets: ' + (error as any).message);
    }
  };

  const handleSaveTask = handleAddTask;

  const handleToggleTask = async (taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));

    try {
      await toggleTaskLive(taskId);
      console.log('[Task Toggle Saved to Cloud]:', taskId);
    } catch (err) {
      console.error('[Toggle Task Failed]:', err);
      showToast('Error updating task in cloud database.', 'info');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    showToast('Task removed.');

    try {
      await deleteTaskLive(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Error removing task from cloud database.', 'info');
    }
  };

  // Package handlers
  const handleSavePackage = async (savedPkg: PackageTier) => {
    setAppState((prev) => {
      const exists = prev.packages.some((p) => p.id === savedPkg.id);
      const updated = exists
        ? prev.packages.map((p) => (p.id === savedPkg.id ? savedPkg : p))
        : [...prev.packages, savedPkg];
      return { ...prev, packages: updated };
    });
    showToast(`Package tier ${savedPkg.name} saved.`);
    setPackageToEdit(null);

    try {
      await updatePackageLive(savedPkg);
    } catch (err) {
      console.error('[Save Package Failed]:', err);
    }
  };

  const handleUpdatePackage = async (updatedPkg: PackageTier) => {
    setAppState((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)),
    }));
    try {
      await updatePackageLive(updatedPkg);
    } catch (err) {
      console.error('[Update Package Failed]:', err);
    }
  };

  const handleDeletePackage = async (pkgId: string) => {
    setAppState((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== pkgId),
    }));
    showToast('Package tier removed.');

    try {
      await deletePackageLive(pkgId);
    } catch (err) {
      console.error('[Delete Package Failed]:', err);
    }
  };

  const handleSelectPackageForQuotation = (pkg: PackageTier) => {
    setAppState((prev) => ({
      ...prev,
      quotation: {
        ...prev.quotation,
        eventType: pkg.category,
        items: [
          {
            id: `qi-${Date.now()}`,
            description: `${pkg.name} (${pkg.category})`,
            quantity: 1,
            unitPrice: pkg.basePrice,
          },
          ...pkg.inclusions.slice(0, 3).map((inc, i) => ({
            id: `qi-${Date.now()}-${i}`,
            description: inc,
            quantity: 1,
            unitPrice: 0,
          })),
        ],
      },
    }));
    setActiveScreen('quotation-builder');
    showToast(`Loaded ${pkg.name} into Quotation Builder.`);
  };

  const handleSaveSpreadsheetConfig = (
    spreadsheetUrl: string,
    apiUrl: string,
    isOnline: boolean
  ) => {
    setAppState((prev) => ({
      ...prev,
      spreadsheetUrl,
      apiUrl,
      isOnline,
    }));
    fetchLiveDatabase(apiUrl)
      .then((remote) => {
        if (remote && remote.events && remote.events.length > 0) {
          setAppState((prev) => ({
            ...prev,
            events: remote.events,
            expenses: remote.expenses || prev.expenses,
            vendors: remote.vendors || prev.vendors,
            tasks: remote.tasks || prev.tasks,
            packages: remote.packages || prev.packages,
            isOnline: true,
          }));
        }
      })
      .catch((err) => {
        console.warn('[Sync] Could not reload live spreadsheet data:', err);
      });
  };

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}
      style={{
        backgroundColor: isDarkMode ? '#030712' : '#FCF8FA',
        backgroundImage: isDarkMode
          ? 'linear-gradient(rgba(3, 7, 18, 0.55), rgba(3, 7, 18, 0.65)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=80")'
          : 'radial-gradient(at 0% 0%, rgba(254, 205, 211, 0.65) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 228, 230, 0.75) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(254, 226, 226, 0.55) 0px, transparent 60%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Persistent Left Sidebar / Off-canvas Mobile Drawer */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        spreadsheetUrl={appState.spreadsheetUrl}
        onOpenSpreadsheetSettings={() => setIsSpreadsheetModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area in Independently Scrolling Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          activeScreen={activeScreen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          user={user}
          onSignOut={handleSignOut}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onForceSync={handleForceSync}
          isSyncing={isSyncing}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-8 sm:pb-12">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeScreen === 'overview' && (
              <OverviewScreen
                events={appState.events}
                tasks={appState.tasks}
                onAddEvent={() => {
                  setEventToEdit(null);
                  setIsEventModalOpen(true);
                }}
                onEditEvent={(ev) => {
                  setEventToEdit(ev);
                  setIsEventModalOpen(true);
                }}
                setActiveScreen={setActiveScreen}
                onToggleTask={handleToggleTask}
                onUpdateEvent={handleUpdateEvent}
              />
            )}

            {activeScreen === 'clients-events' && (
              <ClientsEventsScreen
                events={appState.events}
                onAddEvent={() => {
                  setEventToEdit(null);
                  setIsEventModalOpen(true);
                }}
                onEditEvent={(ev) => {
                  setEventToEdit(ev);
                  setIsEventModalOpen(true);
                }}
                onDeleteEvent={handleDeleteEvent}
                onUpdateEvent={handleUpdateEvent}
              />
            )}

            {activeScreen === 'budget-tracker' && (
              <BudgetTrackerScreen
                expenses={appState.expenses}
                events={appState.events}
                onAddExpense={() => {
                  setExpenseToEdit(null);
                  setIsExpenseModalOpen(true);
                }}
                onEditExpense={(exp) => {
                  setExpenseToEdit(exp);
                  setIsExpenseModalOpen(true);
                }}
                onDeleteExpense={handleDeleteExpense}
                onUpdateExpense={handleUpdateExpense}
              />
            )}

            {activeScreen === 'vendors' && (
              <VendorsScreen
                vendors={appState.vendors}
                onAddVendor={() => {
                  setVendorToEdit(null);
                  setIsVendorModalOpen(true);
                }}
                onEditVendor={(v) => {
                  setVendorToEdit(v);
                  setIsVendorModalOpen(true);
                }}
                onDeleteVendor={handleDeleteVendor}
                onUpdateVendor={handleUpdateVendor}
              />
            )}

            {activeScreen === 'checklist' && (
              <ChecklistScreen
                tasks={appState.tasks}
                events={appState.events}
                onAddTask={() => setIsTaskModalOpen(true)}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeScreen === 'packages' && (
              <PackagesScreen
                packages={appState.packages}
                onAddPackage={() => {
                  setPackageToEdit(null);
                  setIsPackageModalOpen(true);
                }}
                onEditPackage={(pkg) => {
                  setPackageToEdit(pkg);
                  setIsPackageModalOpen(true);
                }}
                onUpdatePackage={handleUpdatePackage}
                onDeletePackage={handleDeletePackage}
                onSelectForQuotation={handleSelectPackageForQuotation}
              />
            )}

            {activeScreen === 'quotation-builder' && (
              <QuotationScreen
                packages={appState.packages}
                quotation={appState.quotation}
                setQuotation={(newQuote) => {
                  setAppState((prev) => ({
                    ...prev,
                    quotation: typeof newQuote === 'function' ? newQuote(prev.quotation) : newQuote,
                  }));
                }}
                events={appState.events}
                showToast={showToast}
              />
            )}

            {activeScreen === 'break-even' && (
              <BreakEvenScreen />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal || !user}
        onSuccess={handleAuthSuccess}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleEventModalSave}
        allEvents={appState.events}
        eventToEdit={eventToEdit}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSave={handleSaveExpense}
        events={appState.events}
        expenseToEdit={expenseToEdit}
      />

      <VendorModal
        isOpen={isVendorModalOpen}
        onClose={() => {
          setIsVendorModalOpen(false);
          setVendorToEdit(null);
        }}
        onSave={handleSaveVendor}
        vendorToEdit={vendorToEdit}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleAddTask}
        events={appState.events}
        currentUser={user}
      />

      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => {
          setIsPackageModalOpen(false);
          setPackageToEdit(null);
        }}
        onSave={handleSavePackage}
        packageToEdit={packageToEdit}
      />

      <SpreadsheetModal
        isOpen={isSpreadsheetModalOpen}
        onClose={() => setIsSpreadsheetModalOpen(false)}
        spreadsheetUrl={appState.spreadsheetUrl}
        apiUrl={appState.apiUrl}
        isOnline={appState.isOnline}
        onSaveConfig={handleSaveSpreadsheetConfig}
        showToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={user}
        onUserUpdate={(updatedUser) => {
          setUser(updatedUser);
        }}
        showToast={showToast}
        apiUrl={appState.apiUrl}
        spreadsheetUrl={appState.spreadsheetUrl}
        isOnline={appState.isOnline}
        onSaveSpreadsheetConfig={handleSaveSpreadsheetConfig}
      />

      {/* Floating Quick-Action Dock on Mobile */}
      <div className="fixed bottom-6 right-5 z-40 flex items-center gap-3 lg:hidden">
        <MessengerSphere />
        <TelegramSphere />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white text-xs font-semibold rounded-2xl shadow-2xl border border-white/80 dark:border-white/10 animate-in slide-in-from-bottom-4 duration-200 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
