'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Briefcase, Heart, BookOpen, Smile, Award, Clock, Sparkles, Trash2, Check } from 'lucide-react';

const availableIcons = ['Briefcase', 'Heart', 'BookOpen', 'Smile', 'Award', 'Sparkles', 'Clock'];

export default function PilaresPage() {
  const [pillars, setPillars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('Briefcase');
  const [targetWeeklyHours, setTargetWeeklyHours] = useState(15);
  const [targetPercentage, setTargetPercentage] = useState(25);

  useEffect(() => {
    loadPillars();
  }, []);

  const loadPillars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pillars');
      const data = await res.json();
      if (Array.isArray(data)) setPillars(data);
    } catch (err) {
      console.error('Error loading pillars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          color,
          icon,
          targetWeeklyHours: Number(targetWeeklyHours),
          targetPercentage: Number(targetPercentage),
        }),
      });

      if (res.ok) {
        setName('');
        setDescription('');
        setIsModalOpen(false);
        loadPillars();
      }
    } catch (err) {
      console.error('Error creating pillar:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Pilares de Vida
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Define tus áreas clave de desarrollo personal y establece metas de tiempo o porcentaje ideal.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-violet-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Pilar</span>
        </button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: pillar.color }}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: pillar.color }}
                >
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {pillar.targetPercentage}% del tiempo
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{pillar.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {pillar.description || 'Sin descripción'}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-violet-500" />
                <span>Meta semanal:</span>
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{pillar.targetWeeklyHours} horas</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Pillar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h2 className="font-bold text-lg">Crear Nuevo Pilar de Vida</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">Nombre del Pilar *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Creatividad & Arte"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Propósito de este pilar..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-700 p-1 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono">{color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">Meta Semanal (hrs)</label>
                  <input
                    type="number"
                    min="1"
                    value={targetWeeklyHours}
                    onChange={(e) => setTargetWeeklyHours(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">Porcentaje Ideal (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-violet-600/25 transition-all"
                >
                  Crear Pilar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
