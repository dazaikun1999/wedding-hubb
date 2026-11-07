/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Heart,
  Clock,
  Check,
  Plus,
  Download,
  Calendar,
  ChevronRight,
  Pencil,
  CheckSquare,
} from 'lucide-react';
import { ActiveScreen, ClientEvent, ChecklistTask } from '../types';
import {
  formatBDT,
  formatDateBadge,
  formatDateDisplay,
  getMonogram,
  exportEventsToCSV,
} from '../services/dataService';

interface OverviewScreenProps {
  events: ClientEvent[];
  tasks: ChecklistTask[];
  onAddEvent: () => void;
  onEditEvent: (event: ClientEvent) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onToggleTask?: (taskId: string) => void;
  onUpdateEvent?: (event: ClientEvent) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  events,
  tasks,
  onAddEvent,
  onEditEvent,
  setActiveScreen,
  onToggleTask,
  onUpdateEvent,
}) => {
  // Day string in uppercase, e.g. "MONDAY, YOUR WORKSPACE AT A GLANCE"
  const today = new Date();
  const dayName = today
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();

  // Metrics calculations
  const activeEventsCount = events.filter(
    (e) => e.status === 'Planning' || e.status === 'Booked'
  ).length;

  const bookedRevenue = events.reduce((sum, e) => sum + e.packageValue, 0);
  const totalPaid = events.reduce((sum, e) => sum + e.paidAmount, 0);
  const outstandingBalance = bookedRevenue - totalPaid;
  const openTasksCount = tasks.filter((t) => !t.completed).length;

  // Pipeline counts for chart
  const inquiryCount = events.filter((e) => e.status === 'Inquiry').length;
  const planningCount = events.filter((e) => e.status === 'Planning').length;
  const bookedCount = events.filter((e) => e.status === 'Booked').length;
  const completedCount = events.filter((e) => e.status === 'Completed').length;
  const maxPipelineVal = Math.max(1, inquiryCount, planningCount, bookedCount, completedCount);

  // Sorted upcoming events (future/upcoming celebrations first)
  const upcomingEvents = [...events]
    .filter((e) => e.status !== 'Completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  // Pending tasks for quick action (active milestones needing attention)
  const pendingTasks = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // Status badge styling
  const renderStatusBadge = (status: string) => {
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

  // Priority badge styling
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-50 text-red-600 dark:bg-rose-950/60 dark:text-red-400 shrink-0">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 shrink-0">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Subheader & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-white uppercase">
            {dayName}, YOUR WORKSPACE AT A GLANCE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Wedding overview
          </h1>
          <p className="text-xs text-slate-600 dark:text-white mt-1">
            Make every celebration feel effortless.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportEventsToCSV(events)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onAddEvent}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add event</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Metric Cards (2x2 on mobile, 4-col on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Metric 1: Active events */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 rounded-2xl relative cursor-default"
          style={{ animationDelay: '40ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-white tracking-wide uppercase truncate">
              Active events
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 text-red-500 flex items-center justify-center shrink-0">
              <Heart className="w-3 h-3 text-red-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-bold drop-shadow-sm tracking-tight truncate">
            {activeEventsCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-200 font-normal mt-1 truncate">
            Events in your pipeline
          </div>
        </div>

        {/* Metric 2: Booked revenue */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 rounded-2xl relative cursor-default"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-white tracking-wide uppercase truncate">
              Booked revenue
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 text-red-500 flex items-center justify-center text-xs font-bold shrink-0">
              ৳
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-bold drop-shadow-sm tracking-tight truncate">
            {formatBDT(bookedRevenue)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-200 font-normal mt-1 truncate">
            Total client package value
          </div>
        </div>

        {/* Metric 3: Outstanding */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 rounded-2xl relative cursor-default"
          style={{ animationDelay: '160ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-white tracking-wide uppercase truncate">
              Outstanding
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 text-red-500 flex items-center justify-center shrink-0">
              <Clock className="w-3 h-3 text-red-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-bold drop-shadow-sm tracking-tight truncate">
            {formatBDT(outstandingBalance)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-200 font-normal mt-1 truncate">
            Payments still to collect
          </div>
        </div>

        {/* Metric 4: Open tasks */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 rounded-2xl relative cursor-default"
          style={{ animationDelay: '220ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-white tracking-wide uppercase truncate">
              Open tasks
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 text-red-500 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-red-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-bold drop-shadow-sm tracking-tight truncate">
            {openTasksCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-200 font-normal mt-1 truncate">
            Items to complete
          </div>
        </div>
      </div>

      {/* Row 2: 3-Column Balanced Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 (Left): Compact Event Pipeline Card (Box 1) */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between"
          style={{ animationDelay: '280ms' }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Event pipeline
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-red-600 dark:text-red-400">
                Live summary
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-200">
              Client events by current status
            </p>
          </div>

          {/* Compact Vertical Bar Chart */}
          <div className="my-6 h-48 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-slate-200/50 dark:border-white/5 pb-3">
            {/* Inquiry */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {inquiryCount}
              </span>
              <div
                style={{ height: `${Math.max(8, (inquiryCount / maxPipelineVal) * 100)}%` }}
                className="w-7 sm:w-8 mx-auto bg-rose-600 rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 shadow-sm"
              ></div>
              <span className="text-xs font-medium text-slate-700 dark:text-white text-center truncate w-full">
                Inquiry
              </span>
            </div>

            {/* Planning */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {planningCount}
              </span>
              <div
                style={{ height: `${Math.max(8, (planningCount / maxPipelineVal) * 100)}%` }}
                className="w-7 sm:w-8 mx-auto bg-rose-600 rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 shadow-sm"
              ></div>
              <span className="text-xs font-medium text-slate-700 dark:text-white text-center truncate w-full">
                Planning
              </span>
            </div>

            {/* Booked */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {bookedCount}
              </span>
              <div
                style={{ height: `${Math.max(8, (bookedCount / maxPipelineVal) * 100)}%` }}
                className="w-7 sm:w-8 mx-auto bg-rose-600 rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 shadow-sm"
              ></div>
              <span className="text-xs font-medium text-slate-700 dark:text-white text-center truncate w-full">
                Booked
              </span>
            </div>

            {/* Completed */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {completedCount}
              </span>
              <div
                style={{ height: `${Math.max(8, (completedCount / maxPipelineVal) * 100)}%` }}
                className="w-7 sm:w-8 mx-auto bg-rose-600 rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 shadow-sm"
              ></div>
              <span className="text-xs font-medium text-slate-700 dark:text-white text-center truncate w-full">
                Completed
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-200 flex items-center justify-between pt-1">
            <span>Inquiry to completed</span>
            <span>{events.length} events</span>
          </div>
        </div>

        {/* Column 2 (Center): Upcoming Events Card (Box 2) */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between"
          style={{ animationDelay: '340ms' }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Upcoming events
              </h3>
              <button
                type="button"
                onClick={() => setActiveScreen('clients-events')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-200 mb-4">
              Next celebrations on your calendar
            </p>

            {/* Events list */}
            {upcomingEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-300 italic">
                No upcoming celebrations scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => {
                  const badge = formatDateBadge(ev.date);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEditEvent(ev)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group gap-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Red date box */}
                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/40 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-extrabold text-red-600 leading-none">
                            {badge.day}
                          </span>
                          <span className="text-[9px] font-bold text-red-600 tracking-wider mt-0.5 leading-none">
                            {badge.month}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                            {ev.clientName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-200 mt-0.5 truncate">
                            {ev.eventType} · {ev.location}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">{renderStatusBadge(ev.status)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 3 (Right): New Pending Tasks Card (Box 3) */}
        <div
          className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between"
          style={{ animationDelay: '400ms' }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Pending tasks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveScreen('checklist')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-200 mb-4">
              Active milestones needing attention
            </p>

            {/* Tasks list */}
            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-300 italic">
                All milestones completed! No pending tasks.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/40 transition-colors group gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleTask?.(task.id)}
                        title="Mark task as complete"
                        className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-red-600 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all shrink-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {task.completed && <Check className="w-3 h-3 text-red-600" />}
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {task.taskName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-200 font-medium mt-0.5 truncate">
                          Due: {formatDateDisplay(task.dueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div
                        title={`Assigned to ${task.assignedTo}`}
                        className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 uppercase shadow-xs"
                      >
                        {task.assignedTo ? task.assignedTo.charAt(0).toUpperCase() : '?'}
                      </div>
                      {renderPriorityBadge(task.priority)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Client Projects Table */}
      <div
        className="animate-tetris-card bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm dark:bg-black/40 dark:backdrop-blur-3xl dark:border dark:border-white/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-white/30 dark:hover:bg-black/50 transition-all duration-300 p-6 rounded-2xl"
        style={{ animationDelay: '460ms' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent client projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-200 mt-0.5">
              Track progress, budget and payment status
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveScreen('clients-events')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Manage events
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/40 text-slate-500 border-b border-slate-200/60 text-xs font-semibold dark:bg-slate-950/40 dark:text-white dark:border-b dark:border-white/5 uppercase tracking-wider">
                <th className="py-3 px-3 font-semibold text-slate-500 dark:text-white">Client / Event</th>
                <th className="py-3 px-3 font-semibold text-slate-500 dark:text-white">Event Date</th>
                <th className="py-3 px-3 font-semibold text-slate-500 dark:text-white">Package Value</th>
                <th className="py-3 px-3 font-semibold text-slate-500 dark:text-white">Paid</th>
                <th className="py-3 px-3 font-semibold text-slate-500 dark:text-white">Status</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-500 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {events.map((ev) => {
                const paidPercent =
                  ev.packageValue > 0
                    ? Math.min(100, Math.round((ev.paidAmount / ev.packageValue) * 100))
                    : 0;

                return (
                  <tr
                    key={ev.id}
                    className="border-b border-slate-200/40 dark:border-b dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 text-red-600 dark:text-red-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {getMonogram(ev.clientName)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {ev.clientName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-300">
                            {ev.eventType}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {formatDateDisplay(ev.date)}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {formatBDT(ev.packageValue)}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 max-w-[140px]">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${paidPercent}%` }}
                            className="h-full bg-red-600 rounded-full"
                          ></div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300 w-8">
                          {paidPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">{renderStatusBadge(ev.status)}</td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onEditEvent(ev)}
                        title="Edit Event"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
