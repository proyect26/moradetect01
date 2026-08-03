import React from 'react';
import { NavTab, Language } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, lang }) => {
  const navItems: { id: NavTab; icon: string; labelEs: string; labelEn: string }[] = [
    { id: 'dashboard', icon: 'dashboard', labelEs: 'Panel', labelEn: 'Dashboard' },
    { id: 'learn', icon: 'school', labelEs: 'Aprender', labelEn: 'Learn' },
    { id: 'scan', icon: 'photo_camera', labelEs: 'Escanear', labelEn: 'Scan' },
    { id: 'library', icon: 'menu_book', labelEs: 'Biblioteca', labelEn: 'Library' },
    { id: 'settings', icon: 'settings', labelEs: 'Configuraciones', labelEn: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[100] flex justify-around items-center px-2 sm:px-4 py-3 neu-bar border-t border-white/60">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const label = lang === 'es' ? item.labelEs : item.labelEn;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer px-3 sm:px-5 py-2 ${
              isActive
                ? 'neu-pressed text-purple-950 font-extrabold scale-95'
                : 'neu-raised text-slate-700 font-bold hover:text-purple-900 active:scale-90'
            }`}
            style={{ borderRadius: '90px' }}
          >
            <span
              className={`material-symbols-outlined text-2xl ${isActive ? 'text-purple-900' : 'text-slate-600'}`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-tight mt-0.5">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
