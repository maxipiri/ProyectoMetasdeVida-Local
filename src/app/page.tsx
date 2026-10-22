'use client';

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, Calendar as CalendarIcon, Sparkles, AlertCircle, Play, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskModal from '@/components/tasks/TaskModal';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, pillarsRes, metricsRes] = await Promise.all([
        fetch(`/api/tasks?date=${selectedDate}`),
        fetch('/api/pillars'),
        fetch('/api/metrics'),
      ]);

      const tasksData = await tasksRes.json();
      const pillarsData = await pillarsRes.json();
      const metricsData = await metricsRes.json();

      if (Array.isArray(tasksData)) setTasks(tasksData);
      if (Array.isArray(pillarsData)) setPillars(pillarsData);
      if (metricsData) setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (task: any) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const actualMins = newStatus === 'COMPLETED' && task.actualMinutes === 0 ? task.plannedMinutes : task.actualMinutes;

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actualMinutes: actualMins }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const toggleSubtask = async (sub: any) => {
    try {
      const res = await fetch('/api/subtasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, completed: !sub.completed }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error updating subtask:', err);
    }
  };

  const changeDay = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalCount = tasks.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Date Navigator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard de Productividad
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualiza tu agenda diaria, bloques de tiempo y avance en tus pilares de vida.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => changeDay(-1)}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 text-xs font-semibold flex items-center space-x-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-violet-600" />
              <span>{selectedDate}</span>
            </div>
            <button
              onClick={() => changeDay(1)}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-violet-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Progreso del Día</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{completedCount}/{totalCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">({completionPct}%)</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiempo Planeado</span>
            <Clock className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold">{metrics?.summary?.totalPlannedHours || 0}h</div>
          <p className="text-xs text-gray-400 mt-1">Horas estimadas en tareas</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiempo Real Invertido</span>
            <Play className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold">{metrics?.summary?.totalActualHours || 0}h</div>
          <p className="text-xs text-indigo-600 font-medium mt-1">Registrado en time-logs</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice de Alineación</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold">{metrics?.summary?.alignmentScore || 100}%</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Balance de pilares</p>
        </div>
      </div>

      {/* Main Grid: Timeblocking & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeblocking Visual Agenda (2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Bloques del Día (Timeblocking)</h2>
            <span className="text-xs font-medium text-gray-400">Vista Horaria</span>
          </div>

          <div className="space-y-3">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((hour) => {
              const matchingTask = tasks.find((t) => t.startTime && t.startTime.startsWith(hour.substring(0, 2)));

              return (
                <div key={hour} className="flex items-start space-x-4 group">
                  <div className="w-16 text-xs font-semibold text-gray-400 pt-1 text-right">{hour}</div>
                  <div className="flex-1 min-h-[48px] border-l-2 border-gray-200 dark:border-gray-800 pl-4 pb-3">
                    {matchingTask ? (
                      <div
                        className={`p-3.5 rounded-xl border transition-all shadow-sm ${
                          matchingTask.status === 'COMPLETED'
                            ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-70'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                        }`}
                        style={{ borderLeftColor: matchingTask.pillarColor || '#3B82F6', borderLeftWidth: '5px' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: matchingTask.pillarColor || '#3B82F6' }}
                            />
                            <span className="text-xs font-bold text-gray-500 uppercase">{matchingTask.pillarName}</span>
                            <span className="text-xs text-gray-400">• {matchingTask.plannedMinutes} min</span>
                          </div>
                          <button
                            onClick={() => toggleTaskStatus(matchingTask)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              matchingTask.status === 'COMPLETED'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className={`font-semibold text-sm mt-1.5 ${matchingTask.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
                          {matchingTask.title}
                        </h4>
                        {matchingTask.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{matchingTask.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center text-xs text-gray-400 py-1 hover:text-violet-600 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        <span>+ Bloque libre (clic para programar)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks & Subtasks Quick Panel (1 column) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Tareas & Subtareas</h2>
            <span className="text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-lg">
              {tasks.length} tareas
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[550px]">
            {tasks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-medium">No hay tareas para esta fecha.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 text-xs bg-violet-600 text-white px-3 py-2 rounded-xl font-medium"
                >
                  Crear primera tarea
                </button>
              </div>
            )}

            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-violet-500'
                      }`}
                    >
                      {task.status === 'COMPLETED' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`font-semibold text-sm ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pl-7">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: task.pillarColor || '#3B82F6' }}
                  >
                    {task.pillarName}
                  </span>
                  <span className="text-xs text-gray-400">{task.plannedMinutes} min</span>
                </div>

                {/* Subtasks List */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="pl-7 pt-1 space-y-1">
                    {task.subtasks.map((sub: any) => (
                      <div key={sub.id} className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={sub.completed === 1 || sub.completed === true}
                          onChange={() => toggleSubtask(sub)}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className={sub.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
        initialDate={selectedDate}
        pillars={pillars}
      />
    </div>
  );
}
