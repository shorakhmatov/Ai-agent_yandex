import React, { useState } from 'react';
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
  Sun,
  Moon,
  School,
  Building2,
  BookOpen,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { useLanguage, InstitutionType } from '../LanguageContext';
import { InstitutionSurveyModal } from './InstitutionSurveyModal';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const { t, language, setLanguage, theme, setTheme, institutionType } = useLanguage();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  const getNavItems = (type: InstitutionType) => {
    const baseItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
      { id: 'schedules', icon: CalendarDays, label: t('nav.schedules') },
    ];

    if (type === 'school') {
      return [
        ...baseItems,
        { id: 'teachers', icon: GraduationCap, label: language === 'uz' ? 'Oʻqituvchilar' : 'Учителя' },
        { id: 'groups', icon: Users, label: language === 'uz' ? 'Sinflar (1-11)' : 'Классы (1-11)' },
        { id: 'classrooms', icon: DoorOpen, label: language === 'uz' ? 'Sinf xonalari' : 'Кабинеты' },
        { id: 'ai', icon: MessageSquareCode, label: t('nav.ai_assistant') },
      ];
    } else if (type === 'college') {
      return [
        ...baseItems,
        { id: 'teachers', icon: GraduationCap, label: language === 'uz' ? 'Oʻqituvchilar' : 'Преподаватели' },
        { id: 'groups', icon: Users, label: language === 'uz' ? 'Guruhlar / Kurslar' : 'Группы / Курсы' },
        { id: 'classrooms', icon: DoorOpen, label: language === 'uz' ? 'Laboratoriya va Xonalar' : 'Аудитории / Лаб.' },
        { id: 'ai', icon: MessageSquareCode, label: t('nav.ai_assistant') },
      ];
    } else {
      return [
        ...baseItems,
        { id: 'teachers', icon: GraduationCap, label: language === 'uz' ? 'Professor-oʻqituvchilar' : 'Профессора / Кафедры' },
        { id: 'groups', icon: Users, label: language === 'uz' ? 'Talabalar oqimlari' : 'Студенческие потоки' },
        { id: 'classrooms', icon: DoorOpen, label: language === 'uz' ? 'Maʼruza zallari' : 'Лекционные залы' },
        { id: 'ai', icon: MessageSquareCode, label: t('nav.ai_assistant') },
      ];
    }
  };

  const navItems = getNavItems(institutionType);

  const getInstitutionBadge = () => {
    switch (institutionType) {
      case 'school':
        return { label: language === 'uz' ? 'Maktab' : 'Школа', icon: School, color: 'text-emerald-500 bg-emerald-500/10' };
      case 'college':
        return { label: language === 'uz' ? 'Kollej' : 'Колледж', icon: GraduationCap, color: 'text-amber-500 bg-amber-500/10' };
      case 'university':
        return { label: language === 'uz' ? 'Universitet' : 'Университет', icon: Building2, color: 'text-blue-500 bg-blue-500/10' };
      default:
        return { label: language === 'uz' ? 'Muassasa' : 'Учреждение', icon: School, color: 'text-blue-500 bg-blue-500/10' };
    }
  };

  const badge = getInstitutionBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span>EdSchedule <span className="text-blue-600 dark:text-blue-400">AI</span></span>
                <span className="text-[10px] text-slate-400 font-medium tracking-normal -mt-1">Smart Scheduling Engine</span>
              </div>
            </div>

            {/* Institution Badge */}
            <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${badge.color}`}>
                  <BadgeIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{badge.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Режим профиля</p>
                </div>
              </div>
              <button
                onClick={() => setIsSurveyOpen(true)}
                title="Сменить тип заведения"
                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  "flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150",
                  currentPage === item.id
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <item.icon className={clsx("w-5 h-5", currentPage === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button
            onClick={() => setIsSurveyOpen(true)}
            className="flex items-center gap-3 w-full px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Настройка профиля</span>
          </button>
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else window.location.reload();
            }}
            className="flex items-center gap-3 w-full px-3.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'uz' ? 'Chiqish' : 'Выйти'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 transition-colors duration-200">
          <div className="relative w-80 sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('header.search')}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setLanguage('ru')}
                className={clsx(
                  "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                  language === 'ru'
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('uz')}
                className={clsx(
                  "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                  language === 'uz'
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                UZ
              </button>
            </div>

            <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {language === 'uz' ? 'Assistant Director' : 'Зам. Директора'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{language === 'uz' ? 'Vaziypa' : 'Должность'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
                АД
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>

      {/* Survey Modal */}
      <InstitutionSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
      />
    </div>
  );
};
