/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventStatus = 'Inquiry' | 'Planning' | 'Booked' | 'Completed';

export interface ClientEvent {
  id: string;
  clientName: string;
  eventType: string;
  date: string; // YYYY-MM-DD
  location: string;
  packageValue: number;
  paidAmount: number;
  status: EventStatus;
  notes?: string;
  packageName?: string;
  packagePrice?: number;
  amountPaid?: number;
  assignedTo?: string;
  packageId?: string;
  createdAt?: string;
}

export type ExpenseCategory =
  | 'Decoration'
  | 'Photography'
  | 'Flowers'
  | 'Venue'
  | 'Catering'
  | 'Logistics'
  | 'Misc';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  eventName: string;
  category: ExpenseCategory;
  supplierNote: string;
  amount: number;
  receiptLink?: string;
  notes?: string;
  eventId?: string;
  supplierName?: string;
  receiptDriveUrl?: string;
  createdAt?: string;
}

export type VendorReliability = 'Verified' | 'Review needed';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  rateNote: string;
  reliability: VendorReliability;
  notes?: string;
  reliabilityStatus?: VendorReliability;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TeamMember = 'hasib' | 'emon' | 'armeen';

export interface ChecklistTask {
  id: string;
  eventId: string;
  eventName?: string;
  taskName: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
}

export type PackageStatus = 'Active' | 'Draft' | 'Archived';

export interface PackageTier {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  inclusions: string[];
  description: string;
  status: PackageStatus;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationData {
  clientName: string;
  eventType: string;
  eventDate: string;
  validUntil: string;
  discountPercent: number;
  taxPercent: number;
  notes: string;
  items: QuotationItem[];
}

export interface UserSession {
  id?: string;
  username: string;
  displayName: string;
  email: string;
  initial: string;
  role: 'admin' | 'planner';
}

export type ActiveScreen =
  | 'overview'
  | 'clients-events'
  | 'budget-tracker'
  | 'vendors'
  | 'checklist'
  | 'packages'
  | 'quotation-builder'
  | 'break-even';

export interface AppState {
  events: ClientEvent[];
  expenses: Expense[];
  vendors: Vendor[];
  tasks: ChecklistTask[];
  packages: PackageTier[];
  quotation: QuotationData;
  spreadsheetUrl: string;
  apiUrl: string;
  isOnline: boolean;
}
