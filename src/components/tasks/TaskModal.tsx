'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Flag, Layers } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialDate?: string;
  pillars: any[];
}

export default function TaskModal({ isOpen, onClose, onSaved, initialDate, pillars }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillarId, setPillarId] = useState(pillars[0]?.id || '');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [plannedMinutes, setPlannedMinutes] = useState(30);
  const [priority, setPriority] = useState('MEDIUM');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pillars.length > 0 && !pillarId) {
      setPillarId(pillars[0].id);
    }
    if (initialDate) {
      setDate(initialDate);
    }
  }, [pillars, initialDate]);

  if (!isOpen) return null;

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, newSubtask.trim()]);
    setNewSubtask('');
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pillarId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          pillarId,
          date,
          startTime,
          plannedMinutes: Number(plannedMinutes),
          priority,
          subtasks: subtasks.map((st, idx) => ({ title: st, completed: false, order: idx + 1 })),
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setSubtasks([]);
        onSaved();
        onClose();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5" />
            <h2 className="font-bold text-lg">Nueva Tarea / Evento</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Título de la Tarea *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Sesión de enfoque en código..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Pilar de Vida *
              </label>
              <select
                value={pillarId}
                onChange={(e) => setPillarId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              >
                {pillars.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              >
                <option value="LOW">🟢 Baja</option>
                <option value="MEDIUM">🟡 Media</option>
                <option value="HIGH">🟠 Alta</option>
                <option value="URGENT">🔴 Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Hora Inicio</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Duración (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={plannedMinutes}
                onChange={(e) => setPlannedMinutes(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Descripción / Notas
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none resize-none"
            />
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Subtareas / Checklist
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } }}
                placeholder="Añadir subtarea..."
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {subtasks.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-lg text-xs">
                    <span>{idx + 1}. {st}</span>
                    <button type="button" onClick={() => removeSubtask(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
