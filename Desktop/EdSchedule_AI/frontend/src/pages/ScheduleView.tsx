import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Download,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Filter,
  Plus,
  FileSpreadsheet,
  FileText,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';

interface LessonCard {
  id: string;
  subject: string;
  teacher: string;
  group: string;
  room: string;
  day: number;
  slot: number;
  hasConflict?: boolean;
}

export const ScheduleView: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<string>('v2');
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  const daysOfWeek = language === 'uz' ? [
    { id: 1, name: 'Dushanba' },
    { id: 2, name: 'Seshanba' },
    { id: 3, name: 'Chorshanba' },
    { id: 4, name: 'Payshanba' },
    { id: 5, name: 'Juma' },
    { id: 6, name: 'Shanba' },
  ] : [
    { id: 1, name: 'Понедельник' },
    { id: 2, name: 'Вторник' },
    { id: 3, name: 'Среда' },
    { id: 4, name: 'Четверг' },
    { id: 5, name: 'Пятница' },
    { id: 6, name: 'Суббота' },
  ];

  const timeSlots = [
    { number: 1, time: '08:30 - 10:00' },
    { number: 2, time: '10:15 - 11:45' },
    { number: 3, time: '12:15 - 13:45' },
    { number: 4, time: '14:00 - 15:30' },
    { number: 5, time: '15:45 - 17:15' },
  ];

  const [lessons, setLessons] = useState<LessonCard[]>([
    { id: '1', subject: 'Высшая математика', teacher: 'Иванов А.А.', group: 'ИС-21', room: '101 (Лекц.)', day: 1, slot: 1 },
    { id: '2', subject: 'Физика', teacher: 'Смирнов В.П.', group: 'ИС-21', room: '204 (Лаб.)', day: 1, slot: 2 },
    { id: '3', subject: 'Программирование Python', teacher: 'Каримов Ш.Т.', group: 'ИС-21', room: 'Комп. класс 1', day: 1, slot: 3 },
    { id: '4', subject: 'История Узбекистана', teacher: 'Юсупова Н.А.', group: 'ИС-22', room: '305', day: 2, slot: 1 },
    { id: '5', subject: 'Английский язык', teacher: 'Браун Э.', group: 'ИС-21', room: '108', day: 2, slot: 2 },
    { id: '6', subject: 'Базы данных', teacher: 'Каримов Ш.Т.', group: 'ИС-21', room: 'Комп. класс 2', day: 3, slot: 1 },
    { id: '7', subject: 'Алгоритмы', teacher: 'Алиев Р.Р.', group: 'ИС-22', room: '102', day: 3, slot: 2, hasConflict: true },
  ]);

  const handleExport = (format: string) => {
    setShowExportMenu(false);
    const scheduleId = 'demo-schedule-uuid';
    const url = `/api/export/export/${scheduleId}/?format=${format}&lang=${language}`;
    window.open(url, '_blank');
  };

  const filteredLessons = selectedGroup === 'all'
    ? lessons
    : lessons.filter(l => l.group === selectedGroup);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'uz' ? 'Dars jadvali: II Semestr 2026' : 'Учебное расписание: II Семестр 2026'}
            </h1>
            <span className={clsx(
              "px-3 py-1 rounded-full text-xs font-semibold",
              isPublished ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
            )}>
              {isPublished
                ? (language === 'uz' ? 'Nashr qilingan' : 'Опубликовано')
                : (language === 'uz' ? 'Qoralama (Draft)' : 'Черновик')
              }
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'uz'
              ? 'Oʻquv ishlari boʻyicha direktor oʻrinbosari kabineti'
              : 'Кабинет заместителя директора по учебной части'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Version selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-sm">
            <button
              onClick={() => setSelectedVersion('v1')}
              className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", selectedVersion === 'v1' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}
            >
              V1
            </button>
            <button
              onClick={() => setSelectedVersion('v2')}
              className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5", selectedVersion === 'v2' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}
            >
              <Sparkles className="w-3 h-3" />
              V2 AI
            </button>
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{language === 'uz' ? 'Yuklab olish' : 'Экспорт'}</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors">
                  <FileText className="w-4 h-4 text-red-500" /> PDF Документ
                </button>
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel / CSV
                </button>
                <button onClick={() => handleExport('ics')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors">
                  <Calendar className="w-4 h-4 text-blue-500" /> Календарь (ICS)
                </button>
              </div>
            )}
          </div>

          {/* Publish */}
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              isPublished
                ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {isPublished
              ? (language === 'uz' ? 'Qoralamaga qaytarish' : 'Снять с публикации')
              : (language === 'uz' ? 'Tasdiqlash va nashr etish' : 'Опубликовать')}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>{language === 'uz' ? 'Guruh:' : 'Группа:'}</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
            >
              <option value="all">{language === 'uz' ? 'Barchasi' : 'Все группы'}</option>
              <option value="ИС-21">ИС-21</option>
              <option value="ИС-22">ИС-22</option>
              <option value="ЭК-11">ЭК-11</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {language === 'uz' ? 'Konflikt yoʻq' : 'Без конфликтов'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            {language === 'uz' ? 'Konflikt mavjud' : 'Конфликт'}
          </span>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">
                  {language === 'uz' ? 'Vaqt / Dars' : 'Время / Урок'}
                </th>
                {daysOfWeek.map(day => (
                  <th key={day.id} className="p-4 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {day.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeSlots.map(slot => (
                <tr key={slot.number} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'uz' ? `${slot.number}-dars` : `Урок ${slot.number}`}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{slot.time}</div>
                  </td>
                  {daysOfWeek.map(day => {
                    const lesson = filteredLessons.find(l => l.day === day.id && l.slot === slot.number);
                    return (
                      <td key={day.id} className="p-2 border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top h-28 w-1/6">
                        {lesson ? (
                          <div className={clsx(
                            "h-full p-3 rounded-xl border text-left flex flex-col justify-between transition-all hover:shadow-md cursor-pointer",
                            lesson.hasConflict
                              ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200"
                              : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200"
                          )}>
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs line-clamp-1">{lesson.subject}</span>
                                {lesson.hasConflict && (
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{lesson.teacher}</div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-current/10">
                              <span className="font-semibold">{lesson.group}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/50 border border-current/20">{lesson.room}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-500 dark:hover:text-slate-400 cursor-pointer transition-colors">
                            <Plus className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
