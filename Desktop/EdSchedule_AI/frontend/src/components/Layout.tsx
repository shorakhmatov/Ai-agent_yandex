import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  GraduationCap,
  DoorOpen,
  MessageSquareCode,
  Settings,
  LogOut,
  Search,
  Bell,
  Globe
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { id: 'schedules', icon: CalendarDays, label: t('nav.schedules') },
    { id: 'teachers', icon: GraduationCap, label: t('nav.teachers') },
    { id: 'groups', icon: Users, label: t('nav.groups') },
    { id: 'classrooms', icon: DoorOpen, label: t('nav.classrooms') },
    { id: 'ai', icon: MessageSquareCode, label: t('nav.ai_assistant') },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <CalendarDays className="w-8 h-8" />
            <span>EdSchedule AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                currentPage === item.id
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5" />
            {t('nav.settings')}
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Выход
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('header.search')}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('ru')}
                className={clsx(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  language === 'ru' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('uz')}
                className={clsx(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  language === 'uz' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                UZ
              </button>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Зам. Директора</p>
                <p className="text-xs text-slate-500">Школа №12</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-50">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
