'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function MetricasPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      if (data) setMetrics(data);
    } catch (err) {
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = metrics?.pillarMetrics?.map((pm: any) => ({
    name: pm.name,
    Planeado: pm.plannedHours,
    Real: pm.actualHours,
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Métricas de Alineación
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compara el tiempo planeado vs. el real en cada pilar de vida y evalúa tu índice de alineación personal.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice de Alineación</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold">{metrics?.summary?.alignmentScore || 100}%</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Apego a metas de pilares</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Planeado</span>
            <Clock className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-bold">{metrics?.summary?.totalPlannedHours || 0}h</div>
          <p className="text-xs text-gray-400 mt-1">Horas estimadas totales</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Real Invertido</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold">{metrics?.summary?.totalActualHours || 0}h</div>
          <p className="text-xs text-indigo-600 font-medium mt-1">Registrado en time-logs</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasa de Cumplimiento</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold">{metrics?.summary?.completionRate || 0}%</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Tareas completadas</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="font-bold text-lg mb-6">Comparativa: Horas Planeadas vs. Reales por Pilar</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="Planeado" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Real" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <h2 className="font-bold text-lg mb-4">Desglose Detallado por Pilar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-400">
                <th className="py-3 px-4">Pilar</th>
                <th className="py-3 px-4">Meta Semanal</th>
                <th className="py-3 px-4">Horas Planeadas</th>
                <th className="py-3 px-4">Horas Reales</th>
                <th className="py-3 px-4">Tareas Asociadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              {metrics?.pillarMetrics?.map((pm: any) => (
                <tr key={pm.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td className="py-3.5 px-4 font-semibold flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pm.color }} />
                    <span>{pm.name}</span>
                  </td>
                  <td className="py-3.5 px-4">{pm.targetWeeklyHours} hrs</td>
                  <td className="py-3.5 px-4 font-medium text-violet-600">{pm.plannedHours} hrs</td>
                  <td className="py-3.5 px-4 font-medium text-indigo-600">{pm.actualHours} hrs</td>
                  <td className="py-3.5 px-4 text-gray-500">{pm.tasksCount} tareas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
