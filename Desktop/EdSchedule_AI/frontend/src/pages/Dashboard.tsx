import React from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Users,
  GraduationCap,
  DoorOpen,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('dashboard.total_teachers'), value: '42', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('dashboard.total_groups'), value: '18', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('dashboard.total_classrooms'), value: '24', icon: DoorOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t('dashboard.active_schedules'), value: '3', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.dashboard')}</h1>
        <p className="text-slate-500">Добро пожаловать в систему управления расписанием EdSchedule AI.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Conflicts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Обнаруженные конфликты
            </h3>
            <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Все конфликты</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Пересечение аудитории 204</p>
                  <p className="text-xs text-slate-500">Группа ИС-21 и Математика (Иванов А.А.) в 09:00</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100">
                  Исправить
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              {t('dashboard.recent_activity')}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l-2 border-slate-100 last:border-l-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary-500" />
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">10 минут назад</p>
                <p className="text-sm text-slate-700">Опубликовано новое расписание на II семестр</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
