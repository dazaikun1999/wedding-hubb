/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Plus, Trash2, Pencil, ShieldAlert } from 'lucide-react';
import { ClientEvent, EventStatus } from '../types';
import {
  formatBDT,
  formatDateDisplay,
  getMonogram,
  updateEventLive,
} from '../services/dataService';

interface ClientsEventsScreenProps {
  events: ClientEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: ClientEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent?: (event: ClientEvent) => void;
}

export const ClientsEventsScreen: React.FC<ClientsEventsScreenProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All statuses');
  const [eventToDelete, setEventToDelete] = useState<ClientEvent | null>(null);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All statuses' || ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'Booked':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Booked
          </span>
        );
      case 'Planning':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            Planning
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Completed
          </span>
        );
      case 'Inquiry':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            Inquiry
          </span>
        );
    }
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clients & Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Keep client details, dates, packages and payments organized.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEvent}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add event</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div className="font-bold text-sm text-slate-900 dark:text-white">
            All events
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search client or event..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All statuses">All statuses</option>
              <option value="Planning">Planning</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Inquiry">Inquiry</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl -mx-2 px-2 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead>
              <tr className="bg-white/40 text-slate-500 border-b border-slate-200/60 text-xs font-semibold dark:bg-slate-950/40 dark:text-slate-400 dark:border-b dark:border-white/5 uppercase">
                <th className="py-3 px-3 font-semibold">Client / Event</th>
                <th className="py-3 px-3 font-semibold">Event Date</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Package (BDT)</th>
                <th className="py-3 px-3 font-semibold">Paid (BDT)</th>
                <th className="py-3 px-3 font-semibold">Outstanding (BDT)</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Notes</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                    No matching events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const isCompleted = ev.status === 'Completed';
                  const packageTotal = Number(
                    (ev as any).customPrice || ev.packageValue || (ev as any).packagePrice || 0
                  );
                  const amountCollected = Number((ev as any).amountPaid || ev.paidAmount || 0);
                  const outstandingAmount = Math.max(0, packageTotal - amountCollected);

                  return (
                    <tr
                      key={ev.id}
                      className="border-b border-slate-200/40 dark:border-b dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 text-red-600 dark:text-red-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {getMonogram(ev.clientName)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {ev.clientName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {ev.eventType}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                        {formatDateDisplay(ev.date)}
                      </td>

                      <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                        {ev.location}
                      </td>

                      <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white">
                        {formatBDT(ev.packageValue)}
                      </td>

                      <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                        {formatBDT(ev.paidAmount)}
                      </td>

                      <td className="py-4 px-3">
                        {outstandingAmount > 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-tight">
                            ৳{outstandingAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400/90 font-medium text-xs flex items-center gap-1">
                            ৳0 <span className="text-[10px] text-emerald-700 dark:text-emerald-500 font-normal">(Cleared)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        <select
                          value={ev.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as EventStatus;
                            const updatedEvent = { ...ev, status: newStatus };
                            // 1. Update UI state immediately
                            if (onUpdateEvent) {
                              onUpdateEvent(updatedEvent);
                            }
                            // 2. Dispatch live update to Google Sheets
                            try {
                              await updateEventLive(updatedEvent);
                            } catch (err) {
                              console.error('[Status Update Failed]:', err);
                            }
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-colors outline-none ${
                            ev.status === 'Inquiry'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400'
                              : ev.status === 'Planning'
                              ? 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-400'
                              : ev.status === 'Booked'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400'
                              : 'bg-teal-500/10 text-teal-600 border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-400'
                          }`}
                        >
                          <option value="Inquiry" className="bg-slate-900 text-white">Inquiry</option>
                          <option value="Planning" className="bg-slate-900 text-white">Planning</option>
                          <option value="Booked" className="bg-slate-900 text-white">Booked</option>
                          <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                        </select>
                      </td>

                      <td className="py-4 px-3 max-w-[200px]">
                        {ev.notes ? (
                          <div
                            title={ev.notes}
                            className="text-xs text-slate-500 dark:text-slate-400 font-normal max-w-[200px] truncate cursor-help"
                          >
                            {ev.notes}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 italic text-xs">
                            No notes
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditEvent(ev)}
                            title="Edit Event"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Status Protection Rule: Completed weddings cannot be deleted */}
                          {!isCompleted ? (
                            <button
                              type="button"
                              onClick={() => setEventToDelete(ev)}
                              title="Delete Event"
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span
                              title="Completed celebrations are archived historical records and cannot be deleted."
                              className="text-[10px] text-slate-400 italic px-2 py-1 select-none"
                            >
                              Archived
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Event Record?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{eventToDelete.clientName}</strong> from the client pipeline? This will remove all associated project milestones.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
