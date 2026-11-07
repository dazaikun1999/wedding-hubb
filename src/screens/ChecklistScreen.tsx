/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Check, Filter } from 'lucide-react';
import { ChecklistTask, ClientEvent, TaskPriority, TeamMember } from '../types';
import { formatDateDisplay } from '../services/dataService';

interface ChecklistScreenProps {
  tasks: ChecklistTask[];
  events: ClientEvent[];
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ChecklistScreen: React.FC<ChecklistScreenProps> = ({
  tasks,
  events,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [eventFilter, setEventFilter] = useState('All events');
  const [assigneeFilter, setAssigneeFilter] = useState('All members');
  const [taskToDelete, setTaskToDelete] = useState<ChecklistTask | null>(null);

  const openTasksCount = tasks.filter((t) => !t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    const matchesEvent =
      eventFilter === 'All events' || t.eventName === eventFilter;
    const matchesAssignee =
      assigneeFilter === 'All members' || t.assignedTo === assigneeFilter;
    return matchesEvent && matchesAssignee;
  });

  const renderPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Low
          </span>
        );
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Task List
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage deadlines and keep every event on track.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add task</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(225,29,72,0.08)] dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:border-white/20 transition-all duration-300 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tasks & deadlines
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-red-600 dark:text-red-400">
              {openTasksCount} open
            </span>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>

            {/* Event Filter */}
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="All events">All events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.clientName}>
                  {ev.clientName}
                </option>
              ))}
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="All members">All members</option>
              <option value="hasib">hasib</option>
              <option value="emon">emon</option>
              <option value="armeen">armeen</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl -mx-2 px-2 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead>
              <tr className="bg-white/40 text-slate-500 border-b border-slate-200/60 text-xs font-semibold dark:bg-slate-950/40 dark:text-slate-400 dark:border-b dark:border-white/5 uppercase">
                <th className="py-3 px-3 w-12 font-semibold">Done</th>
                <th className="py-3 px-3 font-semibold">Task</th>
                <th className="py-3 px-3 font-semibold">Assigned To</th>
                <th className="py-3 px-3 font-semibold">Assigned By</th>
                <th className="py-3 px-3 font-semibold">Event</th>
                <th className="py-3 px-3 font-semibold">Due Date</th>
                <th className="py-3 px-3 font-semibold">Priority</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No tasks match the active filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`border-b border-slate-200/40 dark:border-b dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors ${
                      task.completed ? 'opacity-60 bg-slate-50/40 dark:bg-slate-800/30' : ''
                    }`}
                  >
                    <td className="py-4 px-3">
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                          task.completed
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-red-500'
                        }`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`font-medium ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.taskName}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center uppercase shadow-xs">
                          {(task.assignedTo || 'U').charAt(0).toUpperCase()}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 lowercase">
                          {task.assignedTo ? task.assignedTo.replace(/^@/, '') : 'unassigned'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-xs text-slate-400 font-medium">
                        @{task.assignedBy ? task.assignedBy.replace(/^@/, '') : 'system'}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {task.eventName}
                    </td>

                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {formatDateDisplay(task.dueDate)}
                    </td>

                    <td className="py-4 px-3">{renderPriorityBadge(task.priority)}</td>

                    <td className="py-4 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setTaskToDelete(task)}
                        title="Delete Task"
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Task?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Delete task: <strong className="text-slate-800 dark:text-slate-200">{taskToDelete.taskName}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
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
