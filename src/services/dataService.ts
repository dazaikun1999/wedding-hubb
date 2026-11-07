/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppState,
  ChecklistTask,
  ClientEvent,
  EventStatus,
  Expense,
  ExpenseCategory,
  PackageStatus,
  PackageTier,
  QuotationData,
  TaskPriority,
  UserSession,
  Vendor,
  VendorReliability,
} from '../types';

export const API_URL =
  'https://script.google.com/macros/s/AKfycbw5Rk6O-yjjn8Dy5Vejgo15-KM8XhHM7k7gC57c_GxB_pzRiljkl3nTir1vHxxVLzD6rw/exec';
export const DEFAULT_SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1VV1GVeRSDmVnuVKmPKWeOikcS6mk3LRwrF77SeUYfSY/edit';
export const MASTER_KEY = 'weddingisinheat69';

const STORAGE_KEY = 'everafter_studio_state_v1';
const USER_KEY = 'everafter_studio_user_v1';

export const INITIAL_EVENTS: ClientEvent[] = [
  {
    id: 'ev-1',
    clientName: 'Sara & Imran',
    eventType: 'Intimate Wedding',
    date: '2026-12-12',
    location: 'Dhanmondi, Dhaka',
    packageValue: 125000,
    packagePrice: 125000,
    paidAmount: 50000,
    amountPaid: 50000,
    status: 'Planning',
    notes: 'Bride requested pastel pink and cream palette.',
  },
  {
    id: 'ev-2',
    clientName: 'Nusrat & Rafi',
    eventType: 'Wedding Reception',
    date: '2026-11-22',
    location: 'Dhaka',
    packageValue: 180000,
    packagePrice: 180000,
    paidAmount: 90000,
    amountPaid: 90000,
    status: 'Planning',
    notes: 'Stage backdrop with fairy light canopy.',
  },
  {
    id: 'ev-3',
    clientName: 'Maliha & Tanvir',
    eventType: 'Holud Ceremony',
    date: '2026-11-08',
    location: 'Uttara, Dhaka',
    packageValue: 85000,
    packagePrice: 85000,
    paidAmount: 51000,
    amountPaid: 51000,
    status: 'Booked',
    notes: 'Traditional yellow marigold and brass lamps.',
  },
  {
    id: 'ev-4',
    clientName: 'Anika & Fahim',
    eventType: 'Engagement',
    date: '2026-10-31',
    location: 'Gulshan, Dhaka',
    packageValue: 45000,
    packagePrice: 45000,
    paidAmount: 45000,
    amountPaid: 45000,
    status: 'Booked',
    notes: 'Outdoor garden cocktail setup.',
  },
  {
    id: 'ev-5',
    clientName: 'Farzana & Sami',
    eventType: 'Wedding',
    date: '2026-09-15',
    location: 'Dhaka',
    packageValue: 150000,
    packagePrice: 150000,
    paidAmount: 150000,
    amountPaid: 150000,
    status: 'Completed',
    notes: 'Celebration wrapped up successfully.',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-10-22',
    eventName: 'Nusrat & Rafi',
    category: 'Decoration',
    supplierNote: 'Advance to decorator',
    supplierName: 'Advance to decorator',
    amount: 25000,
    receiptLink: 'https://drive.google.com/sample-receipt-1',
    receiptDriveUrl: 'https://drive.google.com/sample-receipt-1',
    notes: 'Paid 50% deposit for floral truss.',
  },
  {
    id: 'exp-2',
    date: '2026-10-21',
    eventName: 'Maliha & Tanvir',
    category: 'Photography',
    supplierNote: 'Booking advance',
    supplierName: 'Booking advance',
    amount: 12000,
    receiptLink: 'https://drive.google.com/sample-receipt-2',
    receiptDriveUrl: 'https://drive.google.com/sample-receipt-2',
    notes: 'Golden Frame Studio 2-person crew advance.',
  },
  {
    id: 'exp-3',
    date: '2026-10-20',
    eventName: 'Anika & Fahim',
    category: 'Flowers',
    supplierNote: 'Floral samples',
    supplierName: 'Floral samples',
    amount: 4500,
    receiptLink: 'https://drive.google.com/sample-receipt-3',
    receiptDriveUrl: 'https://drive.google.com/sample-receipt-3',
    notes: 'Fresh Holland rose and baby breath samples.',
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Petal & Petals',
    category: 'Florist',
    phone: '01700-000001',
    email: '',
    rateNote: 'From ৳8,000',
    reliability: 'Verified',
    reliabilityStatus: 'Verified',
    notes: 'Premium imported Dutch florals, requires 50% booking deposit.',
  },
  {
    id: 'ven-2',
    name: 'Golden Frame Studio',
    category: 'Photography',
    phone: '',
    email: 'studio@example.com',
    rateNote: 'From ৳15,000',
    reliability: 'Verified',
    reliabilityStatus: 'Verified',
    notes: 'Primary contact Hasibul: provides 4K video with drone coverage.',
  },
  {
    id: 'ven-3',
    name: 'Dream Decor BD',
    category: 'Decoration',
    phone: '01700-000003',
    email: '',
    rateNote: 'Custom quotation',
    reliability: 'Review needed',
    reliabilityStatus: 'Review needed',
    notes: 'Stage backdrop lighting specialist. Needs advance inventory check.',
  },
];

export const INITIAL_TASKS: ChecklistTask[] = [
  {
    id: 'tsk-1',
    eventId: 'ev-2',
    taskName: 'Confirm final guest count',
    eventName: 'Nusrat & Rafi',
    dueDate: '2026-11-05',
    priority: 'High',
    assignedTo: 'hasib',
    assignedBy: 'emon',
    completed: false,
  },
  {
    id: 'tsk-2',
    eventId: 'ev-3',
    taskName: 'Approve floral mood board',
    eventName: 'Maliha & Tanvir',
    dueDate: '2026-10-29',
    priority: 'High',
    assignedTo: 'armeen',
    assignedBy: 'hasib',
    completed: false,
  },
  {
    id: 'tsk-3',
    eventId: 'ev-4',
    taskName: 'Confirm photography timeline',
    eventName: 'Anika & Fahim',
    dueDate: '2026-10-27',
    priority: 'Medium',
    assignedTo: 'emon',
    assignedBy: 'hasib',
    completed: false,
  },
  {
    id: 'tsk-4',
    eventId: 'ev-5',
    taskName: 'Send post-event feedback form',
    eventName: 'Farzana & Sami',
    dueDate: '2026-09-18',
    priority: 'Low',
    assignedTo: 'hasib',
    assignedBy: 'hasib',
    completed: true,
    completedAt: '2026-09-19T10:00:00Z',
  },
];

export const INITIAL_PACKAGES: PackageTier[] = [
  {
    id: 'pkg-1',
    name: 'Elegance Tier',
    category: 'Full Wedding',
    basePrice: 180000,
    inclusions: [
      'Custom stage backdrop and lounge styling',
      'Warm ambient fairy lighting canopy',
      'Fresh floral entryway and table centerpieces',
      '2-Day comprehensive photography package',
      'Dedicated wedding day coordinator',
    ],
    description: 'Our most popular all-inclusive wedding styling and coordination tier.',
    status: 'Active',
  },
  {
    id: 'pkg-2',
    name: 'Royal Luxury',
    category: 'Luxury Wedding',
    basePrice: 350000,
    inclusions: [
      'Grand royal stage architecture with carved arches',
      'Exotic imported floral arrangements and chandeliers',
      'Cinematic 4K videography with drone aerials',
      'VIP bride and groom suite styling',
      'Four dedicated on-site logistics coordinators',
      'Personalized guest seating and signage design',
    ],
    description: 'Bespoke high-end celebration design for large venues and luxury ballrooms.',
    status: 'Active',
  },
  {
    id: 'pkg-3',
    name: 'Minimalist Intimate',
    category: 'Intimate Wedding',
    basePrice: 85000,
    inclusions: [
      'Minimalist geometric wooden backdrop',
      'Warm filament and candle lighting setup',
      'Lead photographer for 5 hours',
      'Bridal bouquet and groom boutonnieres',
      'Curated celebration timeline and schedule',
    ],
    description: 'Thoughtfully designed for intimate gatherings and cozy rooftop venues.',
    status: 'Active',
  },
  {
    id: 'pkg-4',
    name: 'Holud Special',
    category: 'Holud Ceremony',
    basePrice: 65000,
    inclusions: [
      'Traditional marigold floral arch and drapes',
      'Low floor seating with vibrant regional cushions',
      'Festive Mehendi photo booth corner',
      'Festive fairy lights and brass lantern accents',
    ],
    description: 'Vibrant, colorful cultural staging for authentic Holud celebrations.',
    status: 'Active',
  },
];

export const INITIAL_QUOTATION: QuotationData = {
  clientName: '',
  eventType: 'Wedding Reception',
  eventDate: '2026-11-22',
  validUntil: '2026-11-15',
  discountPercent: 0,
  taxPercent: 0,
  notes: '50% advance to confirm the booking. Balance due before the event date.',
  items: [
    {
      id: 'qi-1',
      description: 'Decoration & styling',
      quantity: 1,
      unitPrice: 0,
    },
    {
      id: 'qi-2',
      description: 'Event coordination',
      quantity: 1,
      unitPrice: 0,
    },
  ],
};

// ---------------------------------------------------------------------------
// CENTRALIZED ASYNCHRONOUS API DISPATCHER (ZERO PREFLIGHT CORS BLOCKS)
// ---------------------------------------------------------------------------
export async function apiCall(
  action: string,
  payload: any = {},
  apiUrl?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const targetUrl = apiUrl || API_URL;
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, payload }),
    });

    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response received from Google Sheets.');
    }

    let result: any = {};
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON received from Google Sheets backend.');
    }

    if (result.status === 'error') {
      throw new Error(result.message || 'Database operation returned error.');
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error(`[API ${action} Error]:`, err.message);
    return { success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// PURE CLOUD DATABASE HYDRATION (HTTP GET VIA APPS SCRIPT doGet)
// ---------------------------------------------------------------------------
export async function fetchLiveDatabase(apiUrl?: string): Promise<AppState | null> {
  const targetUrl = apiUrl || API_URL;
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
      },
    });

    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response received from Google Sheets.');
    }

    const result = JSON.parse(text);
    console.log('[Live Database Response]:', result);

    if (result.status !== 'success' || !result.data) {
      throw new Error(result.message || 'Invalid database response from Google Sheets');
    }

    const data = result.data;

    // Filter out blank spreadsheet rows and format events
    const seenEventIds = new Set<string>();
    const events: ClientEvent[] = (data.events || [])
      .filter((row: any) => (row.client_names || row.clientName) && String(row.client_names || row.clientName).trim() !== '')
      .map((row: any, idx: number) => {
        let evId = String(row.event_id || row.id || `ev-${idx + 1}`).trim();
        if (!evId || seenEventIds.has(evId)) {
          evId = `ev-${idx + 1}-${Date.now()}`;
        }
        seenEventIds.add(evId);
        const pkgPrice = Number(row.custom_price ?? row.packagePrice ?? row.packageValue ?? 0);
        const paid = Number(row.amount_paid ?? row.amountPaid ?? row.paidAmount ?? 0);

        return {
          id: evId,
          clientName: String(row.client_names || row.clientName || 'Untitled Client'),
          eventType: String(row.event_type || row.eventType || 'Wedding Reception'),
          date: cleanDateStr(row.date || ''),
          location: String(row.location || 'Dhaka'),
          packageId: String(row.package_id || 'PKG_CUSTOM'),
          packageName: String(row.package_name || row.packageName || 'Custom Tier'),
          packageValue: pkgPrice,
          packagePrice: pkgPrice,
          paidAmount: paid,
          amountPaid: paid,
          status: (row.status || 'Planning') as EventStatus,
          assignedTo: String(row.assigned_to || row.assignedTo || 'hasib'),
          notes: String(row.notes || ''),
          createdAt: String(row.created_at || ''),
        };
      });

    // Filter out blank spreadsheet rows and format expenses
    const seenExpenseIds = new Set<string>();
    const expenses: Expense[] = (data.budget || data.expenses || [])
      .filter((row: any) => row.amount && Number(row.amount) > 0)
      .map((row: any, idx: number) => {
        let expId = String(row.expense_id || row.id || `exp-${idx + 1}`).trim();
        if (!expId || seenExpenseIds.has(expId)) {
          expId = `exp-${idx + 1}-${Date.now()}`;
        }
        seenExpenseIds.add(expId);
        const note = String(row.supplier_name || row.supplierName || row.supplier_note || row.supplierNote || '');

        return {
          id: expId,
          eventId: String(row.event_id || ''),
          eventName: String(row.eventName || ''),
          date: cleanDateStr(row.date || ''),
          category: (row.category || 'Misc') as ExpenseCategory,
          supplierName: note,
          supplierNote: note,
          amount: Number(row.amount || 0),
          receiptDriveUrl: String(row.receipt_drive_url || row.receiptLink || ''),
          receiptLink: String(row.receipt_drive_url || row.receiptLink || ''),
          notes: String(row.notes || ''),
          createdAt: String(row.created_at || ''),
        };
      });

    // Filter out blank spreadsheet rows and format vendors
    const seenVendorIds = new Set<string>();
    const vendors: Vendor[] = (data.vendors || [])
      .filter((row: any) => row.name && String(row.name).trim() !== '')
      .map((row: any, idx: number) => {
        let venId = String(row.vendor_id || row.id || `ven-${idx + 1}`).trim();
        if (!venId || seenVendorIds.has(venId)) {
          venId = `ven-${idx + 1}-${Date.now()}`;
        }
        seenVendorIds.add(venId);

        return {
          id: venId,
          name: String(row.name || ''),
          category: String(row.category || 'Decoration'),
          phone: String(row.phone || ''),
          email: String(row.email || ''),
          rateNote: String(row.rate_note || row.rateNote || ''),
          reliabilityStatus: (row.reliability_status || row.reliability || 'Verified') as VendorReliability,
          reliability: (row.reliability_status || row.reliability || 'Verified') as VendorReliability,
          notes: String(row.notes || ''),
        };
      });

    // Filter out blank spreadsheet rows and format tasks
    const seenTaskIds = new Set<string>();
    const tasks: ChecklistTask[] = (data.tasks || data.checklist || [])
      .filter((row: any) => row.task_name && String(row.task_name).trim() !== '')
      .map((row: any, idx: number) => {
        let tskId = String(row.task_id || row.id || `tsk-${idx + 1}`).trim();
        if (!tskId || seenTaskIds.has(tskId)) {
          tskId = `tsk-${idx + 1}-${Date.now()}`;
        }
        seenTaskIds.add(tskId);

        return {
          id: tskId,
          eventId: String(row.event_id || ''),
          eventName: String(row.eventName || ''),
          taskName: String(row.task_name || row.taskName || ''),
          assignedTo: String(row.assigned_to || row.assignedTo || 'hasib'),
          assignedBy: String(row.created_by || row.assignedBy || 'hasib'),
          dueDate: cleanDateStr(row.due_date || row.dueDate || ''),
          priority: (row.priority || 'Medium') as TaskPriority,
          completed: Boolean(
            row.is_completed === true ||
              row.is_completed === 'TRUE' ||
              row.completed === true ||
              row.completed === 'TRUE'
          ),
          completedAt: String(row.completed_at || row.completedAt || ''),
        };
      });

    // Format packages
    const seenPackageIds = new Set<string>();
    const packages: PackageTier[] = (data.packages || []).map((row: any, idx: number) => {
      let pkgId = String(row.package_id || row.id || `pkg-${idx + 1}`).trim();
      if (!pkgId || seenPackageIds.has(pkgId)) {
        pkgId = `pkg-${idx + 1}-${Date.now()}`;
      }
      seenPackageIds.add(pkgId);

      let inclusions: string[] = [];
      if (Array.isArray(row.inclusions)) {
        inclusions = row.inclusions;
      } else if (typeof row.inclusions_json === 'string') {
        inclusions = row.inclusions_json.split(', ').filter(Boolean);
      } else if (typeof row.inclusions === 'string') {
        inclusions = row.inclusions.split('\n').filter(Boolean);
      }

      return {
        id: pkgId,
        name: String(row.package_name || row.name || ''),
        category: String(row.category || 'Standard'),
        basePrice: Number(row.base_price || row.basePrice || 0),
        inclusions,
        description: String(row.description || ''),
        status: (row.status || 'Active') as PackageStatus,
      };
    });

    const liveState: AppState = {
      events: events.length > 0 ? events : INITIAL_EVENTS,
      expenses: expenses.length > 0 ? expenses : INITIAL_EXPENSES,
      vendors: vendors.length > 0 ? vendors : INITIAL_VENDORS,
      tasks: tasks.length > 0 ? tasks : INITIAL_TASKS,
      packages: packages.length > 0 ? packages : INITIAL_PACKAGES,
      quotation: INITIAL_QUOTATION,
      spreadsheetUrl: DEFAULT_SPREADSHEET_URL,
      apiUrl: API_URL,
      isOnline: true,
    };

    saveStateToStorage(liveState);
    return liveState;
  } catch (error) {
    console.error('[fetchLiveDatabase Error]:', error);
    return null;
  }
}

export const fetchRemoteData = fetchLiveDatabase;

// ---------------------------------------------------------------------------
// CLOUD CRUD OPERATIONS (WRITES DIRECTLY TO GOOGLE SHEETS)
// ---------------------------------------------------------------------------

export async function addEvent(
  newEvent: ClientEvent
): Promise<{ success: boolean; data?: any; event: ClientEvent; error?: string }> {
  const result = await apiCall('ADD_EVENT', {
    id: newEvent.id,
    event_id: newEvent.id,
    client_names: newEvent.clientName,
    clientName: newEvent.clientName,
    event_type: newEvent.eventType,
    date: newEvent.date,
    location: newEvent.location,
    package_name: newEvent.packageName || '',
    custom_price: newEvent.packagePrice ?? newEvent.packageValue ?? 0,
    amount_paid: newEvent.amountPaid ?? newEvent.paidAmount ?? 0,
    status: newEvent.status,
    assigned_to: newEvent.assignedTo || 'hasib',
    notes: newEvent.notes || '',
  });

  return { success: result.success, event: newEvent, data: result.data, error: result.error };
}

export const apiAddEvent = addEvent;
export const addEventLive = addEvent;

export async function updateEvent(
  updatedEvent: ClientEvent
): Promise<{ success: boolean; data?: any; error?: string }> {
  return await apiCall('UPDATE_EVENT', {
    event_id: updatedEvent.id,
    id: updatedEvent.id,
    client_names: updatedEvent.clientName,
    clientName: updatedEvent.clientName,
    event_type: updatedEvent.eventType,
    date: updatedEvent.date,
    location: updatedEvent.location,
    package_name: updatedEvent.packageName || '',
    custom_price: updatedEvent.packagePrice ?? updatedEvent.packageValue ?? 0,
    amount_paid: updatedEvent.amountPaid ?? updatedEvent.paidAmount ?? 0,
    status: updatedEvent.status,
    assigned_to: updatedEvent.assignedTo || 'hasib',
    notes: updatedEvent.notes || '',
  });
}

export const apiUpdateEvent = updateEvent;
export const updateEventLive = updateEvent;

export async function deleteEventLive(id: string): Promise<void> {
  await apiCall('DELETE_EVENT', { id, event_id: id });
}

export async function addExpenseLive(expense: Expense): Promise<void> {
  await apiCall('ADD_EXPENSE', {
    expense_id: expense.id,
    id: expense.id,
    event_id: expense.eventId || expense.eventName || '',
    date: expense.date,
    category: expense.category,
    supplier_name: expense.supplierName || expense.supplierNote || '',
    amount: expense.amount,
    receipt_drive_url: expense.receiptDriveUrl || expense.receiptLink || '',
    notes: expense.notes || '',
  });
}

export async function updateExpense(
  updatedExpense: Expense
): Promise<{ success: boolean; data?: any; error?: string }> {
  return await apiCall('UPDATE_EXPENSE', {
    expense_id: updatedExpense.id,
    id: updatedExpense.id,
    event_id: updatedExpense.eventId || updatedExpense.eventName || '',
    date: updatedExpense.date,
    category: updatedExpense.category,
    supplier_name: updatedExpense.supplierName || updatedExpense.supplierNote || '',
    amount: updatedExpense.amount,
    receipt_drive_url: updatedExpense.receiptDriveUrl || updatedExpense.receiptLink || '',
    notes: updatedExpense.notes || '',
  });
}

export const updateExpenseLive = updateExpense;

export async function deleteExpenseLive(id: string): Promise<void> {
  await apiCall('DELETE_EXPENSE', { id, expense_id: id });
}

export async function addVendorLive(vendor: Vendor): Promise<void> {
  await apiCall('ADD_VENDOR', {
    vendor_id: vendor.id,
    id: vendor.id,
    name: vendor.name,
    category: vendor.category,
    phone: vendor.phone,
    email: vendor.email,
    rate_note: vendor.rateNote,
    reliability_status: vendor.reliabilityStatus || vendor.reliability || 'Verified',
    notes: vendor.notes || '',
  });
}

export async function updateVendor(
  updatedVendor: Vendor
): Promise<{ success: boolean; data?: any; error?: string }> {
  return await apiCall('UPDATE_VENDOR', {
    vendor_id: updatedVendor.id,
    id: updatedVendor.id,
    name: updatedVendor.name,
    category: updatedVendor.category,
    phone: updatedVendor.phone,
    email: updatedVendor.email,
    rate_note: updatedVendor.rateNote,
    reliability_status: updatedVendor.reliabilityStatus || updatedVendor.reliability || 'Verified',
    notes: updatedVendor.notes || '',
  });
}

export const updateVendorLive = updateVendor;

export async function deleteVendorLive(id: string): Promise<void> {
  await apiCall('DELETE_VENDOR', { id, vendor_id: id });
}

export async function addTaskLive(task: ChecklistTask): Promise<void> {
  await apiCall('ADD_TASK', {
    task_id: task.id,
    id: task.id,
    event_id: task.eventId || '',
    task_name: task.taskName,
    assigned_to: task.assignedTo.replace(/^@/, '').trim(),
    created_by: task.assignedBy.replace(/^@/, '').trim(),
    due_date: task.dueDate,
    priority: task.priority,
  });
}

export async function toggleTaskLive(id: string): Promise<void> {
  await apiCall('TOGGLE_TASK', { id, task_id: id });
}

export async function deleteTaskLive(id: string): Promise<void> {
  await apiCall('DELETE_TASK', { id, task_id: id });
}

export async function updatePackageLive(pkg: PackageTier): Promise<void> {
  await apiCall('UPDATE_PACKAGE', {
    package_id: pkg.id,
    id: pkg.id,
    package_name: pkg.name,
    name: pkg.name,
    category: pkg.category,
    base_price: pkg.basePrice,
    basePrice: pkg.basePrice,
    inclusions: pkg.inclusions,
    status: pkg.status,
  });
}

export async function deletePackageLive(id: string): Promise<void> {
  await apiCall('DELETE_PACKAGE', { id, package_id: id });
}

export async function updateUserProfile(payload: any): Promise<any> {
  const result = await apiCall('UPDATE_USER_PROFILE', payload);
  if (!result.success) {
    throw new Error(result.error || 'Failed to update credentials in database');
  }
  if (result.data && result.data.user) {
    saveUserSession(result.data.user);
  }
  return result.data;
}

export const updateUserProfileLive = updateUserProfile;

// ---------------------------------------------------------------------------
// AUTHENTICATION & LOGIN DISPATCHER
// ---------------------------------------------------------------------------
export async function loginUserLive(username: string, password: string): Promise<any> {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    throw new Error('Please enter both username and password.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      action: 'LOGIN',
      payload: {
        username: cleanUsername,
        password: cleanPassword,
      },
    }),
  });

  const text = await response.text();
  if (!text || text.trim() === '') {
    throw new Error('Empty response from Google Sheets. Verify deployment access.');
  }

  let result: any = {};
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON response received from Google Sheets backend.');
  }

  if (result.status === 'error' || !result.user) {
    throw new Error(result.message || 'Invalid username or password.');
  }

  const verifiedUser = {
    id: result.user.id || 'USR_001',
    username: result.user.username || cleanUsername,
    displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    email: result.user.email || `${cleanUsername}@everafter.studio`,
    initial: cleanUsername.charAt(0).toUpperCase(),
    role: result.user.role || 'Team Member',
  };

  setActiveSession(verifiedUser);
  return verifiedUser;
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const user = await loginUserLive(username, password);
    return { success: true, user };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Invalid credentials. Please verify your username and password.',
    };
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  masterKey: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  const cleanUser = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  if (masterKey !== MASTER_KEY) {
    return {
      success: false,
      error: 'Access Denied: Invalid Master Security Key. Contact Hasib, Emon, or Armeen for authorization.',
    };
  }

  if (!cleanUser) {
    return { success: false, error: 'Username is required.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const result = await apiCall('REGISTER', {
    username: cleanUser,
    email: cleanEmail || `${cleanUser}@everafter.studio`,
    password,
    masterKey,
  });

  if (!result.success) {
    return { success: false, error: result.error || 'Registration failed.' };
  }

  const session = {
    username: cleanUser,
    displayName: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
    email: cleanEmail || `${cleanUser}@everafter.studio`,
    initial: cleanUser.charAt(0).toUpperCase(),
    role: 'Team Member',
  };

  saveRegisteredUser(session);
  saveUserSession(session);
  return { success: true, user: session };
}

// ---------------------------------------------------------------------------
// REGISTERED USERS LOCAL STORAGE HELPERS
// ---------------------------------------------------------------------------
const REGISTERED_USERS_KEY = 'everafter_registered_accounts_v1';

export function getRegisteredUsers(): any[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading registered users:', err);
  }
  return [];
}

export function saveRegisteredUser(account: any): void {
  try {
    const users = getRegisteredUsers();
    users.push(account);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving registered user:', err);
  }
}

// ---------------------------------------------------------------------------
// SESSION & UTILITY HELPERS
// ---------------------------------------------------------------------------
export function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        events: parsed.events || INITIAL_EVENTS,
        expenses: parsed.expenses || INITIAL_EXPENSES,
        vendors: parsed.vendors || INITIAL_VENDORS,
        tasks: parsed.tasks || INITIAL_TASKS,
        packages: parsed.packages || INITIAL_PACKAGES,
        quotation: parsed.quotation || INITIAL_QUOTATION,
        spreadsheetUrl: DEFAULT_SPREADSHEET_URL,
        apiUrl: API_URL,
        isOnline: true,
      };
    }
  } catch {
    // fallback
  }

  return {
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
}

export function saveStateToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state cache:', err);
  }
}

export function loadUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function saveUserSession(user: any): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Error updating session:', err);
  }
}

export function getActiveSession(): any {
  return loadUserSession() || { id: 'USR_001', username: 'hasib', role: 'Lead Architect' };
}

export function setActiveSession(user: any): void {
  saveUserSession(user);
}

export function clearActiveSession(): void {
  saveUserSession(null);
}

export function formatBDT(amount: number): string {
  const rounded = Math.round(Number(amount) || 0);
  return '৳' + rounded.toLocaleString('en-US');
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateBadge(dateStr: string): { day: string; month: string } {
  if (!dateStr) return { day: '--', month: '---' };
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return { day: '--', month: '---' };
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    };
  } catch {
    return { day: '--', month: '---' };
  }
}

export function getMonogram(name: string): string {
  if (!name) return 'EA';
  const clean = name.replace(/&/g, ' ').replace(/\s+/g, ' ').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function checkDateCollision(
  events: ClientEvent[],
  date: string,
  excludeEventId?: string,
  statusToCheck?: string
): { hasCollision: boolean; collidingEvent?: ClientEvent } {
  if (!date) return { hasCollision: false };

  if (statusToCheck && (statusToCheck === 'Completed' || statusToCheck === 'Inquiry')) {
    return { hasCollision: false };
  }

  const collidingEvent = events.find(
    (e) =>
      e.id !== excludeEventId &&
      e.date === date &&
      (e.status === 'Planning' || e.status === 'Booked')
  );

  return {
    hasCollision: Boolean(collidingEvent),
    collidingEvent,
  };
}

export function exportEventsToCSV(events: ClientEvent[]): void {
  const headers = [
    'Event ID',
    'Client / Couple',
    'Event Type',
    'Date',
    'Location',
    'Package Value (BDT)',
    'Paid Amount (BDT)',
    'Outstanding (BDT)',
    'Status',
    'Notes',
  ];

  const rows = events.map((e) => [
    `"${e.id}"`,
    `"${e.clientName.replace(/"/g, '""')}"`,
    `"${e.eventType.replace(/"/g, '""')}"`,
    `"${e.date}"`,
    `"${e.location.replace(/"/g, '""')}"`,
    e.packageValue,
    e.paidAmount,
    e.packageValue - e.paidAmount,
    `"${e.status}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `everafter_events_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function cleanDateStr(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return trimmed;
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().slice(0, 10);
  }
  return String(val);
}