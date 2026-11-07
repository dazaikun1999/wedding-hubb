/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Calendar, MapPin, DollarSign, Tag, Info } from 'lucide-react';
import { ClientEvent, EventStatus } from '../types';
import { checkDateCollision, formatBDT } from '../services/dataService';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ClientEvent) => void;
  allEvents: ClientEvent[];
  eventToEdit?: ClientEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  allEvents,
  eventToEdit,
}) => {
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [packageValue, setPackageValue] = useState<number | string>(100000);
  const [paidAmount, setPaidAmount] = useState<number | string>(50000);
  const [status, setStatus] = useState<EventStatus>('Planning');
  const [notes, setNotes] = useState('');
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setClientName(eventToEdit.clientName);
      setEventType(eventToEdit.eventType);
      setDate(eventToEdit.date);
      setLocation(eventToEdit.location);
      setPackageValue(eventToEdit.packageValue);
      setPaidAmount(eventToEdit.paidAmount);
      setStatus(eventToEdit.status);
      setNotes(eventToEdit.notes || '');
    } else {
      setClientName('');
      setEventType('Wedding Reception');
      setDate(new Date().toISOString().slice(0, 10));
      setLocation('Dhaka');
      setPackageValue(120000);
      setPaidAmount(40000);
      setStatus('Planning');
      setNotes('');
    }
    setCollisionWarning(null);
  }, [eventToEdit, isOpen]);

  // Live date collision check
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const { hasCollision, collidingEvent } = checkDateCollision(
      allEvents,
      newDate,
      eventToEdit?.id,
      status
    );
    if (hasCollision && collidingEvent) {
      setCollisionWarning(
        `Date Collision: An active wedding celebration is already scheduled for this date (${collidingEvent.clientName} - ${collidingEvent.eventType}).`
      );
    } else {
      setCollisionWarning(null);
    }
  };

  const handleStatusChange = (newStatus: EventStatus) => {
    setStatus(newStatus);
    const { hasCollision, collidingEvent } = checkDateCollision(
      allEvents,
      date,
      eventToEdit?.id,
      newStatus
    );
    if (hasCollision && collidingEvent) {
      setCollisionWarning(
        `Date Collision: An active wedding celebration is already scheduled for this date (${collidingEvent.clientName} - ${collidingEvent.eventType}).`
      );
    } else {
      setCollisionWarning(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check collision rule
    const { hasCollision, collidingEvent } = checkDateCollision(
      allEvents,
      date,
      eventToEdit?.id,
      status
    );

    if (hasCollision && collidingEvent) {
      setCollisionWarning(
        `Date Collision: An active wedding celebration is already scheduled for this date.`
      );
      return;
    }

    const payload: ClientEvent = {
      id: eventToEdit ? eventToEdit.id : `ev-${Date.now()}`,
      clientName: clientName.trim() || 'Untitled Client',
      eventType,
      date,
      location: location.trim() || 'Dhaka',
      packageValue: Number(packageValue) || 0,
      paidAmount: Number(paidAmount) || 0,
      status,
      notes: notes.trim(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg mx-3 sm:mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {eventToEdit ? 'Edit client event' : 'Add new event'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {eventToEdit ? 'Update details, budget or status' : 'Create a new wedding event pipeline record'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Collision Warning Banner */}
        {collisionWarning && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{collisionWarning}</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                EverAfter restricts multiple simultaneous celebrations on the same date to safeguard studio staffing and floral logistics.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Client / Couple Names *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sara & Imran"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Type
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. Wedding Reception"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Event Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gulshan, Dhaka"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Package Value (BDT ৳) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={packageValue}
                onChange={(e) => setPackageValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paid Amount (BDT ৳)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Status
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as EventStatus)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Inquiry">Inquiry</option>
              <option value="Planning">Planning</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Client Notes & Special Requests
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stage decor preferences, floral tunnel requirements, photography timeline nuances, vegetarian menu ratio..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-3 text-xs focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors interactive-spring cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(collisionWarning)}
              className={`w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all interactive-spring min-h-[44px] ${
                collisionWarning
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800 cursor-pointer shadow-red-600/20'
              }`}
            >
              {eventToEdit ? 'Save changes' : 'Add event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
