'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, Clock, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

interface PlaniDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export default function PlaniDrawer({ isOpen, onClose, onTaskUpdated }: PlaniDrawerProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleSend = async (customText?: string, actionType?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !actionType) return;

    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, action: actionType }),
      });
      const data = await res.json();
      if (data.userMessage && data.assistantMessage) {
        setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (err) {
      console.error('Error sending message to Plani:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Plani AI</h2>
            <p className="text-xs text-violet-200">Asistente personal de productividad</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="p-3 bg-violet-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-1.5">
        <button
          onClick={() => handleSend('Tengo 45 min libres, ¿qué debería hacer?', 'free-time')}
          className="text-xs bg-white dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-gray-600 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-1.5 rounded-full font-medium flex items-center space-x-1 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>⏰ 45 min libres</span>
        </button>
        <button
          onClick={() => handleSend('Ayúdame a reorganizar mi día', 'reorganize')}
          className="text-xs bg-white dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-gray-600 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-1.5 rounded-full font-medium flex items-center space-x-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>🔄 Reorganizar día</span>
        </button>
        <button
          onClick={() => handleSend('Hazme un resumen diario de mi jornada', 'summary')}
          className="text-xs bg-white dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-gray-600 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-1.5 rounded-full font-medium flex items-center space-x-1 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>📊 Resumen diario</span>
        </button>
        <button
          onClick={() => handleSend('¿Qué pilar tengo descuidado?', 'pillars')}
          className="text-xs bg-white dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-gray-600 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2.5 py-1.5 rounded-full font-medium flex items-center space-x-1 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>🎯 Pilares descuidados</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400">
            <Bot className="w-12 h-12 mx-auto text-violet-500 mb-3 opacity-80" />
            <p className="font-semibold text-gray-800 dark:text-gray-200">¡Hola! Soy Plani</p>
            <p className="text-sm mt-1">Pregúntame cualquier duda sobre tus tareas o pulsa los botones rápidos para optimizar tu agenda.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-700/50 whitespace-pre-wrap'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-500 flex items-center space-x-2">
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe a Plani..."
          className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
