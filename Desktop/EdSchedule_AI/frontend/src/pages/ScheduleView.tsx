import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Download,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import { clsx } from 'clsx';

interface LessonCard {
  id: string;
  subject: string;
  teacher: string;
  group: string;
  room: string;
  day: number; // 1 to 6
  slot: number; // 1 to 5
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

  // Демо-данные занятий для отображения в сетке
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
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'uz' ? 'Dars jadvali: II Semestr 2026' : 'Учебное расписание: II Семестр 2026'}
            </h1>
            <span className={clsx(
              "px-3 py-1 rounded-full text-xs font-semibold",
              isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            )}>
              {isPublished ? (language === 'uz' ? 'Nashr qilingan' : 'Опубликовано') : (language === 'uz' ? 'Qoralama (Draft)' : 'Черновик')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'uz'
              ? 'Oʻquv ishlari boʻyicha direktor oʻrinbosari kabineti'
              : 'Кабинет заместителя директора по учебной части'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Версии расписания */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-sm">
            <button
              onClick={() => setSelectedVersion('v1')}
              className={clsx("px-3 py-1.5 rounded-md text-xs font-medium transition-all", selectedVersion === 'v1' ? "bg-white shadow text-slate-900" : "text-slate-600")}
            >
              Версия 1
            </button>
            <button
              onClick={() => setSelectedVersion('v2')}
              className={clsx("px-3 py-1.5 rounded-md text-xs font-medium transition-all", selectedVersion === 'v2' ? "bg-white shadow text-slate-900" : "text-slate-600")}
            >
              Версия 2 (ИИ)
            </button>
          </div>

          {/* Экспорт */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{language === 'uz' ? 'Yuklab olish' : 'Экспорт'}</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" /> PDF Документ
                </button>
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel / CSV
                </button>
                <button onClick={() => handleExport('ics')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" /> Календарь (ICS)
                </button>
              </div>
            )}
          </div>

          {/* Публикация */}
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isPublished
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                : "bg-primary-600 text-white hover:bg-primary-700"
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {isPublished
              ? (language === 'uz' ? 'Qoralamaga qaytarish' : 'Снять с публикации')
              : (language === 'uz' ? 'Tasdiqlash va nashr etish' : 'Опубликовать')}
          </button>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Группа:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">Все группы</option>
              <option value="ИС-21">ИС-21</option>
              <option value="ИС-22">ИС-22</option>
              <option value="ЭК-11">ЭК-11</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Без конфликтов
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block ml-3" /> Обнаружен конфликт
        </div>
      </div>

      {/* Schedule Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">
                Время / Урок
              </th>
              {daysOfWeek.map(day => (
                <th key={day.id} className="p-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {timeSlots.map(slot => (
              <tr key={slot.number} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 border-r border-slate-200 bg-slate-50/30">
                  <div className="font-bold text-slate-900 text-sm">Урок {slot.number}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{slot.time}</div>
                </td>
                {daysOfWeek.map(day => {
                  const lesson = filteredLessons.find(l => l.day === day.id && l.slot === slot.number);
                  return (
                    <td key={day.id} className="p-2 border-r border-slate-200 last:border-r-0 align-top h-28 w-1/6">
                      {lesson ? (
                        <div className={clsx(
                          "h-full p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all hover:shadow-md cursor-pointer",
                          lesson.hasConflict
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-indigo-50/70 border-indigo-200 text-indigo-950"
                        )}>
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs line-clamp-1">{lesson.subject}</span>
                              {lesson.hasConflict && (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1">{lesson.teacher}</div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-indigo-100">
                            <span className="font-semibold text-primary-700">{lesson.group}</span>
                            <span className="bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">{lesson.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:border-slate-400 hover:text-slate-500 cursor-pointer transition-colors group">
                          <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
  );
};
