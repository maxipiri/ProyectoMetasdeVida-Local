'use client';

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, Calendar, Filter, Trash2, Check, AlertCircle, Play } from 'lucide-react';
import TaskModal from '@/components/tasks/TaskModal';

export default function TareasPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPillar, setFilterPillar] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, pillarsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/pillars'),
      ]);
      const tasksData = await tasksRes.json();
      const pillarsData = await pillarsRes.json();
      if (Array.isArray(tasksData)) setTasks(tasksData);
      if (Array.isArray(pillarsData)) setPillars(pillarsData);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (task: any) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterPillar !== 'ALL' && t.pillarId !== filterPillar) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Gestión de Tareas y Subtareas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra tus pendientes, asígnales fecha, hora y asócialas a tu pilar correspondiente.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-violet-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold uppercase text-gray-500">Filtrar por Pilar:</span>
          <select
            value={filterPillar}
            onChange={(e) => setFilterPillar(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="ALL">Todos los pilares</option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase text-gray-500">Estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendientes</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completadas</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-60" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">No se encontraron tareas</p>
            <p className="text-xs mt-1">Crea una nueva tarea o cambia los filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-violet-500'
                    }`}
                  >
                    {task.status === 'COMPLETED' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: task.pillarColor || '#3B82F6' }}
                      >
                        {task.pillarName}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">{task.date}</span>
                      {task.startTime && <span className="text-xs text-gray-400">• {task.startTime}</span>}
                    </div>
                    <h3 className={`font-semibold text-base ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                    )}

                    {/* Subtasks summary */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="flex items-center space-x-3 pt-1 text-xs text-gray-500">
                        <span>
                          Subtareas: {task.subtasks.filter((st: any) => st.completed).length} / {task.subtasks.length} completadas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                    {task.plannedMinutes} min
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadData}
        pillars={pillars}
      />
    </div>
  );
}
