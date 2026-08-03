import React from 'react';
import { Language } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenChat: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  unreadCount,
  onOpenNotifications,
  onOpenChat,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#e0e0e0] flex justify-between items-center px-4 sm:px-6 h-16 shadow-[0_4px_15px_rgba(0,0,0,0.1),0_1px_2px_rgba(255,255,255,0.8)] border-b border-white/60 transition-all">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 p-1 flex-shrink-0 flex items-center justify-center neu-raised"
          style={{ borderRadius: '90px' }}
        >
          <img
            className="w-full h-full object-contain"
            src="/logo.svg"
            alt="Moradetec Logo"
          />
        </div>
        <div>
          <h1 className="font-headline-md text-lg sm:text-headline-md font-extrabold text-purple-950 flex items-center gap-1.5 leading-tight">
            Moradetec AI
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Chat Button */}
        <button
          onClick={onOpenChat}
          className="px-3.5 py-1.5 neu-raised text-purple-950 text-xs font-extrabold flex items-center gap-1.5 transition-all active:neu-pressed cursor-pointer"
          style={{ borderRadius: '90px' }}
          title={lang === 'es' ? 'Consultar Agrónomo IA' : 'Consult AI Agronomist'}
        >
          <span className="material-symbols-outlined text-sm text-purple-800">smart_toy</span>
          <span className="hidden sm:inline">{lang === 'es' ? 'Agrónomo IA' : 'AI Assistant'}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={onToggleLang}
          className="px-3 py-1.5 neu-raised text-purple-950 font-extrabold text-xs transition-all active:neu-pressed cursor-pointer"
          style={{ borderRadius: '90px' }}
          title="Cambiar idioma / Toggle Language"
        >
          {lang === 'es' ? 'ES 🇪🇨' : 'EN 🇺🇸'}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 flex items-center justify-center neu-raised text-purple-950 transition-all active:neu-pressed cursor-pointer"
          style={{ borderRadius: '90px' }}
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-purple-900 text-lg">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
