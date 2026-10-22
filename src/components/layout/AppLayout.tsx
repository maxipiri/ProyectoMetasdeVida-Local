'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, CheckSquare, BarChart3, Sparkles, Layers, Menu, X } from 'lucide-react';
import PlaniDrawer from '@/components/assistant/PlaniDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isPlaniOpen, setIsPlaniOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Pilares de Vida', href: '/pilares', icon: Layers },
    { name: 'Tareas & Agenda', href: '/tareas', icon: CheckSquare },
    { name: 'Métricas', href: '/metricas', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Planius AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Agenda Inteligente</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Plani Assistant Button in Sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsPlaniOpen(true)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hablar con Plani AI</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Planius AI
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaniOpen(true)}
            className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plani</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm flex flex-col pt-16 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl space-y-2 border border-gray-200 dark:border-gray-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm ${
                    isActive ? 'bg-violet-600 text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>

      {/* Plani AI Drawer */}
      <PlaniDrawer isOpen={isPlaniOpen} onClose={() => setIsPlaniOpen(false)} />
    </div>
  );
}
