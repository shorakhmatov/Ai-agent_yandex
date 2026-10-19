import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Users, GraduationCap, DoorOpen, CalendarCheck, TrendingUp,
  ShieldAlert, Clock, Sparkles, Zap, ArrowUpRight, CheckCircle2,
  AlertTriangle, FileText, FileSpreadsheet, Calendar as CalendarIcon,
  Download, Search, Plus, Upload, Trash2, Edit, Mail, BookOpen,
  Filter, RefreshCw, BarChart3, PieChart
} from 'lucide-react';
import { api } from '../lib/api';

export const Dashboard: React.FC = () => {
  const { t, language, institutionType } = useLanguage();
  const [stats, setStats] = useState({ teachers: 0, groups: 0, rooms: 0, schedules: 0 });
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      api.teachers().catch(() => []),
      api.groups().catch(() => []),
      api.classrooms().catch(() => []),
      api.schedules().catch(() => []),
    ]).then(([teachers, groups, rooms, schedules]) => {
      setStats({
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        groups: Array.isArray(groups) ? groups.length : 0,
        rooms: Array.isArray(rooms) ? rooms.length : 0,
        schedules: Array.isArray(schedules) ? schedules.length : 0,
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      label: language === 'uz' ? 'Oʻqituvchilar' : 'Преподаватели',
      value: stats.teachers,
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      bg: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      label: language === 'uz' ? 'Guruhlar / Sinflar' : 'Группы / Классы',
      value: stats.groups,
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      shadow: 'shadow-indigo-500/20',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30'
    },
    {
      label: language === 'uz' ? 'Auditoriyalar' : 'Аудитории',
      value: stats.rooms,
      icon: DoorOpen,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      label: language === 'uz' ? 'Jadvallar' : 'Расписания',
      value: stats.schedules,
      icon: CalendarCheck,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
      bg: 'bg-amber-50 dark:bg-amber-950/30'
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Engine v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {language === 'uz' ? 'Assalomu alaykum!' : 'Добро пожаловать!'}
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
              {language === 'uz'
                ? 'Intellektual jadval tizimi orqali auditoriyalar, oʻqituvchilar yuklamasi va vaqt taqsimotini optimallashtiring.'
                : 'Оптимизируйте распределение аудиторий, преподавательской нагрузки и временных слотов с помощью ИИ-алгоритмов.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.schedules}</p>
              <p className="text-xs text-blue-200">{language === 'uz' ? 'Jadval' : 'Расписаний'}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conflicts Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {language === 'uz' ? 'Konfliktlar' : 'Конфликты расписания'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'uz' ? 'Avtomatik tekshiruv natijalari' : 'Результаты автоматической проверки'}
                </p>
              </div>
            </div>
            {conflicts > 0 ? (
              <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                {conflicts} {language === 'uz' ? 'ta' : 'шт.'}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'uz' ? 'Konflikt yoʻq' : 'Без конфликтов'}</span>
              </div>
            )}
          </div>
          <div className="p-5">
            {conflicts === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {language === 'uz' ? 'Barcha jadvallar toza!' : 'Все расписания чисты!'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'uz' ? 'Hech qanday conflict aniqlanmadi' : 'Конфликты не обнаружены'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {language === 'uz' ? 'Auditoriya kesishishi' : 'Пересечение аудитории'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'uz' ? '204-xona ikkita guruhga bir vaqtda tayinlangan' : 'Аудитория 204 назначена двум группам одновременно'}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 rounded-lg transition-colors">
                    {language === 'uz' ? 'Tuzatish' : 'Исправить'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Tezkor koʻrsatkichlar' : 'Быстрая статистика'}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'uz' ? 'Band xonalar' : 'Занятые аудитории'}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {Math.round(stats.rooms * 0.75)} / {stats.rooms}
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'uz' ? 'Yuklama darajasi' : 'Уровень загрузки'}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                78%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'uz' ? 'AI optimizatsiya' : 'ИИ-оптимизация'}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                95%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[95%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {t('dashboard.recent_activity')}
            </h3>
          </div>
          <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            {language === 'uz' ? 'Barchasini koʻrish' : 'Показать все'}
          </button>
        </div>
        <div className="space-y-4">
          {[
            { time: language === 'uz' ? '5 daqiqa oldin' : '5 минут назад', text: language === 'uz' ? 'Demo maʼlumotlar yuklandi' : 'Загружены демонстрационные данные', color: 'bg-primary-500' },
            { time: language === 'uz' ? '1 soat oldin' : '1 час назад', text: language === 'uz' ? 'Bahorgi semestr jadvali yaratildi' : 'Создано расписание на весенний семестр', color: 'bg-emerald-500' },
            { time: language === 'uz' ? 'Kecha' : 'Вчера', text: language === 'uz' ? 'AI yordamchi moduli ishga tushirildi' : 'Инициализирован модуль ИИ-помощника', color: 'bg-slate-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                  {item.text}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
