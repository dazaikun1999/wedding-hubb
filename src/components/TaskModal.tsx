/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckSquare, Calendar, User } from 'lucide-react';
import { ChecklistTask, ClientEvent, TaskPriority, UserSession } from '../types';
import { getRegisteredUsers } from '../services/dataService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ChecklistTask) => void;
  events: ClientEvent[];
  currentUser?: UserSession | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  events,
  currentUser,
}) => {
  const [taskName, setTaskName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || 'general');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [assignedTo, setAssignedTo] = useState('hasib');

  const teamMembers = React.useMemo(() => {
    const defaultList = ['hasib', 'emon', 'armeen'];
    try {
      const registered = getRegisteredUsers();
      registered.forEach((u: any) => {
        const uname = u?.username?.toLowerCase()?.trim();
        if (uname && !defaultList.includes(uname)) {
          defaultList.push(uname);
        }
      });
    } catch {
      // fallback to default list
    }
    return defaultList;
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let authorUsername = currentUser?.username;
    if (!authorUsername) {
      try {
        const stored = localStorage.getItem('everafter_studio_user_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          authorUsername = parsed?.username || parsed?.displayName;
        }
      } catch {
        // fallback
      }
    }

    const assignedBy = (authorUsername || 'hasib').replace(/^@/, '');
    const cleanAssignedTo = assignedTo.replace(/^@/, '');

    const matchedEvent = events.find((ev) => ev.id === selectedEventId);
    const eventName = matchedEvent ? matchedEvent.clientName : 'General Studio Operations';
    const eventId = matchedEvent ? matchedEvent.id : (selectedEventId || 'general');

    const newTask: ChecklistTask = {
      id: `tsk-${Date.now()}`,
      eventId,
      eventName,
      taskName: taskName.trim() || 'Untitled Task',
      dueDate,
      priority,
      assignedTo: cleanAssignedTo,
      assignedBy,
      completed: false,
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-red-600" />
              <span>Add planning task</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Schedule milestone, client approval or supplier deadline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Description *
            </label>
            <input
              type="text"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Approve floral mood board, Confirm final guest count"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Wedding Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.clientName} ({ev.eventType})
                  </option>
                ))}
                <option value="general">General Studio Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Due Date *</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>Assigned To</span>
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors interactive-spring cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-sm shadow-red-600/20 interactive-spring cursor-pointer"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
